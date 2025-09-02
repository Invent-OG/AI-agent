'use client'

import { motion } from 'framer-motion'
import { CheckCircle, Star, Zap, Crown } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

const plans = [
  {
    id: 'starter',
    name: 'Starter',
    price: 2499,
    originalPrice: 4999,
    description: 'Perfect for beginners and small businesses',
    features: [
      'Complete Automation Fundamentals Course',
      'Zapier Basics Training',
      '20+ Pre-built Templates',
      'Email Support',
      'Basic Slack Community Access',
      'Certificate of Completion'
    ],
    icon: Zap,
    popular: false
  },
  {
    id: 'pro',
    name: 'Professional',
    price: 4999,
    originalPrice: 9999,
    description: 'Most popular choice for growing businesses',
    features: [
      'Everything in Starter Plan',
      'Advanced n8n & Make.com Training',
      'Live Group Coaching Sessions',
      '100+ Premium Templates',
      'Priority Support',
      'Private Mastermind Group',
      '1-on-1 Strategy Session',
      'Lifetime Updates'
    ],
    icon: Star,
    popular: true
  },
  {
    id: 'business',
    name: 'Business Elite',
    price: 9999,
    originalPrice: 19999,
    description: 'For enterprises wanting custom automation',
    features: [
      'Everything in Professional Plan',
      'Custom Automation Setup',
      'Team Training (up to 10 people)',
      'White-label Templates',
      'Dedicated Success Manager',
      'API Integration Training',
      'Custom Workflow Development',
      'Quarterly Business Reviews'
    ],
    icon: Crown,
    popular: false
  }
]

export function PricingSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-blue-900/20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Choose Your Automation Journey
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
            Transform your business operations with our comprehensive training programs
          </p>
          <Badge variant="destructive" className="px-6 py-2 text-lg">
            🔥 Early Bird Special - 50% OFF Limited Time
          </Badge>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`relative ${plan.popular ? 'scale-105' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-1">
                    Most Popular
                  </Badge>
                </div>
              )}
              
              <Card className={`h-full transition-all duration-300 hover:shadow-2xl ${
                plan.popular ? 'border-purple-500 shadow-lg' : 'border-gray-200 dark:border-gray-700'
              }`}>
                <CardHeader className="text-center pb-8">
                  <div className="flex justify-center mb-4">
                    <div className={`p-3 rounded-full ${
                      plan.popular ? 'bg-purple-100 dark:bg-purple-900' : 'bg-blue-100 dark:bg-blue-900'
                    }`}>
                      <plan.icon className={`w-8 h-8 ${
                        plan.popular ? 'text-purple-600 dark:text-purple-400' : 'text-blue-600 dark:text-blue-400'
                      }`} />
                    </div>
                  </div>
                  
                  <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">{plan.description}</p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-center space-x-2">
                      <span className="text-4xl font-bold text-green-600">₹{plan.price.toLocaleString()}</span>
                      <span className="text-lg text-gray-500 line-through">₹{plan.originalPrice.toLocaleString()}</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      Save ₹{(plan.originalPrice - plan.price).toLocaleString()}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    className={`w-full py-3 text-lg ${
                      plan.popular 
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600' 
                        : ''
                    }`}
                    size="lg"
                  >
                    Choose {plan.name}
                  </Button>
                  
                  <p className="text-xs text-center text-gray-500">
                    30-day money-back guarantee
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}