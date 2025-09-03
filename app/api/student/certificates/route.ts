import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { certificates, leads } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

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

    // Get user's certificates
    const userCertificates = await db
      .select({
        id: certificates.id,
        certificateNumber: certificates.certificateNumber,
        studentName: certificates.studentName,
        courseName: certificates.courseName,
        completionDate: certificates.completionDate,
        issuedAt: certificates.issuedAt,
        certificateUrl: certificates.certificateUrl,
      })
      .from(certificates)
      .leftJoin(leads, eq(certificates.leadId, leads.id))
      .where(eq(certificates.leadId, userId))
      .orderBy(certificates.issuedAt)

    return NextResponse.json({
      success: true,
      certificates: userCertificates,
    })
  } catch (error) {
    console.error('Error fetching certificates:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch certificates' },
      { status: 500 }
    )
  }
}