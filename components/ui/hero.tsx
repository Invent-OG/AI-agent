"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Calendar, Clock, Users, Star, Bot, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export function Hero2() {
  const scrollToRegistration = () => {
    const element = document.querySelector('#register');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-950 dark:via-blue-950/30 dark:to-indigo-950/30">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-100/40 via-transparent to-purple-100/40 dark:from-blue-900/20 dark:to-purple-900/20" />
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(59,130,246,0.05)_50%,transparent_75%)] bg-[length:60px_60px]" />
        
        {/* Floating Elements */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-xl animate-pulse" />
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-6 sm:space-y-8 lg:space-y-12">
            {/* Badge */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex justify-center"
            >
              <Badge className="px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-medium bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-700 hover:shadow-lg transition-all duration-300">
                <Sparkles className="w-4 h-4 mr-2" />
                🔥 Live Workshop - Limited Seats Available
              </Badge>
            </motion.div>

            {/* Main Headline */}
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-tight"
            >
              <span className="block bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent">
                Master Business
              </span>
              <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Automation in 3 Hours
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg sm:text-xl lg:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed px-4"
            >
              Join our exclusive live workshop and learn how to automate your business with 
              <span className="font-semibold text-blue-600 dark:text-blue-400"> Zapier</span>, 
              <span className="font-semibold text-purple-600 dark:text-purple-400"> n8n</span>, and 
              <span className="font-semibold text-pink-600 dark:text-pink-400"> Make.com</span>. 
              Save 20+ hours weekly and transform your operations.
            </motion.p>

            {/* CTA Section */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="space-y-6 sm:space-y-8"
            >
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button 
                  size="lg" 
                  onClick={scrollToRegistration}
                  className="group px-8 sm:px-12 py-4 sm:py-6 text-lg sm:text-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-xl hover:shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 w-full sm:w-auto"
                >
                  <Calendar className="w-5 h-5 sm:w-6 sm:h-6 mr-3" />
                  Register for ₹499
                  <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 ml-3 group-hover:translate-x-1 transition-transform" />
                </Button>
                
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => document.querySelector('#agenda')?.scrollIntoView({ behavior: 'smooth' })}
                  className="px-8 sm:px-12 py-4 sm:py-6 text-lg sm:text-xl border-2 border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-lg transition-all duration-300 w-full sm:w-auto"
                >
                  <Clock className="w-5 h-5 sm:w-6 sm:h-6 mr-3" />
                  View Agenda
                </Button>
              </div>

              <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
                🔒 Secure payment • 💰 30-day money-back guarantee • 🎯 Limited to 100 attendees
              </p>
            </motion.div>

            {/* Workshop Info Cards */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 pt-8 sm:pt-12 max-w-6xl mx-auto"
            >
              <Card className="group hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
                <CardContent className="p-4 sm:p-6 text-center">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900 dark:text-white text-sm sm:text-base mb-1 sm:mb-2">
                    January 15, 2025
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    Live Workshop Date
                  </p>
                </CardContent>
              </Card>
              
              <Card className="group hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
                <CardContent className="p-4 sm:p-6 text-center">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900 dark:text-white text-sm sm:text-base mb-1 sm:mb-2">
                    3 Hours Live
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    Intensive Training
                  </p>
                </CardContent>
              </Card>
              
              <Card className="group hover:shadow-xl hover:shadow-green-500/10 transition-all duration-300 border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
                <CardContent className="p-4 sm:p-6 text-center">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-emerald-500 to-green-500 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Users className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900 dark:text-white text-sm sm:text-base mb-1 sm:mb-2">
                    28 Seats Left
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    Out of 100 Total
                  </p>
                </CardContent>
              </Card>
              
              <Card className="group hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-300 border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
                <CardContent className="p-4 sm:p-6 text-center">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Star className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900 dark:text-white text-sm sm:text-base mb-1 sm:mb-2">
                    4.9/5 Rating
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    From 500+ Students
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Social Proof Stats */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.0 }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 pt-8 sm:pt-12 max-w-4xl mx-auto"
            >
              <div className="text-center">
                <div className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  500+
                </div>
                <div className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
                  Businesses Automated
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  20+
                </div>
                <div className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
                  Hours Saved Weekly
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                  ₹2L+
                </div>
                <div className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
                  Average Cost Savings
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}