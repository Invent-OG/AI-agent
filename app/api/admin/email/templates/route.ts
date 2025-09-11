import { NextRequest, NextResponse } from "next/server";

// Mock data for email templates
const mockTemplates = [
  {
    id: "1",
    name: "Welcome Email",
    description: "Welcome new users to the platform",
    category: "onboarding",
    subject: "Welcome to AutomateFlow!",
    content: "Welcome to our automation community...",
    usageCount: 45,
    createdAt: new Date(Date.now() - 86400000 * 10),
    updatedAt: new Date(Date.now() - 86400000 * 2),
  },
  {
    id: "2",
    name: "Workshop Reminder",
    description: "Remind users about upcoming workshops",
    category: "workshop",
    subject: "Workshop starting soon!",
    content: "Don't forget about tomorrow's workshop...",
    usageCount: 23,
    createdAt: new Date(Date.now() - 86400000 * 5),
    updatedAt: new Date(Date.now() - 86400000),
  },
  {
    id: "3",
    name: "Course Completion",
    description: "Congratulate users on course completion",
    category: "achievement",
    subject: "Congratulations on completing the course!",
    content: "You've successfully completed...",
    usageCount: 67,
    createdAt: new Date(Date.now() - 86400000 * 15),
    updatedAt: new Date(Date.now() - 86400000 * 3),
  },
];

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      templates: mockTemplates,
    });
  } catch (error) {
    console.error("Error fetching email templates:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch templates" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Here you would create a new template in the database
    const newTemplate = {
      id: Date.now().toString(),
      ...body,
      usageCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return NextResponse.json({
      success: true,
      template: newTemplate,
    });
  } catch (error) {
    console.error("Error creating email template:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create template" },
      { status: 400 }
    );
  }
}