"use client";

import { getProviders, signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";

export default function SignIn() {
  const [providers, setProviders] = useState<any>(null);
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const [bgPosition, setBgPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const fetchProviders = async () => {
      const providersData = await getProviders();
      setProviders(providersData);
    };
    fetchProviders();
  }, []);

  // Handle mouse movement for interactive background
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      setBgPosition({ x, y });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  if (!providers) {
    return (
      <div className="flex justify-center items-center h-screen bg-black">
        <div className="relative">
          <div className="w-12 h-12 rounded-full border-t-2 border-b-2 border-cyan-500 animate-spin"></div>
          <div className="w-12 h-12 rounded-full border-r-2 border-l-2 border-purple-500 animate-spin absolute top-0 left-0" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
        </div>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div 
      className="flex flex-col items-center justify-center min-h-screen py-2 bg-gradient-to-b from-gray-950 via-indigo-950 to-black overflow-hidden"
      style={{
        backgroundPosition: `${bgPosition.x * 100}% ${bgPosition.y * 100}%`,
        transition: 'background-position 0.3s ease-out',
      }}
    >
      {/* Background elements */}
      <div className="absolute inset-0 w-full h-full">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/noise.png')] opacity-5"></div>
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-blue-500 filter blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-purple-600 filter blur-3xl opacity-10 animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>
      
      <motion.div 
        className="relative z-10 max-w-md w-full px-8 py-10 backdrop-blur-xl bg-black/30 rounded-2xl border border-white/10 shadow-2xl"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div 
          className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-2xl blur opacity-20"
          animate={{ 
            opacity: [0.2, 0.3, 0.2], 
            rotate: [0, 5, 0] 
          }}
          transition={{ 
            duration: 8, 
            ease: "easeInOut", 
            repeat: Infinity 
          }}
        />
        
        <motion.div 
          className="relative"
          variants={itemVariants}
        >
          <motion.h3 
            className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 mb-2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Welcome
          </motion.h3>
          
          <motion.p 
            className="text-center text-blue-200/80 mb-8"
            variants={itemVariants}
          >
            Sign in to unlock the Ultimate AI Experience
          </motion.p>
          
          <div className="space-y-5">
            {Object.values(providers).map((provider: any, index) => (
              <motion.div 
                key={provider.name} 
                className="group relative"
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full opacity-70 blur-sm group-hover:opacity-100 transition duration-200" />
                <button
                  onClick={() => signIn(provider.id, { callbackUrl })}
                  className="relative w-full px-6 py-3 rounded-full flex items-center justify-center overflow-hidden bg-black text-white font-medium z-10"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-800/50 to-purple-800/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="relative z-10 flex items-center">
                    <ProviderIcon name={provider.name} className="mr-3 w-5 h-5" />
                    Sign in with {provider.name}
                  </span>
                </button>
              </motion.div>
            ))}
          </div>
        </motion.div>
        
        <motion.div 
          className="mt-10 pt-6 border-t border-white/10 text-center text-blue-200/60 text-sm"
          variants={itemVariants}
        >
          By signing in, you agree to our Terms of Service and Privacy Policy
        </motion.div>
      </motion.div>
    </div>
  );
}

// Provider icon component
const ProviderIcon = ({ name, className }: { name: string, className?: string }) => {
  switch(name.toLowerCase()) {
    case 'google':
      return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
      );
    case 'github':
      return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 1.27a11 11 0 00-3.48 21.46c.55.09.73-.24.73-.53v-1.86c-3.03.66-3.67-1.46-3.67-1.46-.5-1.28-1.22-1.62-1.22-1.62-1-.68.07-.67.07-.67 1.1.08 1.68 1.13 1.68 1.13.98 1.68 2.57 1.19 3.2.91.1-.7.38-1.19.7-1.46-2.42-.28-4.96-1.21-4.96-5.4 0-1.19.42-2.17 1.12-2.93-.11-.28-.48-1.38.11-2.87 0 0 .92-.3 3 1.12a10.38 10.38 0 015.5 0c2.08-1.42 3-1.12 3-1.12.59 1.49.22 2.59.11 2.87.7.76 1.12 1.74 1.12 2.93 0 4.2-2.55 5.12-4.98 5.38.39.34.74 1 .74 2.02v3.01c0 .29.19.63.74.52A11 11 0 0012 1.27" />
        </svg>
      );
    case 'twitter':
      return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z" />
        </svg>
      );
    default:
      return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.72-2.32-1.64H8.04c.1 1.7 1.36 2.66 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77-.01-2.2-1.9-2.96-3.66-3.42z" />
        </svg>
      );
  }
};