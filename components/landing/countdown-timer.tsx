'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Clock } from 'lucide-react'

export function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({
    days: 7,
    hours: 0,
    minutes: 0,
    seconds: 0
  })

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 }
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 }
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 }
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 }
        }
        return prev
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-red-500 to-pink-500 text-white py-8 text-center"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center mb-4">
          <Clock className="w-6 h-6 mr-2" />
          <h3 className="text-xl font-bold">Early Bird Offer Ends In:</h3>
        </div>
        
        <div className="flex items-center justify-center space-x-8">
          {Object.entries(timeLeft).map(([unit, value]) => (
            <div key={unit} className="text-center">
              <div className="text-3xl md:text-4xl font-bold bg-white text-red-500 rounded-lg p-4 min-w-[80px]">
                {value.toString().padStart(2, '0')}
              </div>
              <div className="text-sm mt-2 capitalize">{unit}</div>
            </div>
          ))}
        </div>
        
        <p className="mt-4 text-lg">
          Don't miss out on 50% savings! Price goes up to ₹9,999 after the timer ends.
        </p>
      </div>
    </motion.div>
  )
}