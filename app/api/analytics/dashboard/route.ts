import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { analytics, leads, payments } from '@/lib/db/schema'
import { sql, eq, gte, and } from 'drizzle-orm'
import { subDays, format } from 'date-fns'

export async function GET() {
  try {
    const thirtyDaysAgo = subDays(new Date(), 30)
    const sevenDaysAgo = subDays(new Date(), 7)

    // Geographic distribution
    const geoData = await db
      .select({
        country: analytics.country,
        city: analytics.city,
        count: sql<number>`count(*)`,
      })
      .from(analytics)
      .where(and(
        gte(analytics.createdAt, thirtyDaysAgo),
        eq(analytics.eventType, 'page_view')
      ))
      .groupBy(analytics.country, analytics.city)
      .orderBy(sql`count(*) desc`)
      .limit(10)

    // Traffic sources
    const trafficSources = await db
      .select({
        source: sql<string>`
          case 
            when referrer is null or referrer = '' then 'Direct'
            when referrer like '%google%' then 'Google'
            when referrer like '%facebook%' then 'Facebook'
            when referrer like '%linkedin%' then 'LinkedIn'
            when referrer like '%twitter%' then 'Twitter'
            else 'Other'
          end
        `,
        count: sql<number>`count(*)`,
      })
      .from(analytics)
      .where(and(
        gte(analytics.createdAt, sevenDaysAgo),
        eq(analytics.eventType, 'page_view')
      ))
      .groupBy(sql`
        case 
          when referrer is null or referrer = '' then 'Direct'
          when referrer like '%google%' then 'Google'
          when referrer like '%facebook%' then 'Facebook'
          when referrer like '%linkedin%' then 'LinkedIn'
          when referrer like '%twitter%' then 'Twitter'
          else 'Other'
        end
      `)

    // Conversion funnel
    const funnelData = await db
      .select({
        stage: sql<string>`
          case 
            when status = 'new' then 'Leads'
            when status = 'registered' then 'Registered'
            when status = 'paid' then 'Paid'
          end
        `,
        count: sql<number>`count(*)`,
      })
      .from(leads)
      .where(gte(leads.createdAt, thirtyDaysAgo))
      .groupBy(leads.status)

    // Revenue by plan
    const revenueByPlan = await db
      .select({
        plan: payments.plan,
        revenue: sql<number>`sum(cast(amount as decimal))`,
        count: sql<number>`count(*)`,
      })
      .from(payments)
      .where(and(
        eq(payments.status, 'success'),
        gte(payments.createdAt, thirtyDaysAgo)
      ))
      .groupBy(payments.plan)

    return NextResponse.json({
      success: true,
      data: {
        geographic: geoData,
        trafficSources,
        funnel: funnelData,
        revenueByPlan,
      },
    })
  } catch (error) {
    console.error('Error fetching advanced analytics:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}