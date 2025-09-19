"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CheckCircle, Code, Workflow, Settings, BarChart3 } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const learningPoints = [
  {
    icon: Workflow,
    title: "Master Zapier Automation",
    description:
      "Build powerful workflows connecting 5000+ apps without coding",
  },
  {
    icon: Code,
    title: "n8n Advanced Techniques",
    description:
      "Create complex automations with visual programming and custom nodes",
  },
  {
    icon: Settings,
    title: "Make.com Integration",
    description:
      "Design sophisticated scenarios for enterprise-level automation",
  },
  {
    icon: BarChart3,
    title: "ROI Optimization",
    description: "Measure and maximize your automation return on investment",
  },
];

export function WhatYouLearn() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const pointsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const ctx = gsap.context(() => {
      // Horizontal scroll animation for learning points
      gsap.fromTo(
        ".learning-point",
        { x: -100, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.3,
          scrollTrigger: {
            trigger: pointsRef.current,
            start: "top 75%",
            end: "bottom 25%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Section title animation
      gsap.fromTo(
        ".learn-title",
        { scale: 0.8, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 1,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 ">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="learn-title text-4xl md:text-5xl font-bold mb-6 text-white">
            What You&apos;ll Learn in 3 Hours
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Comprehensive automation training that will revolutionize how you
            work
          </p>
        </div>

        <div ref={pointsRef} className="max-w-4xl mx-auto space-y-8">
          {learningPoints.map((point, index) => (
            <div
              key={point.title}
              className="learning-point flex items-start space-x-6 p-6 glass-dark rounded-[3rem] border border-gray-700/50"
            >
              <div className="flex-shrink-0">
                <div className="p-3 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-[3rem]">
                  <point.icon className="w-8 h-8 text-blue-400" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-white mb-3">
                  {point.title}
                </h3>
                <p className="text-gray-300 text-lg leading-relaxed">
                  {point.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
