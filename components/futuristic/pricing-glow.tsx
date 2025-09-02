'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { CheckCircle, Zap, Gift, Users, Clock, Shield, Star } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export function PricingGlow() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const ctx = gsap.context(() => {
      gsap.fromTo(cardRef.current,
        { scale: 0.9, opacity: 0, y: 60 },
        {
          scale: 1,
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: cardRef.current,
            start: "top 80%"
          }
        }
      )

      gsap.fromTo(".pricing-feature",
        { x: -30, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.6,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: {
            trigger: cardRef.current,
            start: "top 70%"
          }
        }
      )

    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const features = [
    'Live 3-hour automation workshop',
    'Zapier, n8n, and Make.com training',
    'Ready-to-use automation templates',
    'Private Slack community access',
    'Workshop recording (lifetime access)',
    'Bonus: 1-on-1 consultation call',
    'Certificate of completion',
    '30-day money-back guarantee'
  ]

  const scrollToRegistration = () => {
    const element = document.querySelector('#register')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section ref={sectionRef} className="py-12 sm:py-20 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-950/20 dark:to-purple-950/20 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-200/30 via-transparent to-purple-200/30 dark:from-blue-900/10 dark:to-purple-900/10" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent">
            Limited Time Offer
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Don't miss this opportunity to transform your business operations
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Card ref={cardRef} className="border-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-2xl hover:shadow-3xl transition-all duration-500 overflow-hidden">
            {/* Gradient header */}
            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-1">
              <div className="bg-white dark:bg-gray-900 rounded-t-lg">
                <CardHeader className="text-center pb-6 sm:pb-8 pt-6 sm:pt-8">
                  <div className="flex justify-center mb-4">
                    <Badge className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30 text-orange-800 dark:text-orange-200 border-orange-200 dark:border-orange-700 text-sm sm:text-base">
                      <Gift className="w-4 h-4 mr-2" />
                      83% OFF - Today Only
                    </Badge>
                  </div>
                  
                  <CardTitle className="text-2xl sm:text-3xl lg:text-4xl text-gray-900 dark:text-white mb-4">
                    Live Automation Workshop
                  </CardTitle>
                  
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex items-center justify-center space-x-4">
                      <span className="text-4xl sm:text-5xl lg:text-6xl font-bold text-green-600 dark:text-green-400">
                        ₹499
                      </span>
                      <div className="text-left">
                        <span className="text-xl sm:text-2xl text-gray-500 line-through block">₹2,999</span>
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 text-xs">
                          Save ₹2,500
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
              </div>
            </div>
            
            <CardContent className="p-6 sm:p-8 space-y-6 sm:space-y-8">
              {/* Features list */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {features.map((feature, index) => (
                  <div key={index} className="pricing-feature flex items-center text-gray-700 dark:text-gray-300">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-sm sm:text-base">{feature}</span>
                  </div>
                ))}
              </div>
              
              {/* Progress indicator */}
              <div className="space-y-3 sm:space-y-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 sm:p-6">
                <div className="flex items-center justify-between text-sm sm:text-base">
                  <span className="text-gray-600 dark:text-gray-400 font-medium">Workshop Progress</span>
                  <span className="text-blue-600 dark:text-blue-400 font-bold">72 / 100 seats filled</span>
                </div>
                <Progress value={72} className="h-3 bg-gray-200 dark:bg-gray-700" />
                <div className="flex items-center justify-center">
                  <Badge variant="outline" className="border-orange-300 text-orange-600 dark:border-orange-700 dark:text-orange-400 px-3 py-1">
                    <Clock className="w-4 h-4 mr-2" />
                    Only 28 seats remaining!
                  </Badge>
                </div>
              </div>
              
              <Button 
                onClick={scrollToRegistration}
                size="lg" 
                className="w-full h-14 sm:h-16 text-lg sm:text-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-xl hover:shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 group"
              >
                <Zap className="w-5 h-5 sm:w-6 sm:h-6 mr-3 group-hover:rotate-12 transition-transform" />
                Register Now for ₹499
              </Button>
              
              <div className="flex items-center justify-center space-x-6 sm:space-x-8 pt-4 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center">
                  <Shield className="w-4 h-4 mr-2 text-green-500" />
                  <span>SSL Secured</span>
                </div>
                <div className="flex items-center">
                  <Star className="w-4 h-4 mr-2 text-yellow-500" />
                  <span>4.9/5 Rating</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2 text-blue-500" />
                  <span>Instant Access</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}