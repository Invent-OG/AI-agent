import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { leads, payments } from "@/lib/db/schema";
import { sql, eq, gte, and } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { subDays, format } from "date-fns";

export async function GET() {
  try {
    const thirtyDaysAgo = subDays(new Date(), 30);

    // Get signups by day
    const signupsData = await db
      .select({
        date: sql<string>`date(created_at)`,
        count: sql<number>`count(*)`,
      })
      .from(leads)
      .where(gte(leads.createdAt, thirtyDaysAgo))
      .groupBy(sql`date(created_at)`)
      .orderBy(sql`date(created_at)`);

    // Get conversions by day
    const conversionsData = await db
      .select({
        date: sql<string>`date(created_at)`,
        count: sql<number>`count(*)`,
      })
      .from(leads)
      .where(and(eq(leads.status, "paid"), gte(leads.createdAt, thirtyDaysAgo)))
      .groupBy(sql`date(created_at)`)
      .orderBy(sql`date(created_at)`);

    // Get revenue by day
    const p = alias(payments, "p");
    const revenueData = await db
      .select({
        date: sql<string>`date(${p.createdAt})`,
        amount: sql<number>`sum(cast(${p.amount} as decimal))`,
      })
      .from(p)
      .where(and(eq(p.status, "success"), gte(p.createdAt, thirtyDaysAgo)))
      .groupBy(sql`date(${p.createdAt})`)
      .orderBy(sql`date(${p.createdAt})`);

    // Format data for charts
    const formatData = (data: any[], dateField: string = "date") => {
      return data.map((item) => ({
        ...item,
        [dateField]: format(new Date(item[dateField]), "MMM dd"),
      }));
    };

    return NextResponse.json({
      success: true,
      data: {
        signups: formatData(signupsData),
        conversions: formatData(conversionsData),
        revenue: formatData(revenueData),
      },
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}
