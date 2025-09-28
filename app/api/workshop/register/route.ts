import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { leads, payments } from "@/lib/db/schema";
import { z } from "zod";
import { sendEmail, emailTemplates } from "@/lib/email";
import { getCashfreeClient } from "@/lib/cashfree";
import { getWorkshopPricing } from "@/lib/workshop-config";

const registrationSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(10),
  company: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = registrationSchema.parse(body);

    // Check if lead already exists
    const existingLead = await db
      .select()
      .from(leads)
      .where(eq(leads.email, validatedData.email))
      .limit(1);

    let leadRecord;
    if (existingLead.length > 0) {
      // Update existing lead
      const [updatedLead] = await db
        .update(leads)
        .set({
          ...validatedData,
          status: "registered",
          source: "workshop",
          updatedAt: new Date(),
        })
        .where(eq(leads.id, existingLead[0].id))
        .returning();
      leadRecord = updatedLead;
    } else {
      // Create new lead
      const [newLead] = await db
        .insert(leads)
        .values({
          ...validatedData,
          status: "registered",
          source: "workshop",
        })
        .returning();
      leadRecord = newLead;
    }

    // Get current workshop pricing
    const pricing = getWorkshopPricing();

    // Create payment record
    const [payment] = await db
      .insert(payments)
      .values({
        leadId: leadRecord.id,
        amount: pricing.current.toString(),
        plan: "workshop",
        status: "pending",
      })
      .returning();

    let paymentUrl = "";
    let cashfreeOrderId = "";

    try {
      // Initialize Cashfree client
      const cashfree = getCashfreeClient();

      // Generate unique order ID
      const orderId = `WS_${Date.now()}_${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

      // Create Cashfree order with proper structure
      const orderData = {
        order_id: orderId,
        order_amount: pricing.current,
        order_currency: pricing.currency,
        customer_details: {
          customer_id: leadRecord.id,
          customer_name: leadRecord.name,
          customer_email: leadRecord.email,
          customer_phone: leadRecord.phone || "9999999999",
        },
        order_meta: {
          return_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/payment/success?orderId=${orderId}`,
          notify_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/payments/webhook`,
        },
        order_note: "AutomateFlow Workshop Registration",
        order_tags: {
          plan: "workshop",
          leadId: leadRecord.id,
          source: "workshop_registration",
        },
      };

      console.log("Creating workshop payment order:", { orderId, amount: pricing.current });

      const cashfreeOrder = await cashfree.createOrder(orderData);
      cashfreeOrderId = cashfreeOrder.cf_order_id;
      
      // Use the correct payment URL format
      paymentUrl = `${process.env.CASHFREE_ENVIRONMENT === "production" 
        ? "https://payments.cashfree.com" 
        : "https://payments-test.cashfree.com"}/pay/order/${cashfreeOrder.payment_session_id}`;

      // Update payment with Cashfree order ID
      await db
        .update(payments)
        .set({
          cashfreeOrderId: cashfreeOrderId,
          updatedAt: new Date(),
        })
        .where(eq(payments.id, payment.id));

      console.log("Workshop payment order created successfully:", {
        orderId: cashfreeOrderId,
        paymentUrl,
        sessionId: cashfreeOrder.payment_session_id,
      });

    } catch (cashfreeError) {
      console.error("Cashfree integration error:", cashfreeError);

      // Fallback to mock for development
      cashfreeOrderId = `mock_workshop_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      paymentUrl = `https://payments-test.cashfree.com/pay/order/${cashfreeOrderId}`;

      await db
        .update(payments)
        .set({ 
          cashfreeOrderId,
          updatedAt: new Date(),
        })
        .where(eq(payments.id, payment.id));

      console.log("Using mock payment for development:", { cashfreeOrderId, paymentUrl });
    }

    // Send welcome email
    if (process.env.RESEND_API_KEY) {
      try {
        await sendEmail({
          to: leadRecord.email,
          subject: "Workshop Registration Confirmed!",
          html: emailTemplates.welcome(leadRecord.name),
        });
      } catch (emailError) {
        console.error("Failed to send welcome email:", emailError);
        // Don't fail the registration for email errors
      }
    }

    return NextResponse.json({
      success: true,
      lead: leadRecord,
      payment: {
        ...payment,
        cashfreeOrderId,
      },
      paymentUrl,
      pricing,
    });
  } catch (error) {
    console.error("Error registering for workshop:", error);
    return NextResponse.json(
      { success: false, error: "Failed to register" },
      { status: 400 }
    );
  }
}