import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { payments, leads } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { sendEmail, emailTemplates } from "@/lib/email";
import { getCashfreeClient } from "@/lib/cashfree";

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    console.log("Webhook received:", rawBody);

    let body;
    try {
      body = JSON.parse(rawBody);
    } catch (parseError) {
      console.error("Failed to parse webhook body:", parseError);
      return NextResponse.json(
        { success: false, error: "Invalid JSON" },
        { status: 400 }
      );
    }

    // Verify webhook signature according to Cashfree docs
    const signature = request.headers.get("x-webhook-signature");
    const timestamp = request.headers.get("x-webhook-timestamp");

    if (signature && timestamp) {
      try {
        const cashfree = getCashfreeClient();
        const isValid = cashfree.verifyWebhookSignature(
          rawBody,
          signature,
          timestamp
        );

        if (!isValid) {
          console.error("Invalid webhook signature");
          return NextResponse.json(
            { success: false, error: "Invalid signature" },
            { status: 401 }
          );
        }
      } catch (error) {
        console.error("Signature verification error:", error);
        // Continue processing for development/testing
      }
    }

    // Extract data according to Cashfree webhook structure
    const data = body?.data ?? body;
    const order = data?.order ?? data;
    const payment = data?.payment ?? {};

    const cashfreeOrderId: string | undefined = 
      order?.cf_order_id || 
      order?.order_id || 
      body?.order_id;
    
    const orderStatus: string | undefined = 
      order?.order_status || 
      body?.order_status;
    
    const cashfreePaymentId: string | undefined = 
      payment?.cf_payment_id || 
      payment?.payment_id || 
      body?.payment_id;

    console.log("Webhook data extracted:", {
      cashfreeOrderId,
      orderStatus,
      cashfreePaymentId,
      eventType: body?.type || "unknown",
    });

    if (!cashfreeOrderId) {
      console.error("Missing order ID in webhook:", body);
      return NextResponse.json(
        { success: false, error: "Missing order ID" },
        { status: 400 }
      );
    }

    // Find payment by Cashfree order ID
    const [dbPayment] = await db
      .select()
      .from(payments)
      .where(eq(payments.cashfreeOrderId, cashfreeOrderId));

    if (!dbPayment) {
      console.error("Payment not found for order:", cashfreeOrderId);
      return NextResponse.json(
        { success: false, error: "Payment not found" },
        { status: 404 }
      );
    }

    // Get lead information
    const [lead] = await db
      .select()
      .from(leads)
      .where(eq(leads.id, dbPayment.leadId));

    let paymentStatus: "pending" | "success" | "failed" = "pending";
    let leadStatus: "registered" | "paid" = "registered";

    // Map Cashfree order status to our status
    switch (orderStatus?.toUpperCase()) {
      case "PAID":
      case "ACTIVE":
        paymentStatus = "success";
        leadStatus = "paid";
        break;
      case "FAILED":
      case "CANCELLED":
      case "EXPIRED":
      case "TERMINATED":
        paymentStatus = "failed";
        break;
      default:
        paymentStatus = "pending";
    }

    console.log("Status mapping:", {
      cashfreeStatus: orderStatus,
      mappedPaymentStatus: paymentStatus,
      mappedLeadStatus: leadStatus,
    });

    // Update payment status
    await db
      .update(payments)
      .set({
        status: paymentStatus,
        cashfreePaymentId,
        updatedAt: new Date(),
      })
      .where(eq(payments.id, dbPayment.id));

    // Update lead status if payment successful
    if (paymentStatus === "success" && lead) {
      await db
        .update(leads)
        .set({
          status: leadStatus,
          updatedAt: new Date(),
        })
        .where(eq(leads.id, dbPayment.leadId));

      // Send payment confirmation email
      if (process.env.RESEND_API_KEY) {
        try {
          await sendEmail({
            to: lead.email,
            subject: "Payment Confirmed - AutomateFlow Workshop",
            html: emailTemplates.paymentConfirmation(
              lead.name,
              dbPayment.amount,
              dbPayment.plan
            ),
          });
        } catch (emailError) {
          console.error("Failed to send confirmation email:", emailError);
          // Don't fail the webhook for email errors
        }
      }
    }

    console.log("Webhook processed successfully:", {
      orderId: cashfreeOrderId,
      paymentStatus,
      leadStatus,
      leadId: dbPayment.leadId,
    });

    return NextResponse.json({ 
      success: true,
      message: "Webhook processed successfully",
      data: {
        orderId: cashfreeOrderId,
        status: paymentStatus,
      }
    });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: "Webhook processing failed",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}