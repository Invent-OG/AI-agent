import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { payments, leads } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { z } from 'zod'

const paymentSchema = z.object({
  leadId: z.string().uuid(),
  plan: z.enum(['starter', 'pro', 'business']),
  hasUpsell: z.boolean().default(false),
})

const planPrices = {
  starter: 2499,
  pro: 4999,
  business: 9999,
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { leadId, plan, hasUpsell } = paymentSchema.parse(body)

    // Verify lead exists
    const [lead] = await db.select().from(leads).where(eq(leads.id, leadId))
    if (!lead) {
      return NextResponse.json(
        { success: false, error: 'Lead not found' },
        { status: 404 }
      )
    }

    let amount = planPrices[plan]
    if (hasUpsell) {
      amount += 999 // Add upsell amount
    }

    // Create payment record
    const [payment] = await db
      .insert(payments)
      .values({
        leadId,
        amount: amount.toString(),
        plan,
        hasUpsell,
        status: 'pending',
      })
      .returning()

    // Here you would integrate with Cashfree API
    // For now, we'll create a mock Cashfree order
    const cashfreeOrderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    // Update payment with Cashfree order ID
    await db
      .update(payments)
      .set({ cashfreeOrderId })
      .where(eq(payments.id, payment.id))

    // Mock Cashfree response
    const cashfreeResponse = {
      order_id: cashfreeOrderId,
      payment_url: `https://sandbox.cashfree.com/pg/orders/${cashfreeOrderId}`,
      order_status: 'ACTIVE',
    }

    return NextResponse.json({
      success: true,
      payment,
      cashfree: cashfreeResponse,
    })
  } catch (error) {
    console.error('Error creating payment:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create payment' },
      { status: 400 }
    )
  }
}