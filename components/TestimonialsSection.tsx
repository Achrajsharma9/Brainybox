// TestimonialsSection.tsx
"use client"

import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import Image from 'next/image';

const testimonials = [
  {
    name: "Alex Johnson",
    role: "Content Creator",
    quote: "BrainyBox has revolutionized my content creation workflow. The AI tools are intuitive and incredibly accurate.",
    avatar: "/alex.jpg"
  },
  {
    name: "Sarah Chen",
    role: "Food Blogger",
    quote: "The recipe generator is a game-changer for my food blog. It consistently provides creative and delicious recipes.",
    avatar: "/sarah.jpg"
  },
  {
    name: "Michael Scofield",
    role: "Film Critic",
    quote: "As a film critic, I'm impressed by the movie recommendations. They're spot on and have introduced me to hidden gems.",
    avatar: "/michael.webp"
  }
];

const Testimonial = ({ testimonial, index }: any) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.3 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.5, delay: index * 0.2 }}
      className="bg-gradient-to-br from-teal-900/20 to-emerald-900/20 backdrop-blur-sm p-6 rounded-xl border border-teal-500/20 shadow-lg"
    >
      <div className="flex items-center mb-4">
        <div className="relative w-12 h-12 rounded-full overflow-hidden mr-4">
          <Image
            src={testimonial.avatar}
            alt={testimonial.name}
            fill
            sizes="48px"
            className="object-cover"
            loading="lazy"
          />
        </div>
        <div>
          <h4 className="text-white font-medium">{testimonial.name}</h4>
          <p className="text-teal-300 text-sm">{testimonial.role}</p>
        </div>
      </div>
      <p className="text-gray-300 italic">"{testimonial.quote}"</p>
    </motion.div>
  );
};

const TestimonialsSection = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.1 });

  return (
    <section className="py-24 px-4 relative" ref={sectionRef}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto max-w-6xl"
      >
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
            What Our <span className="bg-gradient-to-r from-teal-400 to-amber-400 bg-clip-text text-transparent">Users</span> Say
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Discover how BrainyBox is transforming the way people interact with AI
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Testimonial
              key={index}
              testimonial={testimonial}
              index={index}
            />
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default TestimonialsSection;