import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { notifications } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const leadId = searchParams.get("leadId");

    if (!leadId) {
      return NextResponse.json(
        { success: false, error: "Lead ID is required" },
        { status: 400 }
      );
    }

    // Get notifications for the student
    const studentNotifications = await db
      .select()
      .from(notifications)
      .where(eq(notifications.userId, leadId))
      .orderBy(desc(notifications.createdAt))
      .limit(20);

    return NextResponse.json({
      success: true,
      data: studentNotifications,
    });
  } catch (error) {
    console.error("Student notifications fetch error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
