import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { forumPosts, forumReplies, leads } from '@/lib/db/schema'
import { eq, desc, sql } from 'drizzle-orm'
import { z } from 'zod'

const postSchema = z.object({
  title: z.string().min(5),
  content: z.string().min(10),
  category: z.enum(['general', 'technical', 'showcase']).default('general'),
  leadId: z.string().uuid(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = postSchema.parse(body)

    const [newPost] = await db
      .insert(forumPosts)
      .values(validatedData)
      .returning()

    return NextResponse.json({ success: true, post: newPost })
  } catch (error) {
    console.error('Error creating forum post:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create post' },
      { status: 400 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const limit = parseInt(searchParams.get('limit') || '20')

    let query = db
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
      .orderBy(desc(forumPosts.createdAt))
      .limit(limit)

    if (category && category !== 'all') {
      query = query.where(eq(forumPosts.category, category))
    }

    const posts = await query

    return NextResponse.json({ success: true, posts })
  } catch (error) {
    console.error('Error fetching forum posts:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch posts' },
      { status: 500 }
    )
  }
}