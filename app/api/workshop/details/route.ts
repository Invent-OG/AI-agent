import { NextResponse } from "next/server";
import { WORKSHOP_CONFIG, getWorkshopPricing, calculateSavings } from "@/lib/workshop-config";

export async function GET() {
  try {
    const pricing = getWorkshopPricing();
    const savings = calculateSavings();

    const workshopDetails = {
      id: "workshop-2025-01",
      ...WORKSHOP_CONFIG.details,
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
      // Dynamic stats (these could come from database in real implementation)
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