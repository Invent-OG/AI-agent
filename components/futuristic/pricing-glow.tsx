'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { CheckCircle, Zap, Gift, Users } from 'lucide-react'
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
  const progressRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const ctx = gsap.context(() => {
      // Card entrance animation
      gsap.fromTo(cardRef.current,
        { scale: 0.8, opacity: 0, y: 100 },
        {
          scale: 1,
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: cardRef.current,
            start: "top 80%"
          }
        }
      )

      // Progress bar animation
      gsap.fromTo(".progress-fill",
        { width: "0%" },
        {
          width: "72%",
          duration: 2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: progressRef.current,
            start: "top 80%"
          }
        }
      )

      // CTA button pulse animation
      gsap.to(ctaRef.current, {
        scale: 1.05,
        duration: 1,
        ease: "power2.inOut",
        yoyo: true,
        repeat: -1
      })

      // Glowing effect
      gsap.to(".glow-card", {
        boxShadow: "0 0 60px rgba(59, 130, 246, 0.3)",
        duration: 2,
        ease: "power2.inOut",
        yoyo: true,
        repeat: -1
      })

    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const features = [
    'Live 3-hour automation workshop',
    'Zapier, n8n, and Make.com training',
    'Ready-to-use automation templates',
    'Private Slack community access',
    'Recording for lifetime access',
    'Bonus: 1-on-1 consultation call'
  ]

  return (
    <section ref={sectionRef} className="py-20 bg-gradient-to-b from-gray-800 to-gray-900 relative">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-purple-900/10 to-pink-900/10" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Secure Your Spot Today
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Limited seats available - Don't miss this opportunity
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card ref={cardRef} className="glow-card glass-dark border-2 border-blue-500/30 relative overflow-hidden">
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10" />
            
            <CardHeader className="text-center pb-8 relative z-10">
              <Badge className="mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-500 px-4 py-2">
                <Gift className="w-4 h-4 mr-2" />
                Early Bird Special
              </Badge>
              
              <CardTitle className="text-3xl font-bold text-white mb-4">
                Live Automation Workshop
              </CardTitle>
              
              <div className="space-y-2">
                <div className="flex items-center justify-center space-x-4">
                  <span className="text-5xl font-bold text-green-400">₹499</span>
                  <span className="text-2xl text-gray-500 line-through">₹2,999</span>
                </div>
                <Badge variant="outline" className="text-green-400 border-green-400/30">
                  Save ₹2,500 (83% OFF)
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-8 relative z-10">
              <ul className="space-y-4">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-center text-gray-300">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-4 flex-shrink-0" />
                    <span className="text-lg">{feature}</span>
                  </li>
                ))}
              </ul>
              
              {/* Progress indicator */}
              <div ref={progressRef} className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Workshop Progress</span>
                  <span className="text-blue-400 font-bold">72 / 100 seats filled</span>
                </div>
                <div className="relative h-3 bg-gray-700 rounded-full overflow-hidden">
                  <div className="progress-fill absolute left-0 top-0 h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
                </div>
                <p className="text-center text-orange-400 font-medium">
                  ⚡ Only 28 seats remaining!
                </p>
              </div>
              
              <Button 
                ref={ctaRef}
                size="lg" 
                className="w-full py-6 text-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 pulse-glow"
              >
                <Zap className="w-6 h-6 mr-3" />
                👉 Join Workshop for ₹499
              </Button>
              
              <p className="text-center text-gray-400 text-sm">
                🔒 Secure payment • 💰 30-day money-back guarantee
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}