'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowRight, Sparkles, Zap, Bot } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export function AnimatedHero() {
  const heroRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const iconsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const ctx = gsap.context(() => {
      // Hero entrance animation
      const tl = gsap.timeline()
      
      tl.from(titleRef.current, {
        y: 100,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out"
      })
      .from(subtitleRef.current, {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
      }, "-=0.8")
      .from(ctaRef.current, {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out"
      }, "-=0.6")

      // Floating icons animation
      gsap.to(".floating-icon", {
        y: -20,
        duration: 3,
        ease: "power2.inOut",
        yoyo: true,
        repeat: -1,
        stagger: 0.5
      })

      // Glowing effect
      gsap.to(".glow-orb", {
        scale: 1.2,
        opacity: 0.8,
        duration: 2,
        ease: "power2.inOut",
        yoyo: true,
        repeat: -1
      })

    }, heroRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gray-900">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-pink-900/20" />
        <div className="absolute inset-0 grid-bg opacity-30" />
        
        {/* Glowing orbs */}
        <div className="glow-orb absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl" />
        <div className="glow-orb absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
        <div className="glow-orb absolute top-1/2 left-1/2 w-48 h-48 bg-pink-500/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 container mx-auto px-4 text-center max-w-6xl">
        <motion.div className="space-y-8">
          <Badge variant="outline" className="glass px-6 py-3 text-sm font-medium border-blue-500/30 text-blue-300">
            <Sparkles className="w-4 h-4 mr-2" />
            Exclusive Live Workshop - Limited Seats
          </Badge>

          <h1 
            ref={titleRef}
            className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent leading-tight neon-text"
          >
            🚀 Automate Your Business with AI
          </h1>

          <p 
            ref={subtitleRef}
            className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed"
          >
            Learn how tools like Zapier, n8n, and Make can save you hours every week by automating repetitive tasks. 
            Join our exclusive live workshop and start working smarter.
          </p>

          <div ref={ctaRef} className="pt-8">
            <Button 
              size="lg" 
              className="group px-12 py-6 text-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 glow-effect"
            >
              👉 Join Workshop for ₹499
              <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-2 transition-transform" />
            </Button>
          </div>

          {/* Floating Icons */}
          <div ref={iconsRef} className="flex items-center justify-center space-x-12 pt-16">
            <div className="floating-icon glass-dark p-4 rounded-2xl">
              <Zap className="w-8 h-8 text-blue-400" />
            </div>
            <div className="floating-icon glass-dark p-4 rounded-2xl">
              <Bot className="w-8 h-8 text-purple-400" />
            </div>
            <div className="floating-icon glass-dark p-4 rounded-2xl">
              <Sparkles className="w-8 h-8 text-pink-400" />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 pt-16 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400">500+</div>
              <div className="text-sm text-gray-400">Businesses Automated</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400">20+</div>
              <div className="text-sm text-gray-400">Hours Saved Weekly</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-pink-400">₹2L+</div>
              <div className="text-sm text-gray-400">Cost Savings</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}