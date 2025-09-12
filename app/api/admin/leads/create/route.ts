import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { leads } from "@/lib/db/schema";
import { z } from "zod";
import { sendEmail, emailTemplates } from "@/lib/email";

const createLeadSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  company: z.string().optional(),
  phone: z.string().optional(),
  useCase: z.string().optional(),
  source: z.enum(["landing", "audit", "workshop"]).default("landing"),
  status: z.enum(["new", "registered", "paid"]).default("new"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createLeadSchema.parse(body);

    // Check if lead already exists
    const existingLead = await db
      .select()
      .from(leads)
      .where(eq(leads.email, validatedData.email))
      .limit(1);

    if (existingLead.length > 0) {
      return NextResponse.json(
        { success: false, error: "Lead with this email already exists" },
        { status: 400 }
      );
    }

    const [newLead] = await db
      .insert(leads)
      .values(validatedData)
      .returning();

    // Send welcome email
    if (process.env.RESEND_API_KEY) {
      await sendEmail({
        to: newLead.email,
        subject: "Welcome to AutomateFlow!",
        html: emailTemplates.welcome(newLead.name),
      });
    }

    return NextResponse.json({
      success: true,
      lead: newLead,
      message: "Lead created successfully",
    });
  } catch (error) {
    console.error("Error creating lead:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create lead" },
      { status: 400 }
    );
  }
}