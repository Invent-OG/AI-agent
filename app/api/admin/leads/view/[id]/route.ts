import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { leads, payments } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const leadId = params.id;

    // Get lead details
    const [lead] = await db
      .select()
      .from(leads)
      .where(eq(leads.id, leadId));

    if (!lead) {
      return NextResponse.json(
        { success: false, error: "Lead not found" },
        { status: 404 }
      );
    }

    // Get payment history
    const paymentHistory = await db
      .select()
      .from(payments)
      .where(eq(payments.leadId, leadId));

    // Get activity timeline (mock data for now)
    const activityTimeline = [
      {
        type: "registration",
        title: "Lead registered",
        description: `${lead.name} signed up via ${lead.source}`,
        timestamp: lead.createdAt,
      },
      ...paymentHistory.map(payment => ({
        type: "payment",
        title: `Payment ${payment.status}`,
        description: `₹${payment.amount} for ${payment.plan} plan`,
        timestamp: payment.createdAt,
      })),
    ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return NextResponse.json({
      success: true,
      data: {
        lead,
        paymentHistory,
        activityTimeline,
        stats: {
          totalSpent: paymentHistory
            .filter(p => p.status === "success")
            .reduce((sum, p) => sum + parseFloat(p.amount), 0),
          lastActivity: lead.updatedAt,
          registrationSource: lead.source,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching lead details:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch lead details" },
      { status: 500 }
    );
  }
}