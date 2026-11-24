// FeatureSection.tsx
"use client"

import React, { useRef, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { Brain, Music, Film, Utensils } from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, description, delay }: any) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.3 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.5, delay }}
      className="bg-gradient-to-br from-teal-900/40 to-emerald-900/40 backdrop-blur-sm p-6 rounded-xl border border-teal-500/20 shadow-lg hover:shadow-teal-500/20 hover:scale-105 transition-all duration-300"
    >
      <div className="p-4 bg-teal-500/10 rounded-full w-fit mb-4">
        <Icon className="h-8 w-8 text-teal-400" />
      </div>
      <h3 className="text-xl font-semibold text-white mb-3">{title}</h3>
      <p className="text-gray-300">{description}</p>
    </motion.div>
  );
};

const FeatureSection = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.1 });

  const features = [
    {
      icon: Brain,
      title: "AI Conversation",
      description: "Engage with our advanced AI for natural, intelligent conversations on any topic.",
      delay: 0.1
    },
    {
      icon: Utensils,
      title: "Recipe Generator",
      description: "Get personalized recipe recommendations based on ingredients, dietary preferences, and more.",
      delay: 0.2
    },
    {
      icon: Music,
      title: "Music Recommender",
      description: "Discover new music tailored to your tastes, mood, and listening history.",
      delay: 0.3
    },
    {
      icon: Film,
      title: "Movie Suggestions",
      description: "Find your next favorite film with AI-powered recommendations based on your preferences.",
      delay: 0.4
    }
  ];

  return (
    <section className="py-24 px-4 relative overflow-hidden" ref={sectionRef}>
      {/* Animated background gradient */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-teal-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-emerald-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
            Powerful AI Tools <span className="bg-gradient-to-r from-teal-400 to-amber-400 bg-clip-text text-transparent">at Your Fingertips</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            BrainyBox brings together multiple AI capabilities in one seamless platform
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={feature.delay}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;