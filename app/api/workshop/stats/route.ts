import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { leads, payments } from "@/lib/db/schema";
import { count, eq, sql, and } from "drizzle-orm";

export async function GET() {
  try {
    // Get total registrations
    const [{ totalRegistrations }] = await db
      .select({ totalRegistrations: count() })
      .from(leads)
      .where(eq(leads.source, "workshop"));

    // Get paid attendees
    const [{ paidAttendees }] = await db
      .select({ paidAttendees: count() })
      .from(leads)
      .where(and(eq(leads.status, "paid"), eq(leads.source, "workshop")));

    // Calculate conversion rate
    const conversionRate =
      totalRegistrations > 0
        ? Math.round((paidAttendees / totalRegistrations) * 100)
        : 0;

    // Get total revenue
    const revenueResult = await db
      .select({ total: sql<number>`sum(cast(amount as decimal))` })
      .from(payments)
      .where(
        and(eq(payments.status, "success"), eq(payments.plan, "workshop"))
      );

    const revenue = revenueResult[0]?.total || 0;

    return NextResponse.json({
      success: true,
      stats: {
        totalRegistrations,
        paidAttendees,
        conversionRate,
        revenue: Number(revenue),
      },
    });
  } catch (error) {
    console.error("Error fetching workshop stats:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
