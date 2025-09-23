import { NextRequest, NextResponse } from "next/server";

// Mock workshop data - in a real app, this would be in a database
let workshopDetails = {
  id: "workshop-2025-01",
  title: "Master Business Automation in 3 Hours",
  description: "Learn automation tools like Zapier, n8n, and Make.com to streamline your business processes and save 20+ hours weekly.",
  date: "January 15, 2025",
  time: "10:00 AM - 1:00 PM IST",
  duration: "3 Hours",
  price: "499",
  originalPrice: "2999",
  maxAttendees: 100,
  currentAttendees: 72,
  instructor: "Automation Expert",
  agenda: [
    { time: "10:00 AM", title: "Workshop Introduction & Setup", duration: "30 min" },
    { time: "10:30 AM", title: "Zapier Mastery Session", duration: "45 min" },
    { time: "11:15 AM", title: "n8n Deep Dive Training", duration: "45 min" },
    { time: "12:00 PM", title: "Make.com Scenarios", duration: "45 min" },
    { time: "12:45 PM", title: "Q&A + Bonus Resources", duration: "15 min" },
  ],
  features: [
    "Live 3-hour automation workshop",
    "Zapier, n8n, and Make.com training",
    "Ready-to-use automation templates",
    "Private Slack community access",
    "Workshop recording (lifetime access)",
    "Bonus: 1-on-1 consultation call",
    "Certificate of completion",
    "30-day money-back guarantee",
  ],
  benefits: [
    "Save 20+ hours weekly",
    "Reduce operational costs by 60%",
    "Eliminate manual errors",
    "Scale without hiring",
    "Instant implementation",
    "AI-powered workflows",
  ],
};

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: workshopDetails,
    });
  } catch (error) {
    console.error("Error fetching workshop details:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch workshop details" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    
    workshopDetails = {
      ...workshopDetails,
      ...body,
    };

    return NextResponse.json({
      success: true,
      data: workshopDetails,
      message: "Workshop details updated successfully",
    });
  } catch (error) {
    console.error("Error updating workshop details:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update workshop details" },
      { status: 400 }
    );
  }
}