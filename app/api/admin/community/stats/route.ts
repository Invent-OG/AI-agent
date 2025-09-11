import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { forumPosts, forumReplies, leads } from "@/lib/db/schema";
import { count, eq, sql, gte } from "drizzle-orm";
import { subDays } from "date-fns";

export async function GET() {
  try {
    const thirtyDaysAgo = subDays(new Date(), 30);

    // Get total posts
    const [{ totalPosts }] = await db
      .select({ totalPosts: count() })
      .from(forumPosts);

    // Get resolved posts
    const [{ resolvedPosts }] = await db
      .select({ resolvedPosts: count() })
      .from(forumPosts)
      .where(eq(forumPosts.isResolved, true));

    // Get active members (posted in last 30 days)
    const [{ activeMembers }] = await db
      .select({ activeMembers: sql<number>`count(distinct lead_id)` })
      .from(forumPosts)
      .where(gte(forumPosts.createdAt, thirtyDaysAgo));

    // Calculate engagement rate
    const [{ totalReplies }] = await db
      .select({ totalReplies: count() })
      .from(forumReplies);

    const engagementRate = totalPosts > 0 
      ? Math.round((totalReplies / totalPosts) * 100)
      : 0;

    return NextResponse.json({
      success: true,
      stats: {
        totalPosts,
        resolvedPosts,
        activeMembers,
        engagementRate,
      },
    });
  } catch (error) {
    console.error("Error fetching community stats:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}