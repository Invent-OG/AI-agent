import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  leads,
  payments,
  studentProgress,
  courseModules,
  certificates,
  forumPosts,
  forumReplies,
} from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

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

    // Get lead information
    const lead = await db
      .select()
      .from(leads)
      .where(eq(leads.id, leadId))
      .limit(1);

    if (lead.length === 0) {
      return NextResponse.json(
        { success: false, error: "Student not found" },
        { status: 404 }
      );
    }

    // Get payment information
    const payment = await db
      .select()
      .from(payments)
      .where(eq(payments.leadId, leadId))
      .limit(1);

    // Get certificates
    const studentCertificates = await db
      .select()
      .from(certificates)
      .where(eq(certificates.leadId, leadId));

    // Get recent activity (simulated for now)
    const recentActivity = [
      {
        type: "course",
        title: "Completed Module 3",
        description: "Advanced Automation Techniques",
        time: "2 hours ago",
      },
      {
        type: "workshop",
        title: "Workshop Registration",
        description: "Successfully registered for January 15 workshop",
        time: "1 day ago",
      },
      {
        type: "certificate",
        title: "Certificate Earned",
        description: "Automation Fundamentals Certificate",
        time: "3 days ago",
      },
    ];

    // Get forum posts
    const studentForumPosts = await db
      .select()
      .from(forumPosts)
      .where(eq(forumPosts.leadId, leadId));

    // Get forum replies
    const studentForumReplies = await db
      .select()
      .from(forumReplies)
      .where(eq(forumReplies.leadId, leadId));

    const studentData = {
      ...lead[0],
      payment: payment[0] || null,
      certificates: studentCertificates,
      recentActivity,
      forumPosts: studentForumPosts,
      forumReplies: studentForumReplies,
      workshopStatus:
        payment[0]?.plan === "workshop" ? "registered" : "not_registered",
    };

    return NextResponse.json({
      success: true,
      data: studentData,
    });
  } catch (error) {
    console.error("Student data fetch error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
