import { NextRequest, NextResponse } from "next/server";

// Mock templates data - in a real app, this would be in a database
let mockTemplates = [
  {
    id: "1",
    name: "Welcome Email",
    description: "Welcome new users to the platform",
    category: "onboarding",
    subject: "Welcome to AutomateFlow!",
    content: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #3B82F6;">Welcome to AutomateFlow!</h1>
        <p>Thank you for joining our automation community. Get ready to transform your business operations!</p>
        <p>Your workshop details will be sent shortly.</p>
        <p>Best regards,<br>The AutomateFlow Team</p>
      </div>
    `,
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
    content: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #8B5CF6;">Workshop Reminder</h1>
        <p>Don't forget about tomorrow's workshop...</p>
        <p>Best regards,<br>The AutomateFlow Team</p>
      </div>
    `,
    usageCount: 23,
    createdAt: new Date(Date.now() - 86400000 * 5),
    updatedAt: new Date(Date.now() - 86400000),
  },
];

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const templateId = params.id;
    const template = mockTemplates.find(t => t.id === templateId);
    
    if (!template) {
      return NextResponse.json(
        { success: false, error: "Template not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      template,
    });
  } catch (error) {
    console.error("Error fetching template:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch template" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const templateId = params.id;
    const body = await request.json();
    
    const templateIndex = mockTemplates.findIndex(t => t.id === templateId);
    if (templateIndex === -1) {
      return NextResponse.json(
        { success: false, error: "Template not found" },
        { status: 404 }
      );
    }

    mockTemplates[templateIndex] = {
      ...mockTemplates[templateIndex],
      ...body,
      updatedAt: new Date(),
    };

    return NextResponse.json({
      success: true,
      template: mockTemplates[templateIndex],
    });
  } catch (error) {
    console.error("Error updating template:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update template" },
      { status: 400 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const templateId = params.id;
    const templateIndex = mockTemplates.findIndex(t => t.id === templateId);
    
    if (templateIndex === -1) {
      return NextResponse.json(
        { success: false, error: "Template not found" },
        { status: 404 }
      );
    }

    mockTemplates.splice(templateIndex, 1);

    return NextResponse.json({
      success: true,
      message: "Template deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting template:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete template" },
      { status: 500 }
    );
  }
}