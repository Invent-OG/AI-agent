import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { forumPosts } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

const moderateSchema = z.object({
  action: z.enum(["pin", "unpin", "resolve", "unresolve", "flag", "unflag", "delete"]),
});

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const postId = params.id;
    const body = await request.json();
    const { action } = moderateSchema.parse(body);

    let updateData: any = { updatedAt: new Date() };

    switch (action) {
      case "pin":
        updateData.isPinned = true;
        break;
      case "unpin":
        updateData.isPinned = false;
        break;
      case "resolve":
        updateData.isResolved = true;
        break;
      case "unresolve":
        updateData.isResolved = false;
        break;
      case "flag":
        updateData.isFlagged = true;
        break;
      case "unflag":
        updateData.isFlagged = false;
        break;
      case "delete":
        await db.delete(forumPosts).where(eq(forumPosts.id, postId));
        return NextResponse.json({
          success: true,
          message: "Post deleted successfully",
        });
    }

    await db
      .update(forumPosts)
      .set(updateData)
      .where(eq(forumPosts.id, postId));

    return NextResponse.json({
      success: true,
      message: `Post ${action}ed successfully`,
    });
  } catch (error) {
    console.error("Error moderating post:", error);
    return NextResponse.json(
      { success: false, error: "Failed to moderate post" },
      { status: 400 }
    );
  }
}