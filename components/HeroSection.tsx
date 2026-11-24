// HeroSection.tsx
"use client"

import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/Button";
import { ArrowRight } from "lucide-react";
import { useRouter } from 'next/navigation';
import { motion } from "framer-motion";

const HeroSection = () => {
  const router = useRouter();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative h-screen mt-[-10vw] mb-[-7vw] flex flex-col items-center justify-center px-4 text-center overflow-hidden">
      {/* Background particles effect */}
      <div className="absolute inset-0 z-0">
        <div className="stars"></div>
        <div className="stars2"></div>
        <div className="stars3"></div>
      </div>

      {/* Hero content with parallax effect */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={{ transform: `translateY(${scrollY * 0.2}px)` }}
        className="z-10 max-w-6xl"
      >
        <h1 className="mb-6 text-3xl font-bold tracking-tight text-white sm:text-6xl">
          The Ultimate
          <span className="bg-gradient-to-r from-teal-400 to-amber-400 bg-clip-text text-transparent"> AI Experience </span>
          All In One Place
        </h1>

        <p className="mb-10 text-xl text-gray-300 max-w-3xl mx-auto">
          Access powerful AI tools for recipes, conversations, music recommendations,
          and movie suggestions - all under one roof.
        </p>

        <Button
          className="group relative px-8 py-6 text-lg font-medium transition-all duration-200 hover:shadow-2xl hover:shadow-white/20 bg-white text-black hover:bg-gray-100"
          variant="default"
          onClick={() => router.push('/tools')}
        >
          Explore Tools
          <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
        </Button>
      </motion.div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-[45vw] transform -translate-x-1/2 flex flex-col items-center text-white animate-bounce">
        <p className="text-sm mb-2">Scroll to explore</p>
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
        </svg>
      </div>
    </div>
  );
};

export default HeroSection;