import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { leads, payments } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { getCashfreeClient } from "@/lib/cashfree";

const joinSchema = z.object({
  leadId: z.string().uuid(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { leadId } = joinSchema.parse(body);

    // Get lead information
    const [lead] = await db
      .select()
      .from(leads)
      .where(eq(leads.id, leadId));

    if (!lead) {
      return NextResponse.json(
        { success: false, error: "Lead not found" },
        { status: 404 }
      );
    }

    // Check if already registered for workshop
    const existingPayment = await db
      .select()
      .from(payments)
      .where(eq(payments.leadId, leadId));

    if (existingPayment.length > 0) {
      return NextResponse.json({
        success: true,
        message: "Already registered for workshop",
        workshopUrl: "https://zoom.us/j/workshop-link", // Mock workshop link
      });
    }

    // Create payment record for workshop
    const [payment] = await db
      .insert(payments)
      .values({
        leadId,
        amount: "499",
        plan: "workshop",
        status: "pending",
      })
      .returning();
    let paymentUrl = '';
    let cashfreeOrderId = '';

    try {
      // Initialize Cashfree client
      const cashfree = getCashfreeClient();
      
      // Generate unique order ID
      const orderId = `JOIN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Create Cashfree order
      const orderData = {
        orderId,
        orderAmount: 499,
        orderCurrency: 'INR',
        customerDetails: {
          customerId: lead.id,
          customerName: lead.name,
          customerEmail: lead.email,
          customerPhone: lead.phone || '9999999999',
        },
        orderMeta: {
          returnUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/payment/success?orderId=${orderId}`,
          notifyUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/payments/webhook`,
        },
      };

      const cashfreeOrder = await cashfree.createOrder(orderData);
      cashfreeOrderId = cashfreeOrder.cfOrderId;
      paymentUrl = `${process.env.CASHFREE_ENVIRONMENT === 'production' ? 'https://api.cashfree.com' : 'https://sandbox.cashfree.com'}/pg/orders/${cashfreeOrderId}/pay`;
      
      // Update payment with Cashfree order ID
      await db
        .update(payments)
        .set({ 
          cashfreeOrderId: cashfreeOrderId,
          updatedAt: new Date(),
        })
        .where(eq(payments.id, payment.id));
        
    } catch (cashfreeError) {
      console.error('Cashfree integration error:', cashfreeError);
      
      // Fallback to mock for development
      cashfreeOrderId = `mock_join_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      paymentUrl = `https://sandbox.cashfree.com/pg/orders/${cashfreeOrderId}/pay`;
      
      await db
        .update(payments)
        .set({ cashfreeOrderId })
        .where(eq(payments.id, payment.id));
    }

    return NextResponse.json({
      success: true,
      payment: {
        ...payment,
        cashfreeOrderId,
      },
      paymentUrl,
      message: "Workshop registration initiated",
    });
  } catch (error) {
    console.error("Error joining workshop:", error);
    return NextResponse.json(
      { success: false, error: "Failed to join workshop" },
      { status: 400 }
    );
  }
}