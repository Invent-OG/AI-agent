'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

const integrations = [
  { name: 'Zapier', logo: '/api/placeholder/120/60' },
  { name: 'n8n', logo: '/api/placeholder/120/60' },
  { name: 'Make', logo: '/api/placeholder/120/60' },
  { name: 'Slack', logo: '/api/placeholder/120/60' },
  { name: 'WhatsApp', logo: '/api/placeholder/120/60' },
  { name: 'Gmail', logo: '/api/placeholder/120/60' },
  { name: 'Sheets', logo: '/api/placeholder/120/60' },
  { name: 'Notion', logo: '/api/placeholder/120/60' },
]

export function IntegrationsShowcase() {
  return (
    <section className="py-20 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Integrate with 100+ Popular Tools
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Connect your favorite apps and automate workflows seamlessly
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-8 items-center">
          {integrations.map((integration, index) => (
            <motion.div
              key={integration.name}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="flex items-center justify-center p-4 rounded-lg bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-20 h-10 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center text-xs font-medium text-gray-500">
                {integration.name}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}