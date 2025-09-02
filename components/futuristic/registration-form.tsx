'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { gsap } from 'gsap'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation } from '@tanstack/react-query'
import Confetti from 'react-confetti'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { Loader2, CheckCircle, Sparkles } from 'lucide-react'

const registrationSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  company: z.string().optional(),
})

type RegistrationFormData = z.infer<typeof registrationSchema>

export function RegistrationForm() {
  const { toast } = useToast()
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const formRef = useRef<HTMLDivElement>(null)
  const fieldsRef = useRef<HTMLDivElement>(null)

  const form = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
  })

  useEffect(() => {
    if (typeof window === 'undefined') return

    const ctx = gsap.context(() => {
      // Form fields entrance animation
      gsap.fromTo(".form-field",
        { x: -50, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.6,
          ease: "power3.out",
          stagger: 0.1
        }
      )

      // Form card animation
      gsap.fromTo(formRef.current,
        { scale: 0.9, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.8,
          ease: "back.out(1.7)"
        }
      )

    }, formRef)

    return () => ctx.revert()
  }, [])

  const submitRegistration = useMutation({
    mutationFn: async (data: RegistrationFormData) => {
      const response = await fetch('/api/workshop/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!response.ok) throw new Error('Failed to register')
      return response.json()
    },
    onSuccess: (data) => {
      setIsSubmitted(true)
      setShowConfetti(true)
      
      // Confetti animation
      setTimeout(() => setShowConfetti(false), 5000)
      
      // Success animation
      gsap.fromTo(".success-content",
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.8,
          ease: "back.out(1.7)"
        }
      )

      // Redirect to payment
      setTimeout(() => {
        if (data.paymentUrl) {
          window.location.href = data.paymentUrl
        }
      }, 2000)

      toast({
        title: 'Registration Successful!',
        description: 'Redirecting to secure payment...',
      })
    },
    onError: () => {
      toast({
        title: 'Registration Failed',
        description: 'Please try again or contact support.',
        variant: 'destructive',
      })
    },
  })

  const onSubmit = (data: RegistrationFormData) => {
    submitRegistration.mutate(data)
  }

  if (isSubmitted) {
    return (
      <>
        {showConfetti && <Confetti />}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="success-content text-center p-12 glass-dark rounded-2xl border border-green-500/30 max-w-lg mx-auto"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 glow-effect">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-3xl font-bold text-white mb-4">
            Registration Successful! 🎉
          </h3>
          <p className="text-gray-300 mb-6 text-lg">
            Redirecting you to secure payment gateway...
          </p>
          <div className="flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-blue-400 mr-2" />
            <span className="text-blue-400">Processing...</span>
          </div>
        </motion.div>
      </>
    )
  }

  return (
    <section className="py-20 bg-gradient-to-b from-gray-900 to-gray-800 relative">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-purple-900/10 to-pink-900/10" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Reserve Your Seat
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Join the automation revolution - Limited seats available
          </p>
        </div>

        <Card ref={formRef} className="max-w-lg mx-auto glass-dark border-gray-700/50 glow-effect">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-white flex items-center justify-center">
              <Sparkles className="w-6 h-6 mr-2 text-blue-400" />
              Workshop Registration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div ref={fieldsRef} className="space-y-6">
                <div className="form-field space-y-2">
                  <Label htmlFor="name" className="text-gray-300">Full Name *</Label>
                  <Input
                    id="name"
                    {...form.register('name')}
                    placeholder="Enter your full name"
                    className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-blue-500"
                  />
                  {form.formState.errors.name && (
                    <p className="text-sm text-red-400">{form.formState.errors.name.message}</p>
                  )}
                </div>

                <div className="form-field space-y-2">
                  <Label htmlFor="email" className="text-gray-300">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    {...form.register('email')}
                    placeholder="Enter your email address"
                    className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-blue-500"
                  />
                  {form.formState.errors.email && (
                    <p className="text-sm text-red-400">{form.formState.errors.email.message}</p>
                  )}
                </div>

                <div className="form-field space-y-2">
                  <Label htmlFor="phone" className="text-gray-300">Phone Number *</Label>
                  <Input
                    id="phone"
                    {...form.register('phone')}
                    placeholder="Enter your phone number"
                    className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-blue-500"
                  />
                  {form.formState.errors.phone && (
                    <p className="text-sm text-red-400">{form.formState.errors.phone.message}</p>
                  )}
                </div>

                <div className="form-field space-y-2">
                  <Label htmlFor="company" className="text-gray-300">Company Name</Label>
                  <Input
                    id="company"
                    {...form.register('company')}
                    placeholder="Your company name (optional)"
                    className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-blue-500"
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full py-4 text-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 glow-effect"
                disabled={submitRegistration.isPending}
              >
                {submitRegistration.isPending ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Processing Registration...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Register & Pay ₹499
                  </>
                )}
              </Button>

              <p className="text-xs text-center text-gray-400">
                🔒 Secure payment via Cashfree • 💰 30-day money-back guarantee
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}