import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { leads } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

const statusSchema = z.object({
  status: z.enum(["new", "registered", "paid"]),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const leadId = params.id;
    const body = await request.json();
    const { status } = statusSchema.parse(body);

    await db
      .update(leads)
      .set({ 
        status,
        updatedAt: new Date(),
      })
      .where(eq(leads.id, leadId));

    return NextResponse.json({
      success: true,
      message: "Lead status updated successfully",
    });
  } catch (error) {
    console.error("Error updating lead status:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update status" },
      { status: 400 }
    );
  }
}