export interface Lead {
  id: string
  name: string
  email: string
  company?: string
  useCase?: string
  status: 'new' | 'registered' | 'paid'
  referralCode?: string
  phone?: string
  source: 'landing' | 'audit'
  createdAt: Date
  updatedAt: Date
}

export interface Payment {
  id: string
  leadId: string
  amount: string
  currency: string
  cashfreeOrderId?: string
  cashfreePaymentId?: string
  status: 'pending' | 'success' | 'failed'
  plan: 'starter' | 'pro' | 'business'
  hasUpsell: boolean
  createdAt: Date
  updatedAt: Date
}

export interface PricingPlan {
  id: string
  name: string
  price: number
  originalPrice?: number
  features: string[]
  popular?: boolean
  description: string
}