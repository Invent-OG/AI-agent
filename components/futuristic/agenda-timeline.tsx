'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Calendar, Clock, IndianRupee, Users, Play, CheckCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

const agendaItems = [
  {
    time: '10:00 AM',
    title: 'Workshop Introduction & Setup',
    description: 'Welcome session, tool overview, and account setup assistance',
    duration: '30 min',
    type: 'intro'
  },
  {
    time: '10:30 AM',
    title: 'Zapier Mastery Session',
    description: 'Build your first automation workflow live with real business scenarios',
    duration: '45 min',
    type: 'hands-on'
  },
  {
    time: '11:15 AM',
    title: 'n8n Deep Dive Training',
    description: 'Advanced visual automation techniques and custom node creation',
    duration: '45 min',
    type: 'advanced'
  },
  {
    time: '12:00 PM',
    title: 'Make.com Scenarios',
    description: 'Complex multi-step automation setup and enterprise integrations',
    duration: '45 min',
    type: 'expert'
  },
  {
    time: '12:45 PM',
    title: 'Q&A + Bonus Resources',
    description: 'Live questions, bonus templates, and course enrollment opportunities',
    duration: '15 min',
    type: 'bonus'
  }
]

const workshopInfo = [
  {
    icon: Calendar,
    title: 'Date',
    value: 'January 15, 2025',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    icon: Clock,
    title: 'Duration',
    value: '3 Hours Live',
    color: 'from-purple-500 to-pink-500'
  },
  {
    icon: IndianRupee,
    title: 'Entry Fee',
    value: '₹499 Only',
    color: 'from-emerald-500 to-green-500'
  },
  {
    icon: Users,
    title: 'Seats Left',
    value: '28 / 100',
    color: 'from-orange-500 to-red-500'
  }
]

export function AgendaTimeline() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const timelineRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const ctx = gsap.context(() => {
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

      // Timeline items animation
      gsap.fromTo(".timeline-item",
        { x: 60, opacity: 0 },
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

    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'intro': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
      case 'hands-on': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
      case 'advanced': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
      case 'expert': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300'
      case 'bonus': return 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
    }
  }

  return (
    <section ref={sectionRef} className="py-12 sm:py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-950 dark:via-blue-950/20 dark:to-indigo-950/20 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-blue-100/40 via-transparent to-purple-100/40 dark:from-blue-900/20 dark:to-purple-900/20" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent">
            Workshop Agenda
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            3 hours of intensive, hands-on automation training with live demonstrations
          </p>
        </div>

        {/* Workshop Info Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12 sm:mb-16">
          {workshopInfo.map((info, index) => (
            <Card key={info.title} className="info-card group hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
              <CardContent className="p-4 sm:p-6 text-center">
                <div className={`w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br ${info.color} rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <info.icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white text-sm sm:text-base mb-1 sm:mb-2">
                  {info.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  {info.value}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Timeline */}
        <div ref={timelineRef} className="max-w-5xl mx-auto">
          <div className="relative">
            {/* Timeline line - hidden on mobile, visible on larger screens */}
            <div className="hidden sm:block absolute left-8 lg:left-12 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500" />
            
            <div className="space-y-6 sm:space-y-8">
              {agendaItems.map((item, index) => (
                <div key={item.time} className="timeline-item relative">
                  {/* Timeline dot - hidden on mobile */}
                  <div className="hidden sm:block absolute left-6 lg:left-10 w-6 h-6 lg:w-8 lg:h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full border-4 border-white dark:border-gray-900 shadow-lg" />
                  
                  {/* Content */}
                  <div className="sm:ml-20 lg:ml-28">
                    <Card className="group hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 border-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm">
                      <CardContent className="p-4 sm:p-6 lg:p-8">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4">
                          <div className="flex items-center space-x-3">
                            <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-700 text-sm font-bold">
                              {item.time}
                            </Badge>
                            <Badge className={`${getTypeColor(item.type)} text-xs font-medium`}>
                              {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                            </Badge>
                          </div>
                          <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
                            <Clock className="w-4 h-4 mr-2" />
                            <span>{item.duration}</span>
                          </div>
                        </div>
                        
                        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base leading-relaxed">
                          {item.description}
                        </p>
                        
                        <div className="flex items-center mt-4 text-green-600 dark:text-green-400 text-sm">
                          <Play className="w-4 h-4 mr-2" />
                          <span>Live demonstration included</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Call to action */}
        <div className="text-center mt-12 sm:mt-16">
          <Card className="max-w-2xl mx-auto border-0 bg-gradient-to-r from-blue-600 to-purple-600 shadow-2xl">
            <CardContent className="p-6 sm:p-8 text-center text-white">
              <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">
                Ready to Transform Your Business?
              </h3>
              <p className="text-blue-100 mb-4 sm:mb-6 text-sm sm:text-base">
                Join hundreds of successful entrepreneurs who've automated their way to freedom
              </p>
              <Button 
                size="lg"
                variant="secondary"
                className="bg-white text-blue-600 hover:bg-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold"
              >
                <CheckCircle className="w-5 h-5 mr-2" />
                Secure My Seat Now
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}