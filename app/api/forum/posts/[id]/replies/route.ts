import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { forumReplies, leads } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'
import { z } from 'zod'

const replySchema = z.object({
  content: z.string().min(5),
  leadId: z.string().uuid(),
})

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { content, leadId } = replySchema.parse(body)
    const postId = params.id

    const [newReply] = await db
      .insert(forumReplies)
      .values({
        postId,
        leadId,
        content,
      })
      .returning()

    return NextResponse.json({ success: true, reply: newReply })
  } catch (error) {
    console.error('Error creating reply:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create reply' },
      { status: 400 }
    )
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const postId = params.id

    const replies = await db
      .select({
        id: forumReplies.id,
        content: forumReplies.content,
        upvotes: forumReplies.upvotes,
        createdAt: forumReplies.createdAt,
        authorName: leads.name,
        authorEmail: leads.email,
      })
      .from(forumReplies)
      .leftJoin(leads, eq(forumReplies.leadId, leads.id))
      .where(eq(forumReplies.postId, postId))
      .orderBy(desc(forumReplies.createdAt))

    return NextResponse.json({ success: true, replies })
  } catch (error) {
    console.error('Error fetching replies:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch replies' },
      { status: 500 }
    )
  }
}