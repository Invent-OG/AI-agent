import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { leads } from "@/lib/db/schema";
import { inArray } from "drizzle-orm";
import { z } from "zod";
import { sendBulkEmail } from "@/lib/email";

const bulkEmailSchema = z.object({
  attendeeIds: z.array(z.string().uuid()),
  subject: z.string().min(1),
  message: z.string().min(1),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { attendeeIds, subject, message } = bulkEmailSchema.parse(body);

    // Get attendees
    const selectedAttendees = await db
      .select()
      .from(leads)
      .where(inArray(leads.id, attendeeIds));

    // Send emails using Resend
    const emailAddresses = selectedAttendees.map(attendee => attendee.email);
    
    const emailResult = await sendBulkEmail({
      recipients: emailAddresses,
      subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #8B5CF6;">Workshop Update</h1>
          <div style="line-height: 1.6;">
            ${message.replace(/\n/g, '<br>')}
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
      message: `Emails sent to ${emailResult.results?.successful || 0} attendees`,
      results: emailResult.results,
    });
  } catch (error) {
    console.error("Error sending bulk emails:", error);
    return NextResponse.json(
      { success: false, error: "Failed to send emails" },
      { status: 400 }
    );
  }
}