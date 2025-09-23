import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { leads } from "@/lib/db/schema";
import { sql, gte } from "drizzle-orm";
import { subDays, format } from "date-fns";

export async function GET() {
  try {
    const thirtyDaysAgo = subDays(new Date(), 30);
    const sevenDaysAgo = subDays(new Date(), 7);

    // Get email performance data (mock data for now)
    const emailPerformance = [
      { date: format(subDays(new Date(), 6), "MMM dd"), opens: 45, clicks: 12, sent: 100 },
      { date: format(subDays(new Date(), 5), "MMM dd"), opens: 52, clicks: 18, sent: 120 },
      { date: format(subDays(new Date(), 4), "MMM dd"), opens: 38, clicks: 9, sent: 80 },
      { date: format(subDays(new Date(), 3), "MMM dd"), opens: 61, clicks: 22, sent: 150 },
      { date: format(subDays(new Date(), 2), "MMM dd"), opens: 48, clicks: 15, sent: 110 },
      { date: format(subDays(new Date(), 1), "MMM dd"), opens: 55, clicks: 19, sent: 130 },
      { date: format(new Date(), "MMM dd"), opens: 42, clicks: 14, sent: 95 },
    ];

    // Campaign performance by type
    const campaignTypes = [
      { name: "Welcome Series", opens: 65, clicks: 25, sent: 200 },
      { name: "Workshop Reminders", opens: 72, clicks: 35, sent: 150 },
      { name: "Course Updates", opens: 58, clicks: 18, sent: 180 },
      { name: "Promotional", opens: 45, clicks: 12, sent: 120 },
    ];

    // Best performing times
    const timeAnalysis = [
      { hour: "09:00", opens: 45, clicks: 12 },
      { hour: "10:00", opens: 68, clicks: 22 },
      { hour: "11:00", opens: 52, clicks: 18 },
      { hour: "14:00", opens: 61, clicks: 19 },
      { hour: "15:00", opens: 48, clicks: 15 },
      { hour: "16:00", opens: 42, clicks: 11 },
    ];

    // Device breakdown
    const deviceStats = [
      { device: "Desktop", percentage: 45 },
      { device: "Mobile", percentage: 40 },
      { device: "Tablet", percentage: 15 },
    ];

    return NextResponse.json({
      success: true,
      data: {
        performance: emailPerformance,
        campaignTypes,
        timeAnalysis,
        deviceStats,
        summary: {
          totalSent: 1250,
          avgOpenRate: 52,
          avgClickRate: 18,
          bestDay: "Tuesday", 
          bestTime: "10:00 AM",
          topCampaign: "Workshop Reminders",
        },
      },
    });
  } catch (error) {
    console.error("Error fetching email analytics:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}