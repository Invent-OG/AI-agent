import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { leads } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { sendEmail } from "@/lib/email";

const emailSchema = z.object({
  subject: z.string().min(1),
  message: z.string().min(1),
});

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const leadId = params.id;
    const body = await request.json();
    const { subject, message } = emailSchema.parse(body);

    // Get lead details
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

    // Send email using Resend
    const emailResult = await sendEmail({
      to: lead.email,
      subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #3B82F6;">AutomateFlow Update</h1>
          <p>Hi ${lead.name},</p>
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
      message: `Email sent to ${lead.name}`,
      data: emailResult.data,
    });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { success: false, error: "Failed to send email" },
      { status: 400 }
    );
  }
}