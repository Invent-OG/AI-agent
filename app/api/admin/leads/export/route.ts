import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { leads } from "@/lib/db/schema";
import { desc } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const format = searchParams.get("format") || "csv";

    const allLeads = await db
      .select()
      .from(leads)
      .orderBy(desc(leads.createdAt));

    if (format === "csv") {
      const csvHeaders = ["Name", "Email", "Company", "Phone", "Status", "Source", "Created At"];
      const csvRows = allLeads.map(lead => [
        lead.name,
        lead.email,
        lead.company || "",
        lead.phone || "",
        lead.status,
        lead.source || "",
        new Date(lead.createdAt).toISOString(),
      ]);

      const csvContent = [
        csvHeaders.join(","),
        ...csvRows.map(row => row.map(field => `"${field}"`).join(","))
      ].join("\n");

      return new NextResponse(csvContent, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": "attachment; filename=leads-export.csv",
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: allLeads,
    });
  } catch (error) {
    console.error("Error exporting leads:", error);
    return NextResponse.json(
      { success: false, error: "Failed to export leads" },
      { status: 500 }
    );
  }
}