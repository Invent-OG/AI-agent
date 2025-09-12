import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { leads } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { sendBulkEmail, emailTemplates } from "@/lib/email";

const reminderSchema = z.object({
  type: z.enum(["email", "sms", "both"]),
  message: z.string().min(1),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, message } = reminderSchema.parse(body);

    // Get workshop attendees
    const attendees = await db
      .select()
      .from(leads)
      .where(eq(leads.source, "workshop"));

    let emailResults = null;
    
    // Send email reminders
    if (type === "email" || type === "both") {
      const emailAddresses = attendees.map(attendee => attendee.email);
      emailResults = await sendBulkEmail({
        recipients: emailAddresses,
        subject: "Workshop Reminder - AutomateFlow",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #8B5CF6;">Workshop Reminder</h1>
            <div style="line-height: 1.6;">
              ${message.replace(/\n/g, '<br>')}
            </div>
            <p>Best regards,<br>The AutomateFlow Team</p>
          </div>
        `,
      });
    }
    
    // SMS functionality would go here for type === "sms" || type === "both"
    // For now, we'll focus on email implementation

    const totalSent = emailResults?.results?.successful || 0;

    return NextResponse.json({
      success: true,
      message: `Reminders sent to ${totalSent} attendees`,
      results: emailResults?.results,
    });
  } catch (error) {
    console.error("Error sending reminders:", error);
    return NextResponse.json(
      { success: false, error: "Failed to send reminders" },
      { status: 400 }
    );
  }
}