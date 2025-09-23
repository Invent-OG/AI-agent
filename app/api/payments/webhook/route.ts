import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { payments, leads } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { sendEmail, emailTemplates } from '@/lib/email'
import { getCashfreeClient } from '@/lib/cashfree'

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text()
    const body = JSON.parse(rawBody)

    // Verify webhook signature
    const signature = request.headers.get('x-webhook-signature')
    const timestamp = request.headers.get('x-webhook-timestamp')

    if (signature && timestamp) {
      try {
        const cashfree = getCashfreeClient()
        const isValid = cashfree.verifyWebhookSignature(rawBody, signature, timestamp)
        
        if (!isValid) {
          console.error('Invalid webhook signature')
          return NextResponse.json(
            { success: false, error: 'Invalid signature' },
            { status: 401 }
          )
        }
      } catch (error) {
        console.error('Signature verification error:', error)
        // Continue processing for development/testing
      }
    }

    const {
      data: {
        order: {
          order_id: cashfreeOrderId,
          order_status,
        },
        payment: {
          cf_payment_id: cashfreePaymentId,
        } = {},
      },
    } = body
    if (!cashfreeOrderId) {
      return NextResponse.json(
        { success: false, error: 'Missing order ID' },
        { status: 400 }
      )
    }

    // Find payment by Cashfree order ID
    const [payment] = await db
      .select()
      .from(payments)
      .where(eq(payments.cashfreeOrderId, cashfreeOrderId))

    if (!payment) {
      console.error('Payment not found for order:', cashfreeOrderId)
      return NextResponse.json(
        { success: false, error: 'Payment not found' },
        { status: 404 }
      )
    }

    // Get lead information
    const [lead] = await db
      .select()
      .from(leads)
      .where(eq(leads.id, payment.leadId))

    let paymentStatus = 'pending'
    let leadStatus = 'registered'

    if (order_status === 'PAID' || order_status === 'ACTIVE') {
      paymentStatus = 'success'
      leadStatus = 'paid'
    } else if (order_status === 'FAILED' || order_status === 'CANCELLED') {
      paymentStatus = 'failed'
    } else if (order_status === 'EXPIRED') {
      paymentStatus = 'failed'
    }

    // Update payment status
    await db
      .update(payments)
      .set({
        status: paymentStatus as any,
        cashfreePaymentId,
        updatedAt: new Date(),
      })
      .where(eq(payments.id, payment.id))

    // Update lead status if payment successful
    if (paymentStatus === 'success') {
      await db
        .update(leads)
        .set({
          status: leadStatus as any,
          updatedAt: new Date(),
        })
        .where(eq(leads.id, payment.leadId))

      // Send payment confirmation email
      if (lead && process.env.RESEND_API_KEY) {
        try {
          await sendEmail({
            to: lead.email,
            subject: "Payment Confirmed - AutomateFlow",
            html: emailTemplates.paymentConfirmation(
              lead.name,
              payment.amount,
              payment.plan
            ),
          });
        } catch (emailError) {
          console.error('Failed to send confirmation email:', emailError)
          // Don't fail the webhook for email errors
        }
      }
    }

    console.log('Webhook processed successfully:', {
      orderId: cashfreeOrderId,
      status: paymentStatus,
      leadId: payment.leadId,
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error processing webhook:', error)
    return NextResponse.json(
      { success: false, error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}