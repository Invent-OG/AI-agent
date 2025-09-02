import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { leads, payments } from '@/lib/db/schema'
import { z } from 'zod'

const registrationSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(10),
  company: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = registrationSchema.parse(body)

    // Create lead record
    const [newLead] = await db
      .insert(leads)
      .values({
        ...validatedData,
        status: 'registered',
        source: 'workshop',
      })
      .returning()

    // Create payment record
    const [payment] = await db
      .insert(payments)
      .values({
        leadId: newLead.id,
        amount: '499',
        plan: 'workshop',
        status: 'pending',
      })
      .returning()

    // Generate Cashfree order (mock implementation)
    const cashfreeOrderId = `workshop_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    // Update payment with Cashfree order ID
    await db
      .update(payments)
      .set({ cashfreeOrderId })
      .where(eq(payments.id, payment.id))

    // Mock Cashfree payment URL
    const paymentUrl = `https://sandbox.cashfree.com/pg/orders/${cashfreeOrderId}`

    return NextResponse.json({
      success: true,
      lead: newLead,
      payment,
      paymentUrl,
    })
  } catch (error) {
    console.error('Error registering for workshop:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to register' },
      { status: 400 }
    )
  }
}