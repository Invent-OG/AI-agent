"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Clock, Target, TrendingUp, Users, Zap, Brain } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const benefits = [
  {
    icon: Clock,
    title: "Save 20+ Hours Weekly",
    description:
      "Automate repetitive tasks and focus on what matters most for your business growth",
    color: "text-blue-400",
  },
  {
    icon: Target,
    title: "Reduce Errors by 95%",
    description:
      "Eliminate human errors with precise automated workflows and data processing",
    color: "text-purple-400",
  },
  {
    icon: TrendingUp,
    title: "Cut Costs by 60%",
    description:
      "Reduce operational expenses by automating manual processes and workflows",
    color: "text-green-400",
  },
  {
    icon: Users,
    title: "Scale Without Hiring",
    description:
      "Handle 10x more work with the same team size using smart automation",
    color: "text-pink-400",
  },
  {
    icon: Zap,
    title: "Instant Implementation",
    description:
      "Start automating immediately with our proven templates and frameworks",
    color: "text-yellow-400",
  },
  {
    icon: Brain,
    title: "AI-Powered Workflows",
    description:
      "Leverage cutting-edge AI to create intelligent, adaptive automation systems",
    color: "text-cyan-400",
  },
];

export function WhyAttendSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const ctx = gsap.context(() => {
      // Staggered card animations
      gsap.fromTo(
        ".benefit-card",
        {
          y: 100,
          opacity: 0,
          scale: 0.8,
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.2,
          scrollTrigger: {
            trigger: cardsRef.current,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Title animation
      gsap.fromTo(
        ".section-title",
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 85%",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 relative  overflow-hidden">
      {/* <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-900/10 to-transparent" /> */}

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="section-title text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Why Attend This Workshop?
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Transform your business operations with cutting-edge automation
            strategies
          </p>
        </div>

        <div
          ref={cardsRef}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {benefits.map((benefit, index) => (
            <Card
              key={benefit.title}
              className="benefit-card glass-dark border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 group"
            >
              <CardContent className="p-8 text-center">
                <div
                  className={`inline-flex p-4 rounded-2xl bg-gray-800/50 mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  <benefit.icon className={`w-8 h-8 ${benefit.color}`} />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">
                  {benefit.title}
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  {benefit.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
