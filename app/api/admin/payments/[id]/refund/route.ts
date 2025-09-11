import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { payments, leads } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const paymentId = params.id;

    // Get payment details
    const [payment] = await db
      .select()
      .from(payments)
      .where(eq(payments.id, paymentId));

    if (!payment) {
      return NextResponse.json(
        { success: false, error: "Payment not found" },
        { status: 404 }
      );
    }

    if (payment.status !== "success") {
      return NextResponse.json(
        { success: false, error: "Can only refund successful payments" },
        { status: 400 }
      );
    }

    // Here you would integrate with Cashfree refund API
    // For now, we'll simulate the refund process
    
    // Update payment status to refunded
    await db
      .update(payments)
      .set({ 
        status: "refunded",
        updatedAt: new Date(),
      })
      .where(eq(payments.id, paymentId));

    // Update lead status back to registered
    await db
      .update(leads)
      .set({ 
        status: "registered",
        updatedAt: new Date(),
      })
      .where(eq(leads.id, payment.leadId));

    return NextResponse.json({
      success: true,
      message: "Refund processed successfully",
    });
  } catch (error) {
    console.error("Error processing refund:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process refund" },
      { status: 500 }
    );
  }
}