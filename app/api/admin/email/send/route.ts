import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { leads } from "@/lib/db/schema";
import { eq, inArray } from "drizzle-orm";
import { sendBulkEmail } from "@/lib/email";

const campaignSchema = z.object({
  name: z.string().min(1),
  subject: z.string().min(1),
  message: z.string().min(1),
  recipients: z.string(),
  templateId: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const campaignData = campaignSchema.parse(body);

    // Get recipients based on selection
    let recipientEmails: string[] = [];
    
    if (campaignData.recipients === "all") {
      const allLeads = await db.select({ email: leads.email }).from(leads);
      recipientEmails = allLeads.map(lead => lead.email);
    } else if (campaignData.recipients === "new") {
      const newLeads = await db
        .select({ email: leads.email })
        .from(leads)
        .where(eq(leads.status, "new"));
      recipientEmails = newLeads.map(lead => lead.email);
    } else if (campaignData.recipients === "registered") {
      const registeredLeads = await db
        .select({ email: leads.email })
        .from(leads)
        .where(eq(leads.status, "registered"));
      recipientEmails = registeredLeads.map(lead => lead.email);
    } else if (campaignData.recipients === "paid") {
      const paidLeads = await db
        .select({ email: leads.email })
        .from(leads)
        .where(eq(leads.status, "paid"));
      recipientEmails = paidLeads.map(lead => lead.email);
    }

    // Send emails using Resend
    const emailResult = await sendBulkEmail({
      recipients: recipientEmails,
      subject: campaignData.subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #3B82F6;">${campaignData.name}</h1>
          <div style="line-height: 1.6;">
            ${campaignData.message.replace(/\n/g, '<br>')}
          </div>
          <p>Best regards,<br>The AutomateFlow Team</p>
        </div>
      `,
    });

    if (!emailResult.success) {
      throw new Error(emailResult.error);
    }

    return NextResponse.json({
      success: true,
      message: `Email campaign sent to ${emailResult.results?.successful || 0} recipients`,
      campaignId: Date.now().toString(),
      results: emailResult.results,
    });
  } catch (error) {
    console.error("Error sending email campaign:", error);
    return NextResponse.json(
      { success: false, error: "Failed to send campaign" },
      { status: 400 }
    );
  }
}