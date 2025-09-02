'use client'

import { motion } from 'framer-motion'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

const faqs = [
  {
    question: 'What automation tools will I learn?',
    answer: 'You\'ll master Zapier, n8n, Make.com, and learn integrations with popular apps like Slack, WhatsApp, Gmail, Google Sheets, Notion, and 100+ other platforms.'
  },
  {
    question: 'Do I need any technical background?',
    answer: 'No! Our course is designed for beginners. We start with basics and gradually progress to advanced concepts. No coding required.'
  },
  {
    question: 'How much time will I save after the course?',
    answer: 'Most students save 15-25 hours per week by automating repetitive tasks. Some advanced users save up to 40 hours weekly.'
  },
  {
    question: 'What kind of support do I get?',
    answer: 'You get email support, access to our private Slack community, live Q&A sessions, and depending on your plan, 1-on-1 coaching calls.'
  },
  {
    question: 'Is there a money-back guarantee?',
    answer: 'Yes! We offer a 30-day money-back guarantee. If you\'re not satisfied with the course content, get a full refund within 30 days.'
  },
  {
    question: 'How long do I have access to the course?',
    answer: 'You get lifetime access to all course materials, templates, and future updates. Learn at your own pace, forever.'
  },
  {
    question: 'Can I use this for my agency/clients?',
    answer: 'Absolutely! Many of our students use these skills to offer automation services to clients or improve their agency operations.'
  },
  {
    question: 'What if I need help with custom automations?',
    answer: 'Pro and Business plan members get dedicated support for custom automation setup and strategy sessions with our experts.'
  }
]

export function FAQSection() {
  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Got questions? We have answers. Find everything you need to know about our automation course.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-white dark:bg-gray-800 rounded-lg px-6 border"
              >
                <AccordionTrigger className="text-left hover:no-underline">
                  <span className="font-semibold">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  )
}