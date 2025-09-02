import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { leads, payments } from '@/lib/db/schema'
import { count, eq, sql } from 'drizzle-orm'

export async function GET() {
  try {
    // Get total leads
    const [{ totalLeads }] = await db
      .select({ totalLeads: count() })
      .from(leads)

    // Get paid customers
    const [{ paidCustomers }] = await db
      .select({ paidCustomers: count() })
      .from(leads)
      .where(eq(leads.status, 'paid'))

    // Calculate conversion rate
    const conversionRate = totalLeads > 0 ? Math.round((paidCustomers / totalLeads) * 100) : 0

    // Get total revenue
    const revenueResult = await db
      .select({ total: sql<number>`sum(cast(amount as decimal))` })
      .from(payments)
      .where(eq(payments.status, 'success'))

    const revenue = revenueResult[0]?.total || 0

    return NextResponse.json({
      success: true,
      stats: {
        totalLeads,
        paidCustomers,
        conversionRate,
        revenue: Number(revenue),
      },
    })
  } catch (error) {
    console.error('Error fetching admin stats:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}