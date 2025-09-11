import { FuturisticNavbar } from "@/components/futuristic/futuristic-navbar";
import { AnimatedHero } from "@/components/futuristic/animated-hero";
import { WhyAttendSection } from "@/components/futuristic/why-attend-section";
import { WhatYouLearn } from "@/components/futuristic/what-you-learn";
import { AgendaTimeline } from "@/components/futuristic/agenda-timeline";
import { Testimonials3D } from "@/components/futuristic/testimonials-3d";
import { PricingGlow } from "@/components/futuristic/pricing-glow";
import { AnimatedFAQ } from "@/components/futuristic/animated-faq";
import { RegistrationForm } from "@/components/futuristic/registration-form";
import { FinalCTA } from "@/components/futuristic/final-cta";
import { Hero2 } from "@/components/ui/hero";

export default function WorkshopPage() {
  return (
    <div className="min-h-screen bg-black">
      <FuturisticNavbar />
      {/* <AnimatedHero /> */}
      <Hero2 />

      <section id="why-attend">
        <WhyAttendSection />
      </section>

      <section id="learn">
        <WhatYouLearn />
      </section>

      <section id="agenda">
        <AgendaTimeline />
      </section>

      <section id="testimonials">
        <Testimonials3D />
      </section>

      <PricingGlow />

      <section id="register">
        <RegistrationForm />
      </section>

      <section id="faq">
        <AnimatedFAQ />
      </section>

      <FinalCTA />
    </div>
  );
}
