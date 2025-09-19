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
    <div className="relative min-h-screen  overflow-hidden">
      <Hero2 />

      <section id="why-attend" className="relative bg-transparent">
        <WhyAttendSection />
        <div className="flex flex-col items-start absolute -left-60 -top-10 blur-xl z-0 ">
          <div className="h-[10rem] rounded-full w-[60rem] z-1 bg-gradient-to-b blur-[6rem] from-purple-600 to-sky-600"></div>
          <div className="h-[10rem] rounded-full w-[90rem] z-1 bg-gradient-to-b blur-[6rem] from-pink-900 to-yellow-400"></div>
          <div className="h-[10rem] rounded-full w-[60rem] z-1 bg-gradient-to-b blur-[6rem] from-yellow-600 to-sky-500"></div>
        </div>
      </section>

      <section id="learn">
        <WhatYouLearn />
      </section>

      {/* <section id="agenda">
        <AgendaTimeline />
      </section> */}

      <section id="testimonials" className="relative bg-transparent">
        <div className="flex flex-col items-end absolute -right-60 -top-10 blur-xl z-0 ">
          <div className="h-[10rem] rounded-full w-[60rem] z-1 bg-gradient-to-b blur-[6rem] from-purple-600 to-sky-600"></div>
          <div className="h-[10rem] rounded-full w-[90rem] z-1 bg-gradient-to-b blur-[6rem] from-pink-900 to-yellow-400"></div>
          <div className="h-[10rem] rounded-full w-[60rem] z-1 bg-gradient-to-b blur-[6rem] from-yellow-600 to-sky-500"></div>
        </div>
        <Testimonials3D />
      </section>

      <section className="relative bg-transparent" id="pricing">
        <div className="flex flex-col items-center absolute  -bottom-10 blur-xl z-0 ">
          <div className="h-[10rem] rounded-full w-[60rem] z-1 bg-gradient-to-b blur-[6rem] from-purple-600 to-sky-600"></div>
          <div className="h-[10rem] rounded-full w-[90rem] z-1 bg-gradient-to-b blur-[6rem] from-pink-900 to-yellow-400"></div>
          <div className="h-[10rem] rounded-full w-[60rem] z-1 bg-gradient-to-b blur-[6rem] from-yellow-600 to-sky-500"></div>
        </div>
        <PricingGlow />
      </section>

      {/* <section id="register">
        <RegistrationForm />
      </section> */}

      <section id="faq">
        <AnimatedFAQ />
      </section>

      <FinalCTA />
    </div>
  );
}
