import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { leads } from '@/lib/db/schema'
import { z } from 'zod'

const leadSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  company: z.string().optional(),
  useCase: z.string().optional(),
  phone: z.string().optional(),
  source: z.enum(['landing', 'audit']).default('landing'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = leadSchema.parse(body)

    const [newLead] = await db
      .insert(leads)
      .values({
        ...validatedData,
        status: 'new',
      })
      .returning()

    return NextResponse.json({ success: true, lead: newLead })
  } catch (error) {
    console.error('Error creating lead:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create lead' },
      { status: 400 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const source = searchParams.get('source')

    let query = db.select().from(leads)

    // Add filters if provided
    if (status) {
      query = query.where(eq(leads.status, status as any))
    }
    if (source) {
      query = query.where(eq(leads.source, source as any))
    }

    const allLeads = await query.orderBy(desc(leads.createdAt))

    return NextResponse.json({ success: true, leads: allLeads })
  } catch (error) {
    console.error('Error fetching leads:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch leads' },
      { status: 500 }
    )
  }
}