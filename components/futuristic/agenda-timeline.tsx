'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Calendar, Clock, IndianRupee, Users } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

const agendaItems = [
  {
    time: '10:00 AM',
    title: 'Workshop Introduction',
    description: 'Welcome & automation fundamentals overview',
    duration: '30 min'
  },
  {
    time: '10:30 AM',
    title: 'Zapier Mastery',
    description: 'Build your first automation workflow live',
    duration: '45 min'
  },
  {
    time: '11:15 AM',
    title: 'n8n Deep Dive',
    description: 'Advanced visual automation techniques',
    duration: '45 min'
  },
  {
    time: '12:00 PM',
    title: 'Make.com Scenarios',
    description: 'Complex multi-step automation setup',
    duration: '45 min'
  },
  {
    time: '12:45 PM',
    title: 'Q&A + Next Steps',
    description: 'Live questions and course enrollment',
    duration: '15 min'
  }
]

export function AgendaTimeline() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const timelineRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const ctx = gsap.context(() => {
      // Timeline items animation
      gsap.fromTo(".timeline-item",
        { x: 100, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.2,
          scrollTrigger: {
            trigger: timelineRef.current,
            start: "top 70%",
            end: "bottom 30%",
            toggleActions: "play none none reverse"
          }
        }
      )

      // Info cards animation
      gsap.fromTo(".info-card",
        { y: 50, opacity: 0, scale: 0.9 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: "back.out(1.7)",
          stagger: 0.1,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%"
          }
        }
      )

    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="py-20 bg-gray-800 relative">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-blue-900/20" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Workshop Agenda
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            3 hours of intensive, hands-on automation training
          </p>
        </div>

        {/* Workshop Info Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-16">
          <Card className="info-card glass-dark border-gray-700/50">
            <CardContent className="p-6 text-center">
              <Calendar className="w-8 h-8 text-blue-400 mx-auto mb-4" />
              <h3 className="font-bold text-white mb-2">Date</h3>
              <p className="text-gray-300">January 15, 2025</p>
            </CardContent>
          </Card>
          
          <Card className="info-card glass-dark border-gray-700/50">
            <CardContent className="p-6 text-center">
              <Clock className="w-8 h-8 text-purple-400 mx-auto mb-4" />
              <h3 className="font-bold text-white mb-2">Duration</h3>
              <p className="text-gray-300">3 Hours Live</p>
            </CardContent>
          </Card>
          
          <Card className="info-card glass-dark border-gray-700/50">
            <CardContent className="p-6 text-center">
              <IndianRupee className="w-8 h-8 text-green-400 mx-auto mb-4" />
              <h3 className="font-bold text-white mb-2">Entry Fee</h3>
              <p className="text-gray-300">₹499 Only</p>
            </CardContent>
          </Card>
          
          <Card className="info-card glass-dark border-gray-700/50">
            <CardContent className="p-6 text-center">
              <Users className="w-8 h-8 text-pink-400 mx-auto mb-4" />
              <h3 className="font-bold text-white mb-2">Seats Left</h3>
              <p className="text-gray-300">28 / 100</p>
            </CardContent>
          </Card>
        </div>

        {/* Timeline */}
        <div ref={timelineRef} className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 to-purple-500" />
            
            {agendaItems.map((item, index) => (
              <div key={item.time} className="timeline-item relative flex items-start mb-12 last:mb-0">
                {/* Timeline dot */}
                <div className="absolute left-6 w-4 h-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full border-4 border-gray-900" />
                
                {/* Content */}
                <div className="ml-20 flex-1">
                  <Card className="glass-dark border-gray-700/50 hover:border-blue-500/50 transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-blue-400 font-bold text-lg">{item.time}</span>
                        <span className="text-gray-400 text-sm">{item.duration}</span>
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                      <p className="text-gray-300">{item.description}</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}