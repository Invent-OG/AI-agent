import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { courses, courseModules, studentProgress } from '@/lib/db/schema'
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

    // Get courses with progress
    const coursesWithProgress = await db
      .select({
        id: courses.id,
        title: courses.title,
        description: courses.description,
        level: courses.level,
        duration: courses.duration,
        totalModules: sql<number>`count(${courseModules.id})`,
        completedModules: sql<number>`count(case when ${studentProgress.isCompleted} then 1 end)`,
      })
      .from(courses)
      .leftJoin(courseModules, eq(courseModules.courseId, courses.id))
      .leftJoin(studentProgress, eq(studentProgress.moduleId, courseModules.id))
      .where(eq(courses.isActive, true))
      .groupBy(courses.id)

    const coursesWithCalculatedProgress = coursesWithProgress.map(course => ({
      ...course,
      progress: course.totalModules > 0 
        ? Math.round((course.completedModules / course.totalModules) * 100)
        : 0
    }))

    return NextResponse.json({
      success: true,
      courses: coursesWithCalculatedProgress,
    })
  } catch (error) {
    console.error('Error fetching student courses:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch courses' },
      { status: 500 }
    )
  }
}