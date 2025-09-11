import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { leads } from "@/lib/db/schema";
import { count, eq, gte, sql } from "drizzle-orm";
import { subDays, subMonths } from "date-fns";

export async function GET() {
  try {
    const thirtyDaysAgo = subDays(new Date(), 30);
    const thisMonth = subMonths(new Date(), 0);

    // Get total leads
    const [{ total }] = await db
      .select({ total: count() })
      .from(leads);

    // Get new leads (this month)
    const [{ newLeads }] = await db
      .select({ newLeads: count() })
      .from(leads)
      .where(gte(leads.createdAt, thisMonth));

    // Get paid customers
    const [{ paid }] = await db
      .select({ paid: count() })
      .from(leads)
      .where(eq(leads.status, "paid"));

    // Calculate conversion rate
    const conversionRate = total > 0 ? Math.round((paid / total) * 100) : 0;

    // Get this month's leads
    const [{ thisMonth: thisMonthCount }] = await db
      .select({ thisMonth: count() })
      .from(leads)
      .where(gte(leads.createdAt, thisMonth));

    return NextResponse.json({
      success: true,
      stats: {
        total,
        new: newLeads,
        paid,
        conversionRate,
        thisMonth: thisMonthCount,
      },
    });
  } catch (error) {
    console.error("Error fetching leads stats:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}