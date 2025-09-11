import { NextRequest, NextResponse } from "next/server";

// Mock data for email campaigns
const mockCampaigns = [
  {
    id: "1",
    name: "Welcome Series",
    subject: "Welcome to AutomateFlow!",
    recipientCount: 150,
    status: "sent",
    openRate: 45,
    clickRate: 12,
    sentAt: new Date(Date.now() - 86400000 * 2),
    createdAt: new Date(Date.now() - 86400000 * 3),
  },
  {
    id: "2",
    name: "Workshop Reminder",
    subject: "Don't miss tomorrow's workshop!",
    recipientCount: 72,
    status: "sent",
    openRate: 68,
    clickRate: 25,
    sentAt: new Date(Date.now() - 86400000),
    createdAt: new Date(Date.now() - 86400000 * 2),
  },
  {
    id: "3",
    name: "Course Launch",
    subject: "New automation course is live!",
    recipientCount: 200,
    status: "sending",
    openRate: 0,
    clickRate: 0,
    sentAt: null,
    createdAt: new Date(),
  },
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const template = searchParams.get("template");

    let filteredCampaigns = mockCampaigns;

    if (status && status !== "all") {
      filteredCampaigns = filteredCampaigns.filter(c => c.status === status);
    }

    return NextResponse.json({
      success: true,
      campaigns: filteredCampaigns,
    });
  } catch (error) {
    console.error("Error fetching email campaigns:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch campaigns" },
      { status: 500 }
    );
  }
}