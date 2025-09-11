import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { leads } from "@/lib/db/schema";
import { inArray } from "drizzle-orm";
import { z } from "zod";

const bulkEmailSchema = z.object({
  leadIds: z.array(z.string().uuid()),
  subject: z.string().min(1),
  message: z.string().min(1),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { leadIds, subject, message } = bulkEmailSchema.parse(body);

    // Get leads
    const selectedLeads = await db
      .select()
      .from(leads)
      .where(inArray(leads.id, leadIds));

    // Here you would integrate with your email service
    // For now, we'll simulate sending emails
    const emailPromises = selectedLeads.map(async (lead) => {
      // Simulate email sending
      console.log(`Sending email to ${lead.email}: ${subject}`);
      return { leadId: lead.id, status: "sent" };
    });

    const results = await Promise.all(emailPromises);

    return NextResponse.json({
      success: true,
      message: `Emails sent to ${results.length} leads`,
      results,
    });
  } catch (error) {
    console.error("Error sending bulk emails:", error);
    return NextResponse.json(
      { success: false, error: "Failed to send emails" },
      { status: 400 }
    );
  }
}