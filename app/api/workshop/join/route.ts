import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { leads, payments } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

const joinSchema = z.object({
  leadId: z.string().uuid(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { leadId } = joinSchema.parse(body);

    // Get lead information
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

    // Check if already registered for workshop
    const existingPayment = await db
      .select()
      .from(payments)
      .where(eq(payments.leadId, leadId));

    if (existingPayment.length > 0) {
      return NextResponse.json({
        success: true,
        message: "Already registered for workshop",
        workshopUrl: "https://zoom.us/j/workshop-link", // Mock workshop link
      });
    }

    // Create payment record for workshop
    const [payment] = await db
      .insert(payments)
      .values({
        leadId,
        amount: "499",
        plan: "workshop",
        status: "pending",
      })
      .returning();

    // Generate Cashfree order (mock implementation)
    const cashfreeOrderId = `workshop_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    // Update payment with Cashfree order ID
    await db
      .update(payments)
      .set({ cashfreeOrderId })
      .where(eq(payments.id, payment.id));

    // Mock payment URL
    const paymentUrl = `https://sandbox.cashfree.com/pg/orders/${cashfreeOrderId}`;

    return NextResponse.json({
      success: true,
      payment,
      paymentUrl,
      message: "Workshop registration initiated",
    });
  } catch (error) {
    console.error("Error joining workshop:", error);
    return NextResponse.json(
      { success: false, error: "Failed to join workshop" },
      { status: 400 }
    );
  }
}