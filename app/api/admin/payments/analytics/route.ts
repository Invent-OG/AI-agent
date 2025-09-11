import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { payments } from "@/lib/db/schema";
import { sql, eq, gte } from "drizzle-orm";
import { subDays, subMonths, format } from "date-fns";

export async function GET() {
  try {
    const thirtyDaysAgo = subDays(new Date(), 30);
    const lastMonth = subMonths(new Date(), 1);

    // Get total revenue
    const [{ total }] = await db
      .select({ total: sql<number>`sum(cast(amount as decimal))` })
      .from(payments)
      .where(eq(payments.status, "success"));

    // Get this month's revenue
    const [{ thisMonth }] = await db
      .select({ thisMonth: sql<number>`sum(cast(amount as decimal))` })
      .from(payments)
      .where(
        sql`status = 'success' AND created_at >= date_trunc('month', current_date)`
      );

    // Get last month's revenue for growth calculation
    const [{ lastMonthRevenue }] = await db
      .select({ lastMonthRevenue: sql<number>`sum(cast(amount as decimal))` })
      .from(payments)
      .where(
        sql`status = 'success' AND created_at >= date_trunc('month', current_date - interval '1 month') AND created_at < date_trunc('month', current_date)`
      );

    // Calculate growth rate
    const growthRate = lastMonthRevenue > 0 
      ? Math.round(((thisMonth - lastMonthRevenue) / lastMonthRevenue) * 100)
      : 0;

    // Get revenue trend (last 30 days)
    const revenueTrend = await db
      .select({
        date: sql<string>`date(created_at)`,
        amount: sql<number>`sum(cast(amount as decimal))`,
      })
      .from(payments)
      .where(
        sql`status = 'success' AND created_at >= ${thirtyDaysAgo}`
      )
      .groupBy(sql`date(created_at)`)
      .orderBy(sql`date(created_at)`);

    // Get revenue by plan
    const revenueByPlan = await db
      .select({
        plan: payments.plan,
        value: sql<number>`sum(cast(amount as decimal))`,
        count: sql<number>`count(*)`,
      })
      .from(payments)
      .where(eq(payments.status, "success"))
      .groupBy(payments.plan);

    return NextResponse.json({
      success: true,
      data: {
        total: Number(total) || 0,
        thisMonth: Number(thisMonth) || 0,
        growthRate,
        trend: revenueTrend.map(item => ({
          date: format(new Date(item.date), "MMM dd"),
          amount: Number(item.amount),
        })),
        byPlan: revenueByPlan.map(item => ({
          name: item.plan,
          value: Number(item.value),
          count: Number(item.count),
        })),
      },
    });
  } catch (error) {
    console.error("Error fetching payment analytics:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}