// Workshop configuration - centralized pricing and details
export const WORKSHOP_CONFIG = {
  pricing: {
    current: 499,
    original: 2999,
    currency: "INR",
    discount: 83, // percentage
  },
  details: {
    title: "Master Business Automation in 3 Hours",
    description: "Learn automation tools like Zapier, n8n, and Make.com to streamline your business processes and save 20+ hours weekly.",
    date: "January 15, 2025",
    time: "10:00 AM - 1:00 PM IST",
    duration: "3 Hours",
    maxAttendees: 100,
    instructor: "Automation Expert",
  },
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
  agenda: [
    { time: "10:00 AM", title: "Workshop Introduction & Setup", duration: "30 min" },
    { time: "10:30 AM", title: "Zapier Mastery Session", duration: "45 min" },
    { time: "11:15 AM", title: "n8n Deep Dive Training", duration: "45 min" },
    { time: "12:00 PM", title: "Make.com Scenarios", duration: "45 min" },
    { time: "12:45 PM", title: "Q&A + Bonus Resources", duration: "15 min" },
  ],
};

// Helper function to get current pricing
export function getWorkshopPricing() {
  return WORKSHOP_CONFIG.pricing;
}

// Helper function to get workshop details
export function getWorkshopDetails() {
  return WORKSHOP_CONFIG.details;
}

// Helper function to calculate savings
export function calculateSavings() {
  const { current, original } = WORKSHOP_CONFIG.pricing;
  return {
    amount: original - current,
    percentage: Math.round(((original - current) / original) * 100),
  };
}