import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { payments, leads } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // In production, verify the webhook signature here
    
    const {
      order_id: cashfreeOrderId,
      payment_id: cashfreePaymentId,
      order_status,
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
      return NextResponse.json(
        { success: false, error: 'Payment not found' },
        { status: 404 }
      )
    }

    let paymentStatus = 'pending'
    let leadStatus = 'registered'

    if (order_status === 'PAID') {
      paymentStatus = 'success'
      leadStatus = 'paid'
    } else if (order_status === 'FAILED') {
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

      // Here you would trigger email notifications, WhatsApp messages, etc.
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error processing webhook:', error)
    return NextResponse.json(
      { success: false, error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}