"use client"

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Button } from "@/components/ui/Button";
import { ArrowRight } from "lucide-react";
import { useRouter } from 'next/navigation';

const CTASection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.3 });
  const router = useRouter();

  return (
    <section
      ref={ref}
      className="py-24 px-4 relative overflow-hidden"
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-tr from-teal-900/50 via-emerald-900/50 to-teal-900/50 bg-size-200 animate-gradient-xy"></div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.8 }}
        className="container mx-auto max-w-4xl text-center relative z-10 bg-black/30 backdrop-blur-lg p-12 rounded-2xl border border-white/10"
      >
        <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">
          Ready to <span className="bg-gradient-to-r from-teal-400 to-amber-400 bg-clip-text text-transparent">Experience</span> the Future?
        </h2>

        <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
          Start exploring our powerful AI tools and discover how BrainyBox can enhance your daily life.
        </p>

        <Button
          className="group relative px-10 py-6 text-xl font-medium transition-all duration-300 hover:shadow-2xl hover:shadow-teal-500/20 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white border-none"
          variant="default"
          onClick={() => router.push('/tools')}
        >
          Get Started Now
          <ArrowRight className="ml-2 h-6 w-6 transition-transform duration-200 group-hover:translate-x-1" />
        </Button>
      </motion.div>
    </section>
  );
};

export default CTASection;