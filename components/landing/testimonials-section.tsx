'use client'

import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

const testimonials = [
  {
    name: 'Rahul Sharma',
    role: 'CEO, TechStart Solutions',
    content: 'This automation course saved us 25 hours per week! Our team productivity increased by 300%. The ROI was immediate.',
    rating: 5,
    avatar: '/api/placeholder/60/60'
  },
  {
    name: 'Priya Patel',
    role: 'Operations Manager, E-com Plus',
    content: 'The Zapier and n8n training was incredible. We automated our entire order fulfillment process. Highly recommend!',
    rating: 5,
    avatar: '/api/placeholder/60/60'
  },
  {
    name: 'Amit Kumar',
    role: 'Founder, Digital Agency',
    content: 'Best investment we made for our agency. Client onboarding is now 10x faster with the automations we built.',
    rating: 5,
    avatar: '/api/placeholder/60/60'
  },
  {
    name: 'Sneha Gupta',
    role: 'Marketing Head, SaaS Startup',
    content: 'The lead nurturing workflows we created increased our conversion rate by 150%. Amazing course content!',
    rating: 5,
    avatar: '/api/placeholder/60/60'
  },
  {
    name: 'Vikram Singh',
    role: 'COO, Manufacturing Co.',
    content: 'Automated our inventory management and supplier communications. Reduced manual work by 80%. Fantastic results!',
    rating: 5,
    avatar: '/api/placeholder/60/60'
  },
  {
    name: 'Anitha Reddy',
    role: 'HR Director, Consulting Firm',
    content: 'Employee onboarding automation saved us weeks of manual work. The templates provided were exactly what we needed.',
    rating: 5,
    avatar: '/api/placeholder/60/60'
  }
]

export function TestimonialsSection() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            What Our Students Say
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Join 500+ businesses that have transformed their operations with our automation training
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  
                  <Quote className="w-8 h-8 text-blue-500 mb-4" />
                  
                  <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                    "{testimonial.content}"
                  </p>
                  
                  <div className="flex items-center">
                    <Avatar className="h-12 w-12 mr-4">
                      <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                      <AvatarFallback>{testimonial.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-gray-500">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}