'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Star, Quote } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

const testimonials = [
  {
    name: 'Rajesh Kumar',
    role: 'CEO, TechFlow Solutions',
    content: 'This workshop completely transformed our operations. We automated 80% of our manual processes and saved ₹5 lakhs annually!',
    rating: 5,
    initials: 'RK'
  },
  {
    name: 'Priya Sharma',
    role: 'Operations Head, E-commerce Plus',
    content: 'The live demonstrations were incredible. I implemented 3 automations during the workshop itself. ROI was immediate!',
    rating: 5,
    initials: 'PS'
  },
  {
    name: 'Amit Patel',
    role: 'Founder, Digital Marketing Agency',
    content: 'Best ₹499 I ever spent! Client onboarding is now 10x faster. Our team productivity increased by 300%.',
    rating: 5,
    initials: 'AP'
  },
  {
    name: 'Sneha Gupta',
    role: 'HR Director, Consulting Firm',
    content: 'Employee onboarding automation saved us 15 hours per week. The templates provided were game-changing!',
    rating: 5,
    initials: 'SG'
  },
  {
    name: 'Vikram Singh',
    role: 'COO, Manufacturing Co.',
    content: 'Inventory management automation reduced our manual work by 90%. Incredible value for money!',
    rating: 5,
    initials: 'VS'
  },
  {
    name: 'Anitha Reddy',
    role: 'Marketing Manager, SaaS Startup',
    content: 'Lead nurturing workflows increased our conversion rate by 200%. This workshop is pure gold!',
    rating: 5,
    initials: 'AR'
  }
]

export function Testimonials3D() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const ctx = gsap.context(() => {
      // 3D card entrance animation
      gsap.fromTo(".testimonial-card",
        {
          rotationY: 45,
          rotationX: 15,
          z: -200,
          opacity: 0
        },
        {
          rotationY: 0,
          rotationX: 0,
          z: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          stagger: 0.2,
          scrollTrigger: {
            trigger: cardsRef.current,
            start: "top 75%",
            end: "bottom 25%",
            toggleActions: "play none none reverse"
          }
        }
      )

      // Hover 3D effect
      const cards = document.querySelectorAll('.testimonial-card')
      cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
          gsap.to(card, {
            rotationY: 5,
            rotationX: 5,
            z: 50,
            duration: 0.3,
            ease: "power2.out"
          })
        })
        
        card.addEventListener('mouseleave', () => {
          gsap.to(card, {
            rotationY: 0,
            rotationX: 0,
            z: 0,
            duration: 0.3,
            ease: "power2.out"
          })
        })
      })

    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="py-20 bg-gray-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-purple-900/10 to-pink-900/10" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Success Stories
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Join 500+ businesses that transformed their operations
          </p>
        </div>

        <div ref={cardsRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8" style={{ perspective: '1000px' }}>
          {testimonials.map((testimonial, index) => (
            <Card key={testimonial.name} className="testimonial-card glass-dark border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 cursor-pointer">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                
                <Quote className="w-8 h-8 text-blue-400 mb-4" />
                
                <p className="text-gray-300 mb-6 leading-relaxed text-lg">
                  "{testimonial.content}"
                </p>
                
                <div className="flex items-center">
                  <Avatar className="h-12 w-12 mr-4 border-2 border-blue-500/30">
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white font-bold">
                      {testimonial.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-bold text-white">{testimonial.name}</div>
                    <div className="text-sm text-gray-400">{testimonial.role}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}