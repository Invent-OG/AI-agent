'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowRight, Sparkles, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export function FinalCTA() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const headlineRef = useRef<HTMLHeadingElement>(null)
  const ctaRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const ctx = gsap.context(() => {
      // Entrance animation
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%"
        }
      })

      tl.from(headlineRef.current, {
        scale: 0.8,
        opacity: 0,
        duration: 1,
        ease: "back.out(1.7)"
      })
      .from(".cta-subtitle", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out"
      }, "-=0.5")
      .from(ctaRef.current, {
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out"
      }, "-=0.3")

      // CTA button hover animation
      const button = ctaRef.current
      if (button) {
        button.addEventListener('mouseenter', () => {
          gsap.to(button, {
            scale: 1.1,
            boxShadow: "0 0 40px rgba(59, 130, 246, 0.6)",
            duration: 0.3,
            ease: "power2.out"
          })
        })
        
        button.addEventListener('mouseleave', () => {
          gsap.to(button, {
            scale: 1,
            boxShadow: "0 0 20px rgba(59, 130, 246, 0.3)",
            duration: 0.3,
            ease: "power2.out"
          })
        })
      }

      // Continuous glow animation
      gsap.to(".final-glow", {
        opacity: 0.8,
        duration: 2,
        ease: "power2.inOut",
        yoyo: true,
        repeat: -1
      })

    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="py-32 bg-gray-900 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="final-glow absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
        <div className="final-glow absolute top-1/4 right-1/4 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl" />
        <div className="final-glow absolute bottom-1/4 left-1/4 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl" />
      </div>
      
      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="max-w-4xl mx-auto space-y-8">
          <h2 
            ref={headlineRef}
            className="text-5xl md:text-7xl font-bold text-white leading-tight"
          >
            🚀 Don't miss this chance to{' '}
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent neon-text">
              future-proof your business
            </span>
            {' '}with AI automation.
          </h2>

          <p className="cta-subtitle text-2xl md:text-3xl text-gray-300 font-medium">
            Seats are limited — book now!
          </p>

          <div className="flex items-center justify-center space-x-4 text-orange-400 font-bold text-lg">
            <Clock className="w-6 h-6" />
            <span>Workshop starts in 3 days</span>
          </div>

          <Button 
            ref={ctaRef}
            size="lg" 
            className="px-16 py-8 text-2xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 glow-effect group"
          >
            <Sparkles className="w-8 h-8 mr-4" />
            👉 Join Workshop for ₹499
            <ArrowRight className="w-8 h-8 ml-4 group-hover:translate-x-2 transition-transform" />
          </Button>

          <div className="flex items-center justify-center space-x-8 pt-8 text-gray-400">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-400 rounded-full mr-2" />
              <span>Secure Payment</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-400 rounded-full mr-2" />
              <span>Instant Access</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-purple-400 rounded-full mr-2" />
              <span>Money-back Guarantee</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}