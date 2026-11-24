// ParallaxSection.tsx
"use client"

import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const ParallaxSection = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -300]);

  const benefits = [
    {
      title: "All-in-One Solution",
      description: "Access multiple AI tools in a single platform, saving time and simplifying your workflow.",
      y: y1
    },
    {
      title: "Seamless Experience",
      description: "Enjoy a cohesive interface designed for intuitive navigation between different AI capabilities.",
      y: y2
    },
    {
      title: "Constantly Evolving",
      description: "Our platform regularly updates with new tools and improvements based on user feedback.",
      y: y3
    }
  ];

  return (
    <section ref={ref} className="min-h-screen py-24 px-4 relative overflow-hidden flex items-center">
      {/* Animated stars background */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#071a12] to-[#0d2b1a]">
        <div className="stars"></div>
        <div className="stars2"></div>
      </div>

      <div className="container mx-auto max-w-6xl z-10 relative">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
            Why Choose <span className="bg-gradient-to-r from-teal-400 to-amber-400 bg-clip-text text-transparent">BrainyBox</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Experience the advantages of our comprehensive AI platform
          </p>
        </motion.div>

        <div className="flex flex-col space-y-24 md:space-y-32">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              style={{ y: benefit.y }}
              className="bg-gradient-to-r from-teal-900/30 to-emerald-900/30 backdrop-blur-sm p-8 md:p-12 rounded-xl border border-teal-500/20 shadow-lg max-w-3xl mx-auto"
            >
              <h3 className="text-2xl md:text-3xl font-semibold text-white mb-4">
                {benefit.title}
              </h3>
              <p className="text-xl text-gray-300">
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ParallaxSection;