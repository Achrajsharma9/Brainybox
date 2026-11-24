// ToolPreviewsCarousel.tsx
"use client"

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Utensils, Music, Film, MessageSquare } from 'lucide-react';

const tools = [
  {
    id: 'recipe',
    name: 'Recipe Generator',
    icon: Utensils,
    color: 'from-green-400 to-emerald-600',
    description: 'Generate personalized recipes based on ingredients you have',
    preview: {
      input: 'chicken, spinach, tomatoes, garlic',
      output: 'Garlic Chicken with Spinach & Tomatoes:\n1. Season chicken with salt, pepper, and Italian herbs\n2. Sear chicken in olive oil until golden\n3. Add minced garlic and sauté\n4. Add cherry tomatoes, cook until blistered\n5. Wilt spinach and serve'
    }
  },
  {
    id: 'music',
    name: 'Music Recommender',
    icon: Music,
    color: 'from-purple-400 to-indigo-600',
    description: 'Get personalized music recommendations based on your taste',
    preview: {
      input: 'I like ambient electronic music with piano',
      output: 'Based on your preferences:\n1. "Divenire" by Ludovico Einaudi\n2. "Avril 14th" by Aphex Twin\n3. "Flim" by The Bad Plus\n4. "An Ending (Ascent)" by Brian Eno\n5. "Mercury Program" by Tycho'
    }
  },
  {
    id: 'movie',
    name: 'Movie Recommender',
    icon: Film,
    color: 'from-red-400 to-rose-600',
    description: 'Discover movies tailored to your preferences',
    preview: {
      input: 'sci-fi movies with philosophical themes',
      output: 'Recommended for you:\n1. "Blade Runner 2049" (2017)\n2. "Arrival" (2016)\n3. "Ex Machina" (2014)\n4. "Her" (2013)\n5. "Moon" (2009)'
    }
  },
  {
    id: 'conversation',
    name: 'AI Conversation',
    icon: MessageSquare,
    color: 'from-blue-400 to-cyan-600',
    description: 'Have engaging conversations with our AI assistant',
    preview: {
      input: 'Can you explain quantum computing in simple terms?',
      output: 'Quantum computing uses quantum bits or "qubits" that can exist in multiple states at once, unlike regular bits (0 or 1). This allows quantum computers to process complex problems much faster than traditional computers. Think of it like checking every path in a maze simultaneously instead of one at a time.'
    }
  }
];

const ToolPreview = ({ tool }: any) => {
  const Icon = tool.icon;

  return (
    <div className="bg-gradient-to-br from-teal-900/40 to-emerald-900/40 backdrop-blur-sm p-6 rounded-xl border border-teal-500/20 shadow-lg h-full flex flex-col">
      <div className="flex items-center mb-4">
        <div className={`p-3 rounded-lg bg-gradient-to-r ${tool.color} mr-4`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <h3 className="text-xl font-semibold text-white">{tool.name}</h3>
      </div>

      <p className="text-gray-300 mb-6">{tool.description}</p>

      <div className="mt-auto">
        <div className="bg-black/30 rounded-t-lg p-3 border-t border-x border-teal-500/20">
          <p className="text-gray-400 text-sm mb-2">Input:</p>
          <p className="text-gray-200">{tool.preview.input}</p>
        </div>

        <div className="bg-black/50 rounded-b-lg p-3 border-b border-x border-teal-500/20">
          <p className="text-gray-400 text-sm mb-2">Output:</p>
          <p className="text-gray-200 whitespace-pre-line">{tool.preview.output}</p>
        </div>
      </div>
    </div>
  );
};

const ToolPreviewsCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-scroll functionality
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setDirection(1);
      setCurrentIndex(prevIndex =>
        prevIndex === tools.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Reset interval on manual navigation
  const resetInterval = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        setDirection(1);
        setCurrentIndex(prevIndex =>
          prevIndex === tools.length - 1 ? 0 : prevIndex + 1
        );
      }, 5000);
    }
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex(prevIndex =>
      prevIndex === 0 ? tools.length - 1 : prevIndex - 1
    );
    resetInterval();
  };

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex(prevIndex =>
      prevIndex === tools.length - 1 ? 0 : prevIndex + 1
    );
    resetInterval();
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 500 : -500,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 500 : -500,
      opacity: 0
    })
  };

  return (
    <section className="py-24 px-4 relative overflow-hidden">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
            Experience Our <span className="bg-gradient-to-r from-teal-400 to-amber-400 bg-clip-text text-transparent">AI Tools</span> in Action
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            See how BrainyBox can transform your daily tasks
          </p>
        </div>

        <div className="relative">
          {/* Main carousel */}
          <div className="relative overflow-hidden rounded-xl h-[500px]">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30
                }}
                className="absolute w-full h-full"
              >
                <ToolPreview tool={tools[currentIndex]} />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation arrows */}
          <button
            onClick={handlePrev}
            className="absolute top-1/2 left-4 -translate-y-1/2 bg-white/10 hover:bg-white/20 rounded-full p-3 text-white z-10 backdrop-blur-sm border border-white/20 transition-all duration-200"
            aria-label="Previous tool"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          <button
            onClick={handleNext}
            className="absolute top-1/2 right-4 -translate-y-1/2 bg-white/10 hover:bg-white/20 rounded-full p-3 text-white z-10 backdrop-blur-sm border border-white/20 transition-all duration-200"
            aria-label="Next tool"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          {/* Indicator dots */}
          <div className="flex justify-center mt-6 space-x-2">
            {tools.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setDirection(index > currentIndex ? 1 : -1);
                  setCurrentIndex(index);
                  resetInterval();
                }}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentIndex
                  ? 'bg-teal-400 w-6'
                  : 'bg-white/30 hover:bg-white/50'
                  }`}
                aria-label={`Go to tool ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ToolPreviewsCarousel;