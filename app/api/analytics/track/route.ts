import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { analytics } from '@/lib/db/schema'
import { z } from 'zod'

const trackingSchema = z.object({
  eventType: z.string(),
  eventData: z.string().optional(),
  userId: z.string().optional(),
  sessionId: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = trackingSchema.parse(body)

    // Get IP and user agent from headers
    const ipAddress = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'
    const referrer = request.headers.get('referer') || null

    await db.insert(analytics).values({
      ...validatedData,
      ipAddress,
      userAgent,
      referrer,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Analytics tracking error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to track event' },
      { status: 400 }
    )
  }
}