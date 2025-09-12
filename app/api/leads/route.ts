import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { leads } from "@/lib/db/schema";
import { z } from "zod";
import { eq, and, desc } from "drizzle-orm";
import { sendEmail, emailTemplates } from "@/lib/email";

const leadSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  company: z.string().optional(),
  useCase: z.string().optional(),
  phone: z.string().optional(),
  source: z.enum(["landing", "audit"]).default("landing"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = leadSchema.parse(body);

    const [newLead] = await db
      .insert(leads)
      .values({
        ...validatedData,
        status: "new",
      })
      .returning();

    // Send welcome email
    if (process.env.RESEND_API_KEY) {
      await sendEmail({
        to: newLead.email,
        subject: "Welcome to AutomateFlow!",
        html: emailTemplates.welcome(newLead.name),
      });
    }
    return NextResponse.json({ success: true, lead: newLead });
  } catch (error) {
    console.error("Error creating lead:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create lead" },
      { status: 400 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const source = searchParams.get("source");
    const limit = searchParams.get("limit");

    const conditions = [];
    if (status) {
      conditions.push(eq(leads.status, status as any));
    }
    if (source) {
      conditions.push(eq(leads.source, source as any));
    }

    let query = db
      .select()
      .from(leads)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(leads.createdAt));
    
    if (limit) {
      query = query.limit(parseInt(limit));
    }
    
    const allLeads = await query;

    return NextResponse.json({ success: true, leads: allLeads });
  } catch (error) {
    console.error("Error fetching leads:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch leads" },
      { status: 500 }
    );
  }
}
