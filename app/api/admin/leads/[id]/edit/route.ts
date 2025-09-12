import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { leads } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

const updateLeadSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  company: z.string().optional(),
  phone: z.string().optional(),
  useCase: z.string().optional(),
  status: z.enum(["new", "registered", "paid"]).optional(),
});

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const leadId = params.id;
    const body = await request.json();
    const validatedData = updateLeadSchema.parse(body);

    const [updatedLead] = await db
      .update(leads)
      .set({
        ...validatedData,
        updatedAt: new Date(),
      })
      .where(eq(leads.id, leadId))
      .returning();

    if (!updatedLead) {
      return NextResponse.json(
        { success: false, error: "Lead not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      lead: updatedLead,
      message: "Lead updated successfully",
    });
  } catch (error) {
    console.error("Error updating lead:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update lead" },
      { status: 400 }
    );
  }
}