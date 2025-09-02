'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { Loader2, Gift } from 'lucide-react'

const leadSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  company: z.string().optional(),
  useCase: z.string().optional(),
  phone: z.string().optional(),
  source: z.enum(['landing', 'audit']).default('landing'),
})

type LeadFormData = z.infer<typeof leadSchema>

export function LeadForm({ source = 'landing', title = 'Start Your Automation Journey' }: {
  source?: 'landing' | 'audit'
  title?: string
}) {
  const { toast } = useToast()
  const [isSubmitted, setIsSubmitted] = useState(false)

  const form = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      source,
    },
  })

  const submitLead = useMutation({
    mutationFn: async (data: LeadFormData) => {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!response.ok) throw new Error('Failed to submit')
      return response.json()
    },
    onSuccess: () => {
      setIsSubmitted(true)
      toast({
        title: 'Success!',
        description: 'We\'ll contact you within 24 hours with your free audit results.',
      })
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      })
    },
  })

  const onSubmit = (data: LeadFormData) => {
    submitLead.mutate(data)
  }

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center p-8 bg-green-50 dark:bg-green-900/20 rounded-lg"
      >
        <div className="w-16 h-16 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center mx-auto mb-4">
          <Gift className="w-8 h-8 text-green-600 dark:text-green-400" />
        </div>
        <h3 className="text-2xl font-bold text-green-800 dark:text-green-200 mb-2">
          Thank You!
        </h3>
        <p className="text-green-700 dark:text-green-300 mb-4">
          Your {source === 'audit' ? 'audit request' : 'enrollment inquiry'} has been received.
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          We'll contact you within 24 hours with next steps.
        </p>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <Card className="max-w-lg mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl text-center">{title}</CardTitle>
          <p className="text-center text-gray-600 dark:text-gray-300">
            {source === 'audit' 
              ? 'Get a free automation audit for your business' 
              : 'Reserve your spot in our automation masterclass'
            }
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                {...form.register('name')}
                placeholder="Enter your full name"
              />
              {form.formState.errors.name && (
                <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                {...form.register('email')}
                placeholder="Enter your email address"
              />
              {form.formState.errors.email && (
                <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="company">Company Name</Label>
              <Input
                id="company"
                {...form.register('company')}
                placeholder="Your company name (optional)"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                {...form.register('phone')}
                placeholder="Your phone number (optional)"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="useCase">
                {source === 'audit' ? 'What would you like to automate?' : 'What interests you most?'}
              </Label>
              <Textarea
                id="useCase"
                {...form.register('useCase')}
                placeholder={source === 'audit' 
                  ? 'Describe your current manual processes...'
                  : 'Tell us about your automation goals...'
                }
                rows={4}
              />
            </div>

            <Button
              type="submit"
              className="w-full py-3 text-lg"
              disabled={submitLead.isPending}
            >
              {submitLead.isPending ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                source === 'audit' ? 'Get Free Audit' : 'Reserve My Spot'
              )}
            </Button>

            <p className="text-xs text-center text-gray-500">
              By submitting, you agree to receive course updates via email. 
              Unsubscribe anytime.
            </p>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  )
}