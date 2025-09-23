import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { leads } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const format = searchParams.get("format") || "csv";

    const attendees = await db
      .select()
      .from(leads)
      .where(eq(leads.source, "workshop"));

    if (format === "csv") {
      const csvHeaders = ["Name", "Email", "Phone", "Company", "Status", "Registered Date"];
      const csvRows = attendees.map(attendee => [
        attendee.name,
        attendee.email,
        attendee.phone || "",
        attendee.company || "",
        attendee.status,
        new Date(attendee.createdAt).toISOString(),
      ]);

      const csvContent = [
        csvHeaders.join(","),
        ...csvRows.map(row => row.map(field => `"${field}"`).join(","))
      ].join("\n");

      return new NextResponse(csvContent, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": "attachment; filename=workshop-attendees.csv",
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: attendees,
    });
  } catch (error) {
    console.error("Error exporting attendees:", error);
    return NextResponse.json(
      { success: false, error: "Failed to export attendees" },
      { status: 500 }
    );
  }
}