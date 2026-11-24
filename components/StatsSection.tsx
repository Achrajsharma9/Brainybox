// StatsSection.tsx
"use client"

import React, { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { Users, Clock, BookPlus, MessageSquare } from 'lucide-react';

const StatCard = ({ icon: Icon, value, label, suffix = '', delay }: any) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  useEffect(() => {
    let interval: any;

    if (isInView) {
      const duration = 2000;
      const steps = 50;
      const stepTime = duration / steps;
      let currentStep = 0;

      interval = setInterval(() => {
        const progress = ++currentStep / steps;
        const easedProgress = easeOutQuart(progress);
        setCount(Math.floor(easedProgress * value));

        if (currentStep >= steps) {
          clearInterval(interval);
          setCount(value);
        }
      }, stepTime);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isInView, value]);

  const easeOutQuart = (x: any) => {
    return 1 - Math.pow(1 - x, 4);
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6, delay }}
      className="bg-gradient-to-br from-teal-900/30 to-emerald-900/30 backdrop-blur-sm p-6 rounded-xl border border-teal-500/20 shadow-lg flex flex-col items-center justify-center"
    >
      <div className="p-4 bg-teal-500/20 rounded-full mb-4">
        <Icon className="h-8 w-8 text-teal-400" />
      </div>
      <div className="text-4xl font-bold text-white mb-2">
        {count.toLocaleString()}{suffix}
      </div>
      <div className="text-gray-300 text-center">{label}</div>
    </motion.div>
  );
};

const StatsSection = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.1 });

  const stats = [
    {
      icon: Users,
      value: 50000,
      label: "Active Users",
      suffix: '+',
      delay: 0.1
    },
    {
      icon: Clock,
      value: 1500,
      label: "Hours Saved Weekly",
      suffix: '',
      delay: 0.2
    },
    {
      icon: BookPlus,
      value: 4,
      label: "AI Tools",
      suffix: '',
      delay: 0.3
    },
    {
      icon: MessageSquare,
      value: 2000000,
      label: "Conversations",
      suffix: '+',
      delay: 0.4
    }
  ];

  return (
    <section className="py-24 px-4 relative overflow-hidden" ref={sectionRef}>
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#071a12] via-[#0d2b1a] to-[#071a12] opacity-50"></div>

      <div className="container mx-auto max-w-6xl relative z-10">
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
            BrainyBox <span className="bg-gradient-to-r from-teal-400 to-amber-400 bg-clip-text text-transparent">by the Numbers</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            See the impact our platform is making
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <StatCard
              key={index}
              icon={stat.icon}
              value={stat.value}
              label={stat.label}
              suffix={stat.suffix}
              delay={stat.delay}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;