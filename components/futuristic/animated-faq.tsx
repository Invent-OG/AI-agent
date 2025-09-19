"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const faqs = [
  {
    question: "What automation tools will be covered?",
    answer:
      "We'll cover Zapier, n8n, and Make.com in detail. You'll learn when to use each tool and how to build complex workflows that save hours of manual work.",
  },
  {
    question: "Do I need any technical background?",
    answer:
      "Not at all! This workshop is designed for business owners and professionals with no coding experience. We'll guide you step-by-step through everything.",
  },
  {
    question: "Will I get the workshop recording?",
    answer:
      "Yes! All attendees get lifetime access to the workshop recording, templates, and bonus materials. You can revisit the content anytime.",
  },
  {
    question: "What if I can't attend live?",
    answer:
      "While we highly recommend attending live for the interactive Q&A, you'll receive the full recording within 24 hours if you can't make it.",
  },
  {
    question: "Is there a money-back guarantee?",
    answer:
      "Absolutely! We offer a 30-day money-back guarantee. If you're not satisfied with the workshop content, get a full refund.",
  },
  {
    question: "Will I get ongoing support?",
    answer:
      "Yes! Workshop attendees get access to our private Slack community where you can ask questions and get help with your automations.",
  },
];

export function AnimatedFAQ() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const accordionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const ctx = gsap.context(() => {
      // FAQ items staggered animation
      gsap.fromTo(
        ".faq-item",
        { x: -50, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: {
            trigger: accordionRef.current,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Title animation
      gsap.fromTo(
        ".faq-title",
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
    <section ref={sectionRef} className="py-20  relative">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="faq-title text-4xl md:text-5xl font-bold mb-6 text-white">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Everything you need to know about the workshop
          </p>
        </div>

        <div ref={accordionRef} className="max-w-4xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="faq-item">
                <AccordionItem
                  value={`item-${index}`}
                  className="glass-dark border-gray-700/50 rounded-xl px-6 hover:border-blue-500/50 transition-all duration-300"
                >
                  <AccordionTrigger className="text-left hover:no-underline text-white hover:text-blue-400 transition-colors">
                    <span className="font-semibold text-lg">
                      {faq.question}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-300 leading-relaxed text-lg pt-4">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              </div>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
