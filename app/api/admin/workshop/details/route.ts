import { NextRequest, NextResponse } from "next/server";
import { WORKSHOP_CONFIG, getWorkshopPricing, calculateSavings } from "@/lib/workshop-config";

// In a real application, this would be stored in the database
// For now, we'll use the config file and allow updates
let workshopOverrides: any = {};

export async function GET() {
  try {
    const pricing = getWorkshopPricing();
    const savings = calculateSavings();

    const workshopDetails = {
      id: "workshop-2025-01",
      ...WORKSHOP_CONFIG.details,
      ...workshopOverrides, // Apply any admin overrides
      pricing: {
        current: pricing.current,
        original: pricing.original,
        currency: pricing.currency,
        discount: pricing.discount,
        savings: savings,
      },
      features: WORKSHOP_CONFIG.features,
      benefits: WORKSHOP_CONFIG.benefits,
      agenda: WORKSHOP_CONFIG.agenda,
      currentAttendees: 72,
      availableSeats: WORKSHOP_CONFIG.details.maxAttendees - 72,
    };

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
    
    // Store admin overrides (in production, save to database)
    workshopOverrides = {
      ...workshopOverrides,
      ...body,
    };

    // If pricing is being updated, we should update the config
    // In production, this would update the database
    if (body.pricing) {
      // Update the workshop config pricing
      Object.assign(WORKSHOP_CONFIG.pricing, body.pricing);
    }

    const pricing = getWorkshopPricing();
    const savings = calculateSavings();

    const updatedDetails = {
      id: "workshop-2025-01",
      ...WORKSHOP_CONFIG.details,
      ...workshopOverrides,
      pricing: {
        current: pricing.current,
        original: pricing.original,
        currency: pricing.currency,
        discount: pricing.discount,
        savings: savings,
      },
    };

    return NextResponse.json({
      success: true,
      data: updatedDetails,
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