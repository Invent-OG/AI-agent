import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { payments, leads } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { getCashfreeClient } from "@/lib/cashfree";

const paymentSchema = z.object({
  leadId: z.string().uuid(),
  plan: z.enum(["starter", "pro", "business"]),
  hasUpsell: z.boolean().default(false),
});

const planPrices = {
  starter: 2499,
  pro: 4999,
  business: 9999,
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { leadId, plan, hasUpsell } = paymentSchema.parse(body);

    // Verify lead exists
    const [lead] = await db.select().from(leads).where(eq(leads.id, leadId));
    if (!lead) {
      return NextResponse.json(
        { success: false, error: "Lead not found" },
        { status: 404 }
      );
    }

    let amount = planPrices[plan];
    if (hasUpsell) {
      amount += 999; // Add upsell amount
    }

    // Create payment record
    const [payment] = await db
      .insert(payments)
      .values({
        leadId,
        amount: amount.toString(),
        plan,
        hasUpsell,
        status: "pending",
      })
      .returning();

    try {
      // Initialize Cashfree client
      const cashfree = getCashfreeClient();

      // Generate unique order ID
      const orderId = `AF_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Create Cashfree order
      const orderData = {
        order_id: orderId,
        order_amount: amount,
        order_currency: "INR",
        customer_details: {
          customer_id: lead.id,
          customer_name: lead.name,
          customer_email: lead.email,
          customer_phone: lead.phone || "9999999999",
        },
        order_meta: {
          return_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/payment/success?orderId=${orderId}`,
          notify_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/payments/webhook`,
        },
      };

      const cashfreeOrder = await cashfree.createOrder(orderData);

      // Update payment with Cashfree order details
      await db
        .update(payments)
        .set({
          cashfreeOrderId: cashfreeOrder.cf_order_id,
          updatedAt: new Date(),
        })
        .where(eq(payments.id, payment.id));

      // Generate payment URL
      const paymentUrl = `${process.env.CASHFREE_ENVIRONMENT === 'production' ? 'https://api.cashfree.com' : 'https://sandbox.cashfree.com'}/pg/orders/${cashfreeOrder.cf_order_id}/pay`;

      return NextResponse.json({
        success: true,
        payment: {
          ...payment,
          cashfreeOrderId: cashfreeOrder.cf_order_id,
        },
        cashfree: {
          orderId: cashfreeOrder.cf_order_id,
          paymentUrl,
          orderStatus: cashfreeOrder.order_status,
          paymentSessionId: cashfreeOrder.payment_session_id,
        },
      });
    } catch (cashfreeError) {
      console.error("Cashfree integration error:", cashfreeError);

      // Fallback to mock for development
      const mockOrderId = `mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      await db
        .update(payments)
        .set({ cashfreeOrderId: mockOrderId })
        .where(eq(payments.id, payment.id));

      return NextResponse.json({
        success: true,
        payment: {
          ...payment,
          cashfreeOrderId: mockOrderId,
        },
        cashfree: {
          orderId: mockOrderId,
          paymentUrl: `https://sandbox.cashfree.com/pg/orders/${mockOrderId}/pay`,
          orderStatus: "ACTIVE",
        },
        warning: "Using mock payment for development",
      });
    }
  } catch (error) {
    console.error("Error creating payment:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create payment" },
      { status: 400 }
    );
  }
}
