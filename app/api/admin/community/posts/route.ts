import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { forumPosts, forumReplies, leads } from "@/lib/db/schema";
import { eq, desc, sql, and } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const status = searchParams.get("status");

    const conditions = [];
    if (category && category !== "all") {
      conditions.push(eq(forumPosts.category, category));
    }
    if (status === "resolved") {
      conditions.push(eq(forumPosts.isResolved, true));
    } else if (status === "unresolved") {
      conditions.push(eq(forumPosts.isResolved, false));
    }

    const posts = await db
      .select({
        id: forumPosts.id,
        title: forumPosts.title,
        content: forumPosts.content,
        category: forumPosts.category,
        isResolved: forumPosts.isResolved,
        upvotes: forumPosts.upvotes,
        createdAt: forumPosts.createdAt,
        authorName: leads.name,
        authorEmail: leads.email,
        replyCount: sql<number>`count(${forumReplies.id})`,
      })
      .from(forumPosts)
      .leftJoin(leads, eq(forumPosts.leadId, leads.id))
      .leftJoin(forumReplies, eq(forumReplies.postId, forumPosts.id))
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .groupBy(
        forumPosts.id,
        forumPosts.title,
        forumPosts.content,
        forumPosts.category,
        forumPosts.isResolved,
        forumPosts.upvotes,
        forumPosts.createdAt,
        leads.name,
        leads.email
      )
      .orderBy(desc(forumPosts.createdAt));

    return NextResponse.json({
      success: true,
      posts,
    });
  } catch (error) {
    console.error("Error fetching forum posts:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}