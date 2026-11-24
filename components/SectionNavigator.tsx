// SectionNavigator.tsx
"use client"

import React, { useState, useEffect } from 'react';
import { motion, MotionValue } from 'framer-motion';

const SectionNavigator = ({ sections }: any) => {
  const [activeSection, setActiveSection] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;

      const currentSection = sections.findIndex((section: { id: string; }, index: number) => {
        const sectionElement = document.getElementById(section.id);
        if (!sectionElement) return false;

        const sectionTop = sectionElement.offsetTop;
        const sectionHeight = sectionElement.offsetHeight;

        if (index === 0 && scrollPosition < windowHeight / 2) {
          return true;
        }

        return (
          scrollPosition >= sectionTop - windowHeight / 2 &&
          scrollPosition < sectionTop + sectionHeight - windowHeight / 2
        );
      });

      if (currentSection !== -1) {
        setActiveSection(currentSection);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [sections]);

  const handleDotClick = (index: string | number) => {
    const sectionElement = document.getElementById(sections[index].id);
    if (sectionElement) {
      window.scrollTo({
        top: sectionElement.offsetTop,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="fixed right-6 top-1/2 transform -translate-y-1/2 z-50">
      <div className="flex flex-col space-y-4">
        {sections.map((section: { id: React.Key | null | undefined; name: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | MotionValue<number> | MotionValue<string> | null | undefined; }, index: number) => (
          <motion.div
            key={section.id}
            className="flex items-center cursor-pointer group"
            onClick={() => handleDotClick(index)}
            whileHover={{ scale: 1.2 }}
          >
            <motion.div
              className={`w-3 h-3 rounded-full ${activeSection === index
                  ? 'bg-teal-400'
                  : 'bg-white/30 hover:bg-white/70'
                }`}
              animate={{
                scale: activeSection === index ? [1, 1.2, 1] : 1,
                transition: {
                  duration: 0.5,
                  repeat: activeSection === index ? Infinity : 0,
                  repeatType: "reverse"
                }
              }}
            />

            <div className="overflow-hidden">
              <motion.div
                className="pl-3 text-sm text-white font-medium opacity-0 group-hover:opacity-100 origin-left whitespace-nowrap"
                initial={{ width: 0, opacity: 0 }}
                whileHover={{ width: "auto", opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {section.name}
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SectionNavigator;