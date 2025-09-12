import { Resend } from "resend";

function getResend() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not set");
  }
  return new Resend(apiKey);
}

export async function sendEmail({
  to,
  subject,
  html,
  from = "AutomateFlow <noreply@automateflow.com>",
}: {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
}) {
  try {
    const resend = getResend();
    const { data, error } = await resend.emails.send({
      from,
      to,
      subject,
      html,
    });

    if (error) {
      console.error("Email send error:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Email service error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to send email";
    return { success: false, error: message };
  }
}

export async function sendBulkEmail({
  recipients,
  subject,
  html,
  from = "AutomateFlow <noreply@automateflow.com>",
}: {
  recipients: string[];
  subject: string;
  html: string;
  from?: string;
}) {
  try {
    const emailPromises = recipients.map((email) =>
      sendEmail({ to: email, subject, html, from })
    );

    const results = await Promise.all(emailPromises);
    const successful = results.filter((r) => r.success).length;
    const failed = results.filter((r) => !r.success).length;

    return {
      success: true,
      results: { successful, failed, total: recipients.length },
    };
  } catch (error) {
    console.error("Bulk email error:", error);
    return { success: false, error: "Failed to send bulk emails" };
  }
}

export const emailTemplates = {
  welcome: (name: string) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #3B82F6;">Welcome to AutomateFlow, ${name}!</h1>
      <p>Thank you for joining our automation community. Get ready to transform your business operations!</p>
      <p>Your workshop details will be sent shortly.</p>
      <p>Best regards,<br>The AutomateFlow Team</p>
    </div>
  `,

  workshopReminder: (name: string, workshopDate: string) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #8B5CF6;">Workshop Reminder</h1>
      <p>Hi ${name},</p>
      <p>This is a reminder that your automation workshop is scheduled for ${workshopDate}.</p>
      <p>Make sure to join on time to get the most out of this experience!</p>
      <p>Best regards,<br>The AutomateFlow Team</p>
    </div>
  `,

  paymentConfirmation: (name: string, amount: string, plan: string) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #10B981;">Payment Confirmed!</h1>
      <p>Hi ${name},</p>
      <p>Your payment of ₹${amount} for the ${plan} plan has been successfully processed.</p>
      <p>You now have full access to all course materials and the community.</p>
      <p>Best regards,<br>The AutomateFlow Team</p>
    </div>
  `,
};
