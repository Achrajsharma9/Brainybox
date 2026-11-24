// page.tsx

"use client"

import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import FeatureSection from "@/components/FeatureSection";
import ParallaxSection from "@/components/ParallaxSection";

import ToolPreviewsCarousel from "@/components/ToolPreviewsCarousel";
import StatsSection from "@/components/StatsSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import SectionNavigator from "@/components/SectionNavigator";
// import FAQSection from "@/components/FAQSection";
// import Footer from "@/components/Footer";
import ParticleBackground from "@/components/ParticleBackground";
import { useState, useEffect } from "react";
import { ThemeProvider } from "next-themes";
import DonationSection from "@/components/DonationSection";
import CTASection from "@/components/CTAsection";

export default function Home() {
  const [mounted, setMounted] = useState(false);

  // Theme provider needs to be mounted client-side only
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (

    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <div className="relative min-h-screen overflow-x-hidden">
        {/* Interactive background */}
        <ParticleBackground />

        {/* Fixed section navigator */}
        <SectionNavigator
          sections={[
            { id: "hero", name: "Home" },
            { id: "features", name: "Features" },
            { id: "tools", name: "Tools" },
            { id: "stats", name: "Statistics" },
            { id: "testimonials", name: "Testimonials" },
            { id: "faq", name: "FAQ" }
          ]}
        />

        {/* Header with navigation */}
        <Header />

        {/* Main content */}
        <main>
          <section id="hero">
            <HeroSection />
          </section>

          <section id="features">
            <FeatureSection />
          </section>

          <section id="parallax">
            <ParallaxSection />
          </section>

          <section id="tools">
            <ToolPreviewsCarousel />
          </section>

          <section id="stats">
            <StatsSection />
          </section>

          <section id="testimonials">
            <TestimonialsSection />
          </section>

          <section id="faq">
            {/* <FAQSection /> */}
          </section>
        </main>

        {/* <Footer /> */}
      </div>
      <CTASection/>
      <DonationSection/>
    </ThemeProvider>

  );
}