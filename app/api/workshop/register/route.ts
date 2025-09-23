import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { leads, payments } from "@/lib/db/schema";
import { z } from "zod";
import { sendEmail, emailTemplates } from "@/lib/email";
import { getCashfreeClient } from "@/lib/cashfree";

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

    // Create lead record
    const [newLead] = await db
      .insert(leads)
      .values({
        ...validatedData,
        status: "registered",
        source: "workshop",
      })
      .returning();

    // Create payment record
    const [payment] = await db
      .insert(payments)
      .values({
        leadId: newLead.id,
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
      const orderId = `WS_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Create Cashfree order
      const orderData = {
        orderId,
        orderAmount: 499,
        orderCurrency: 'INR',
        customerDetails: {
          customerId: newLead.id,
          customerName: newLead.name,
          customerEmail: newLead.email,
          customerPhone: newLead.phone,
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
      cashfreeOrderId = `mock_workshop_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      paymentUrl = `https://sandbox.cashfree.com/pg/orders/${cashfreeOrderId}/pay`;
      
      await db
        .update(payments)
        .set({ cashfreeOrderId })
        .where(eq(payments.id, payment.id));
    }

    // Send welcome email
    if (process.env.RESEND_API_KEY) {
      try {
        await sendEmail({
          to: newLead.email,
          subject: "Workshop Registration Confirmed!",
          html: emailTemplates.welcome(newLead.name),
        });
      } catch (emailError) {
        console.error('Failed to send welcome email:', emailError);
        // Don't fail the registration for email errors
      }
    }

    return NextResponse.json({
      success: true,
      lead: newLead,
      payment: {
        ...payment,
        cashfreeOrderId,
      },
      paymentUrl,
    });
  } catch (error) {
    console.error("Error registering for workshop:", error);
    return NextResponse.json(
      { success: false, error: "Failed to register" },
      { status: 400 }
    );
  }
}