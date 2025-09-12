import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { leads, payments } from "@/lib/db/schema";
import { sql, gte } from "drizzle-orm";
import { subDays, format } from "date-fns";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const range = searchParams.get("range") || "30d";

    // Determine start date
    let startDate: Date;
    switch (range) {
      case "7d":
        startDate = subDays(new Date(), 7);
        break;
      case "90d":
        startDate = subDays(new Date(), 90);
        break;
      case "1y":
        startDate = subDays(new Date(), 365);
        break;
      default:
        startDate = subDays(new Date(), 30);
    }

    // Convert to ISO string only for raw SQL queries
    const startDateISO = startDate.toISOString();

    // Total revenue (raw SQL because of sum cast)
    const [{ totalRevenue }] = await db
      .select({ totalRevenue: sql<number>`sum(cast(amount as decimal))` })
      .from(payments)
      .where(sql`status = 'success' AND created_at >= ${startDateISO}`);

    // New leads (use gte with Date object)
    const [{ newLeads }] = await db
      .select({ newLeads: sql<number>`count(*)` })
      .from(leads)
      .where(gte(leads.createdAt, startDate));

    // Total leads for conversion
    const [{ totalLeads }] = await db
      .select({ totalLeads: sql<number>`count(*)` })
      .from(leads)
      .where(gte(leads.createdAt, startDate));

    // Paid leads (raw SQL)
    const [{ paidLeads }] = await db
      .select({ paidLeads: sql<number>`count(*)` })
      .from(leads)
      .where(sql`status = 'paid' AND created_at >= ${startDateISO}`);

    const conversionRate =
      totalLeads > 0 ? Math.round((paidLeads / totalLeads) * 100) : 0;

    // Revenue data by date
    const revenueData = await db
      .select({
        date: sql<string>`date(created_at)`,
        amount: sql<number>`sum(cast(amount as decimal))`,
      })
      .from(payments)
      .where(sql`status = 'success' AND created_at >= ${startDateISO}`)
      .groupBy(sql`date(created_at)`)
      .orderBy(sql`date(created_at)`);

    // Leads data by date
    const leadsData = await db
      .select({
        date: sql<string>`date(created_at)`,
        count: sql<number>`count(*)`,
      })
      .from(leads)
      .where(gte(leads.createdAt, startDate))
      .groupBy(sql`date(created_at)`)
      .orderBy(sql`date(created_at)`);

    // Revenue by plan
    const revenueByPlan = await db
      .select({
        plan: payments.plan,
        revenue: sql<number>`sum(cast(amount as decimal))`,
        count: sql<number>`count(*)`,
      })
      .from(payments)
      .where(sql`status = 'success' AND created_at >= ${startDateISO}`)
      .groupBy(payments.plan);

    // Lead sources
    const leadSources = await db
      .select({
        source: leads.source,
        count: sql<number>`count(*)`,
      })
      .from(leads)
      .where(gte(leads.createdAt, startDate))
      .groupBy(leads.source);

    // Mock conversion funnel
    const conversionFunnel = [
      { name: "Visitors", count: totalLeads * 3, percentage: 100 },
      { name: "Leads", count: totalLeads, percentage: 33 },
      {
        name: "Registered",
        count: Math.floor(totalLeads * 0.6),
        percentage: 20,
      },
      { name: "Paid", count: paidLeads, percentage: conversionRate / 3 },
    ];

    // Mock workshop stats
    const workshopStats = {
      registered: 72,
      attended: 68,
      attendanceRate: 94,
      satisfaction: 4.8,
      revenue: 35856,
    };

    return NextResponse.json({
      success: true,
      data: {
        totalRevenue: Number(totalRevenue) || 0,
        newLeads: Number(newLeads) || 0,
        conversionRate,
        workshopAttendance: workshopStats.attended,
        revenueData: revenueData.map((item) => ({
          date: format(new Date(item.date), "MMM dd"),
          amount: Number(item.amount),
        })),
        leadsData: leadsData.map((item) => ({
          date: format(new Date(item.date), "MMM dd"),
          count: Number(item.count),
        })),
        revenueByPlan: revenueByPlan.map((item) => ({
          plan: item.plan,
          revenue: Number(item.revenue),
          count: Number(item.count),
        })),
        leadSources: leadSources.map((item) => ({
          name: item.source || "Direct",
          value: Number(item.count),
        })),
        conversionFunnel,
        workshopStats,
        growthData: revenueData.map((item, index) => ({
          date: format(new Date(item.date), "MMM dd"),
          leads: leadsData[index]?.count || 0,
          revenue: Number(item.amount),
        })),
      },
    });
  } catch (error) {
    console.error("Error fetching reports:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch reports" },
      { status: 500 }
    );
  }
}
