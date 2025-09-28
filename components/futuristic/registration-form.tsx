'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { gsap } from 'gsap'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import Confetti from 'react-confetti'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { Loader as Loader2, CircleCheck as CheckCircle, Sparkles, Shield, Clock, Users, Bot } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

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
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 })
  const formRef = useRef<HTMLDivElement>(null)

  // Fetch dynamic workshop details
  const { data: workshopData } = useQuery({
    queryKey: ["workshop-details"],
    queryFn: async () => {
      const response = await fetch("/api/workshop/details");
      if (!response.ok) throw new Error("Failed to fetch workshop details");
      return response.json();
    },
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight })
    }
    
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const form = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
  })

  useEffect(() => {
    if (typeof window === 'undefined') return

    const ctx = gsap.context(() => {
      // Modern form animation
      gsap.fromTo(".form-field",
        { x: -30, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.6,
          ease: "power3.out",
          stagger: 0.1
        }
      )

      gsap.fromTo(formRef.current,
        { scale: 0.95, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out"
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
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to register');
      }
      return response.json()
    },
    onSuccess: (data) => {
      setIsSubmitted(true)
      setShowConfetti(true)
      
      setTimeout(() => setShowConfetti(false), 5000)
      
      gsap.fromTo(".success-content",
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.8,
          ease: "back.out(1.7)"
        }
      )

      setTimeout(() => {
        if (data.paymentUrl) {
          console.log("Redirecting to payment URL:", data.paymentUrl);
          window.location.href = data.paymentUrl
        }
      }, 2000)

      toast({
        title: 'Registration Successful! 🎉',
        description: 'Redirecting to secure payment...',
      })
    },
    onError: (error: any) => {
      console.error("Registration error:", error);
      toast({
        title: 'Registration Failed',
        description: error.message || 'Please try again or contact support.',
        variant: 'destructive',
      })
    },
  })

  const onSubmit = (data: RegistrationFormData) => {
    console.log("Submitting registration:", data);
    submitRegistration.mutate(data)
  }

  const workshop = workshopData?.data;
  const pricing = workshop?.pricing;

  if (isSubmitted) {
    return (
      <section className="py-12 sm:py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-950 dark:via-blue-950/30 dark:to-indigo-950/30">
        {showConfetti && (
          <Confetti
            width={windowSize.width}
            height={windowSize.height}
            recycle={false}
            numberOfPieces={200}
          />
        )}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="success-content text-center max-w-2xl mx-auto"
          >
            <Card className="border-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-2xl">
              <CardContent className="p-8 sm:p-12">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                  <CheckCircle className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
                </div>
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  Registration Successful! 🎉
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-8 text-lg sm:text-xl">
                  Redirecting you to secure payment gateway...
                </p>
                <div className="flex items-center justify-center space-x-3">
                  <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                  <span className="text-blue-600 dark:text-blue-400 font-medium">Processing payment...</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-12 sm:py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-950 dark:via-blue-950/30 dark:to-indigo-950/30 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-100/40 via-transparent to-purple-100/40 dark:from-blue-900/20 dark:to-purple-900/20" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent">
            Secure Your Seat Today
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Join the automation revolution - Transform your business in just 3 hours
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card ref={formRef} className="border-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-2xl hover:shadow-3xl transition-all duration-500">
            <CardHeader className="text-center pb-6 sm:pb-8">
              <div className="flex justify-center mb-4">
                <Badge className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-700 text-sm sm:text-base">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Early Bird Special - {pricing?.discount || 83}% OFF
                </Badge>
              </div>
              
              <CardTitle className="text-2xl sm:text-3xl text-gray-900 dark:text-white flex items-center justify-center flex-wrap gap-2">
                <Bot className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
                Workshop Registration
              </CardTitle>
              
              <div className="flex items-center justify-center space-x-4 sm:space-x-6 mt-4 text-sm sm:text-base">
                <div className="flex items-center text-green-600 dark:text-green-400">
                  <Shield className="w-4 h-4 mr-2" />
                  <span>Secure</span>
                </div>
                <div className="flex items-center text-blue-600 dark:text-blue-400">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>Instant Access</span>
                </div>
                <div className="flex items-center text-purple-600 dark:text-purple-400">
                  <Users className="w-4 h-4 mr-2" />
                  <span>{workshop?.availableSeats || 28} Seats Left</span>
                </div>
              </div>

              {/* Live pricing display */}
              <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl">
                <div className="flex items-center justify-center space-x-4">
                  <span className="text-3xl sm:text-4xl font-bold text-green-600">
                    ₹{pricing?.current?.toLocaleString() || "499"}
                  </span>
                  <span className="text-lg sm:text-xl text-gray-500 line-through">
                    ₹{pricing?.original?.toLocaleString() || "2,999"}
                  </span>
                </div>
                {pricing?.savings && (
                  <p className="text-center text-green-600 font-semibold mt-2">
                    Save ₹{pricing.savings.amount?.toLocaleString()} ({pricing.savings.percentage}% OFF)
                  </p>
                )}
              </div>
            </CardHeader>
            
            <CardContent className="p-6 sm:p-8">
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="form-field space-y-2">
                    <Label htmlFor="name" className="text-gray-700 dark:text-gray-300 font-medium">
                      Full Name *
                    </Label>
                    <Input
                      id="name"
                      {...form.register('name')}
                      placeholder="Enter your full name"
                      className="h-12 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                    />
                    {form.formState.errors.name && (
                      <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
                    )}
                  </div>

                  <div className="form-field space-y-2">
                    <Label htmlFor="email" className="text-gray-700 dark:text-gray-300 font-medium">
                      Email Address *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      {...form.register('email')}
                      placeholder="Enter your email"
                      className="h-12 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                    />
                    {form.formState.errors.email && (
                      <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="form-field space-y-2">
                    <Label htmlFor="phone" className="text-gray-700 dark:text-gray-300 font-medium">
                      Phone Number *
                    </Label>
                    <Input
                      id="phone"
                      {...form.register('phone')}
                      placeholder="Enter your phone number"
                      className="h-12 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                    />
                    {form.formState.errors.phone && (
                      <p className="text-sm text-red-500">{form.formState.errors.phone.message}</p>
                    )}
                  </div>

                  <div className="form-field space-y-2">
                    <Label htmlFor="company" className="text-gray-700 dark:text-gray-300 font-medium">
                      Company Name
                    </Label>
                    <Input
                      id="company"
                      {...form.register('company')}
                      placeholder="Your company (optional)"
                      className="h-12 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <Button
                    type="submit"
                    className="w-full h-14 text-lg sm:text-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-xl hover:shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 group"
                    disabled={submitRegistration.isPending}
                  >
                    {submitRegistration.isPending ? (
                      <>
                        <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 mr-3 animate-spin" />
                        Processing Registration...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 mr-3 group-hover:rotate-12 transition-transform" />
                        Register & Pay ₹{pricing?.current?.toLocaleString() || "499"}
                      </>
                    )}
                  </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 text-center">
                  <div className="flex items-center justify-center text-green-600 dark:text-green-400 text-xs sm:text-sm">
                    <Shield className="w-4 h-4 mr-2" />
                    <span>Secure Payment</span>
                  </div>
                  <div className="flex items-center justify-center text-blue-600 dark:text-blue-400 text-xs sm:text-sm">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    <span>Instant Access</span>
                  </div>
                  <div className="flex items-center justify-center text-purple-600 dark:text-purple-400 text-xs sm:text-sm">
                    <Shield className="w-4 h-4 mr-2" />
                    <span>Money-back Guarantee</span>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}