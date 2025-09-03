import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { studentProgress, courseModules, courses, certificates } from '@/lib/db/schema'
import { eq, sql } from 'drizzle-orm'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID required' },
        { status: 400 }
      )
    }

    // Get overall progress
    const progressResult = await db
      .select({
        totalModules: sql<number>`count(*)`,
        completedModules: sql<number>`count(case when ${studentProgress.isCompleted} then 1 end)`,
        totalWatchTime: sql<number>`sum(${studentProgress.watchTime})`,
      })
      .from(courseModules)
      .leftJoin(studentProgress, eq(studentProgress.moduleId, courseModules.id))
      .where(eq(studentProgress.leadId, userId))

    const progress = progressResult[0]
    const overallProgress = progress?.totalModules > 0 
      ? Math.round((progress.completedModules / progress.totalModules) * 100)
      : 0

    // Get certificates
    const userCertificates = await db
      .select()
      .from(certificates)
      .where(eq(certificates.leadId, userId))

    // Mock recent activity
    const recentActivity = [
      { title: 'Completed Zapier Basics', date: '2 days ago' },
      { title: 'Started n8n Training', date: '1 week ago' },
      { title: 'Earned Automation Certificate', date: '2 weeks ago' },
    ]

    return NextResponse.json({
      success: true,
      progress: overallProgress,
      totalWatchTime: progress?.totalWatchTime || 0,
      certificates: userCertificates,
      recentActivity,
    })
  } catch (error) {
    console.error('Error fetching student progress:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch progress' },
      { status: 500 }
    )
  }
}