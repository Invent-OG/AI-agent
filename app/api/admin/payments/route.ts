import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { payments, leads } from "@/lib/db/schema";
import { eq, and, desc } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const plan = searchParams.get("plan");

    const conditions = [];
    if (status && status !== "all") {
      conditions.push(eq(payments.status, status as any));
    }
    if (plan && plan !== "all") {
      conditions.push(eq(payments.plan, plan as any));
    }

    const paymentsWithLeads = await db
      .select({
        id: payments.id,
        leadId: payments.leadId,
        amount: payments.amount,
        currency: payments.currency,
        cashfreeOrderId: payments.cashfreeOrderId,
        cashfreePaymentId: payments.cashfreePaymentId,
        status: payments.status,
        plan: payments.plan,
        hasUpsell: payments.hasUpsell,
        createdAt: payments.createdAt,
        updatedAt: payments.updatedAt,
        leadName: leads.name,
        leadEmail: leads.email,
      })
      .from(payments)
      .leftJoin(leads, eq(payments.leadId, leads.id))
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(payments.createdAt));

    return NextResponse.json({
      success: true,
      payments: paymentsWithLeads,
    });
  } catch (error) {
    console.error("Error fetching payments:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch payments" },
      { status: 500 }
    );
  }
}