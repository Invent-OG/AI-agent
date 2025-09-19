"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  CheckCircle,
  Zap,
  Gift,
  Users,
  Clock,
  Shield,
  Star,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function PricingGlow() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardRef.current,
        { scale: 0.9, opacity: 0, y: 60 },
        {
          scale: 1,
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: cardRef.current,
            start: "top 80%",
          },
        }
      );

      gsap.fromTo(
        ".pricing-feature",
        { x: -30, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.6,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: {
            trigger: cardRef.current,
            start: "top 70%",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const features = [
    "Live 3-hour automation workshop",
    "Zapier, n8n, and Make.com training",
    "Ready-to-use automation templates",
    "Private Slack community access",
    "Workshop recording (lifetime access)",
    "Bonus: 1-on-1 consultation call",
    "Certificate of completion",
    "30-day money-back guarantee",
  ];

  const scrollToRegistration = () => {
    const element = document.querySelector("#register");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section ref={sectionRef} className="py-12 sm:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
            Limited Time Offer
          </h2>
          <p className="text-lg sm:text-xl max-w-3xl mx-auto">
            Don&apos;t miss this opportunity to transform your business
            operations
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Card
            ref={cardRef}
            className="rounded-[3rem] border border-white/20 bg-white/10 backdrop-blur-xl shadow-lg transition-all duration-300 overflow-hidden"
          >
            <CardHeader className="text-center pb-6 sm:pb-8 pt-6 sm:pt-8">
              <div className="flex justify-center mb-4">
                <Badge className="px-4 sm:px-6 py-2 sm:py-3 bg-blue-100 text-blue-800 text-sm sm:text-base">
                  <Gift className="w-4 h-4 mr-2" />
                  83% OFF - Today Only
                </Badge>
              </div>

              <CardTitle className="text-2xl sm:text-3xl lg:text-4xl   mb-4">
                Live Automation Workshop
              </CardTitle>

              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-center space-x-4">
                  <span className="text-4xl sm:text-5xl lg:text-6xl font-bold  ">
                    ₹499
                  </span>
                  <span className="text-xl sm:text-2xl  line-through block">
                    ₹2,999
                  </span>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6 sm:p-8 space-y-6 sm:space-y-8">
              {/* Features list */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="pricing-feature flex items-center space-x-3"
                  >
                    <CheckCircle className="w-5 h-5 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                    <span className="text-sm sm:text-base">{feature}</span>
                  </div>
                ))}
              </div>

              {/* Progress indicator */}
              <div className="space-y-2 bg-gray-50 dark:bg-gray-800 rounded-3xl border p-4 sm:p-6">
                <div className="text-sm sm:text-base text-gray-600 dark:text-gray-400 font-medium mb-2">
                  72 / 100 seats filled
                </div>
                <Progress
                  value={72}
                  className="h-3 bg-gray-200 dark:bg-gray-700"
                />
              </div>

              <Button
                onClick={scrollToRegistration}
                size="lg"
                className="w-full h-14 sm:h-16 text-lg sm:text-xl hover:bg-white/50  bg-white rounded-full shadow-none  duration-300"
              >
                <Zap className="w-5 h-5 sm:w-6 sm:h-6 mr-3" />
                Register Now for ₹499
              </Button>

              <div className="flex items-center justify-center space-x-6 sm:space-x-8 pt-4 text-xs sm:text-sm ">
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4" />
                  <span>SSL Secured</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Star className="w-4 h-4" />
                  <span>4.9/5 Rating</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>Instant Access</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
