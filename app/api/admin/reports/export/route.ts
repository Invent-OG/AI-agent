import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "overview";
    const format = searchParams.get("format") || "csv";
    const range = searchParams.get("range") || "30d";

    // Mock report generation
    let content = "";
    let contentType = "";
    let filename = "";

    if (format === "csv") {
      contentType = "text/csv";
      filename = `${type}-report-${range}.csv`;
      content = `Report Type,${type}\nDate Range,${range}\nGenerated At,${new Date().toISOString()}\n\nMetric,Value\nTotal Revenue,₹45000\nNew Leads,150\nConversion Rate,16%`;
    } else if (format === "pdf") {
      contentType = "application/pdf";
      filename = `${type}-report-${range}.pdf`;
      content = "Mock PDF content"; // In real implementation, generate actual PDF
    } else if (format === "xlsx") {
      contentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
      filename = `${type}-report-${range}.xlsx`;
      content = "Mock Excel content"; // In real implementation, generate actual Excel file
    }

    return new NextResponse(content, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename=${filename}`,
      },
    });
  } catch (error) {
    console.error("Error exporting report:", error);
    return NextResponse.json(
      { success: false, error: "Failed to export report" },
      { status: 500 }
    );
  }
}