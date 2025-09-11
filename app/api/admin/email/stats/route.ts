import { NextResponse } from "next/server";

// Mock email statistics
export async function GET() {
  try {
    const stats = {
      totalSent: 1250,
      openRate: 52,
      clickRate: 18,
      bounceRate: 3,
      unsubscribeRate: 1.2,
      avgOpenRate: 48,
      avgClickRate: 15,
    };

    return NextResponse.json({
      success: true,
      stats,
    });
  } catch (error) {
    console.error("Error fetching email stats:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}