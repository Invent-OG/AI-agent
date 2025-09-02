'use client'

import { motion } from 'framer-motion'
import { CheckCircle, Clock, Users, Trophy } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const modules = [
  {
    title: 'Automation Fundamentals',
    duration: '2 hours',
    lessons: 8,
    level: 'Beginner',
    description: 'Master the basics of workflow automation and understand key concepts',
    topics: [
      'Introduction to automation',
      'Zapier basics and setup',
      'Trigger and action concepts',
      'Error handling fundamentals'
    ]
  },
  {
    title: 'Advanced Zapier Workflows',
    duration: '3 hours',
    lessons: 12,
    level: 'Intermediate',
    description: 'Build complex multi-step automations with conditional logic',
    topics: [
      'Multi-step workflows',
      'Conditional logic and filters',
      'Data formatting and manipulation',
      'Advanced integrations'
    ]
  },
  {
    title: 'n8n Power User Guide',
    duration: '4 hours',
    lessons: 15,
    level: 'Advanced',
    description: 'Create sophisticated automations with visual workflow builder',
    topics: [
      'n8n installation and setup',
      'Complex workflow design',
      'Custom nodes and functions',
      'API integrations'
    ]
  },
  {
    title: 'Make.com Mastery',
    duration: '3 hours',
    lessons: 10,
    level: 'Intermediate',
    description: 'Leverage Make.com for powerful automation scenarios',
    topics: [
      'Make.com fundamentals',
      'Scenario building',
      'Data routing and processing',
      'Error handling and monitoring'
    ]
  }
]

export function CourseModules() {
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
            Complete Automation Mastery Program
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            12 hours of comprehensive training with hands-on projects and real-world scenarios
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {modules.map((module, index) => (
            <motion.div
              key={module.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant={module.level === 'Beginner' ? 'secondary' : module.level === 'Intermediate' ? 'default' : 'destructive'}>
                      {module.level}
                    </Badge>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {module.duration}
                      </div>
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        {module.lessons} lessons
                      </div>
                    </div>
                  </div>
                  <CardTitle className="text-xl">{module.title}</CardTitle>
                  <p className="text-gray-600 dark:text-gray-300">{module.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {module.topics.map((topic, topicIndex) => (
                      <div key={topicIndex} className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        <span className="text-sm">{topic}</span>
                      </div>
                    ))}
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