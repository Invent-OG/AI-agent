import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { certificates, leads, courses } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { z } from "zod";

const certificateSchema = z.object({
  leadId: z.string().uuid(),
  courseId: z.string().uuid(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { leadId, courseId } = certificateSchema.parse(body);

    // Get lead and course details
    const [lead] = await db.select().from(leads).where(eq(leads.id, leadId));
    const [course] = await db
      .select()
      .from(courses)
      .where(eq(courses.id, courseId));

    if (!lead || !course) {
      return NextResponse.json(
        { success: false, error: "Lead or course not found" },
        { status: 404 }
      );
    }

    // Check if certificate already exists
    const existingCertificate = await db
      .select()
      .from(certificates)
      .where(
        and(
          eq(certificates.leadId, leadId),
          eq(certificates.courseId, courseId)
        )
      );

    if (existingCertificate.length > 0) {
      return NextResponse.json({
        success: true,
        certificate: existingCertificate[0],
        message: "Certificate already exists",
      });
    }

    // Generate certificate number
    const certificateNumber = `AC-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 6)
      .toUpperCase()}`;

    // Create certificate record
    const [newCertificate] = await db
      .insert(certificates)
      .values({
        leadId,
        courseId,
        certificateNumber,
        studentName: lead.name,
        courseName: course.title,
        completionDate: new Date(),
        certificateUrl: `/certificates/${certificateNumber}.pdf`, // This would be generated
      })
      .returning();

    return NextResponse.json({
      success: true,
      certificate: newCertificate,
    });
  } catch (error) {
    console.error("Error generating certificate:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate certificate" },
      { status: 400 }
    );
  }
}
