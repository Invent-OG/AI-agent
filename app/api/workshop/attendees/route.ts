import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { leads } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'

export async function GET() {
  try {
    const attendees = await db
      .select()
      .from(leads)
      .where(eq(leads.source, 'workshop'))
      .orderBy(desc(leads.createdAt))

    return NextResponse.json({
      success: true,
      attendees,
    })
  } catch (error) {
    console.error('Error fetching attendees:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch attendees' },
      { status: 500 }
    )
  }
}