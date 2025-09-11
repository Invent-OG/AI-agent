import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { leads } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

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

    // Here you would integrate with your email/SMS service
    // For now, we'll simulate sending reminders
    const reminderPromises = attendees.map(async (attendee) => {
      if (type === "email" || type === "both") {
        console.log(`Sending email reminder to ${attendee.email}: ${message}`);
      }
      if (type === "sms" || type === "both") {
        console.log(`Sending SMS reminder to ${attendee.phone}: ${message}`);
      }
      return { attendeeId: attendee.id, status: "sent" };
    });

    const results = await Promise.all(reminderPromises);

    return NextResponse.json({
      success: true,
      message: `Reminders sent to ${results.length} attendees`,
      results,
    });
  } catch (error) {
    console.error("Error sending reminders:", error);
    return NextResponse.json(
      { success: false, error: "Failed to send reminders" },
      { status: 400 }
    );
  }
}