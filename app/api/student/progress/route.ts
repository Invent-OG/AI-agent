import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { studentProgress, courseModules, courses } from "@/lib/db/schema";
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

    // Get student progress with module details
    const progressData = await db
      .select({
        progress: studentProgress,
        module: courseModules,
        course: courses,
      })
      .from(studentProgress)
      .leftJoin(courseModules, eq(studentProgress.moduleId, courseModules.id))
      .leftJoin(courses, eq(courseModules.courseId, courses.id))
      .where(eq(studentProgress.leadId, leadId));

    // Calculate total watch time
    const totalWatchTime = progressData.reduce(
      (sum, item) => sum + (item.progress.watchTime || 0),
      0
    );

    // Format modules data, filter out null modules
    const modules = progressData
      .filter((item) => item.module !== null)
      .map((item) => ({
        id: item.module!.id,
        title: item.module!.title,
        description: item.module!.description,
        duration: item.module!.duration,
        videoUrl: item.module!.videoUrl,
        isCompleted: item.progress.isCompleted,
        completedAt: item.progress.completedAt,
        watchTime: item.progress.watchTime,
        courseName: item.course?.title,
      }));

    const progress = {
      modules,
      totalWatchTime,
      completedModules: modules.filter((m) => m.isCompleted).length,
      totalModules: modules.length,
    };

    return NextResponse.json({
      success: true,
      data: progress,
    });
  } catch (error) {
    console.error("Student progress fetch error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
