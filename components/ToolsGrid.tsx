"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight, Zap, Star, Users, Shield, LogOut, User } from "lucide-react";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface ToolStats {
  users: string;
  rating: number;
}

interface Tool {
  id: number;
  name: string;
  href: string;
  icon: string;
  description: string;
  features: string[];
  stats: ToolStats;
}

const tools: Tool[] = [
  {
    id: 1,
    name: "Conversation Assistant",
    href: "/tools/conversation",
    icon: "💬",
    description: "Engage in intelligent AI-powered conversations that adapt to your communication style.",
    features: [
      "Natural language understanding",
      "Context-aware responses",
      "Personalized conversation memory",
      "Multi-topic expertise"
    ],
    stats: { users: "24K", rating: 4.8 }
  },
  {
    id: 2,
    name: "AI Chef",
    href: "/tools/chef",
    icon: "🍳",
    description: "Your personal culinary assistant for recipes, meal planning, and cooking guidance.",
    features: [
      "Personalized recipe recommendations",
      "Dietary restriction handling",
      "Ingredient substitution suggestions",
      "Step-by-step cooking instructions"
    ],
    stats: { users: "18K", rating: 4.7 }
  },
  {
    id: 3,
    name: "Music Discovery",
    href: "/tools/music",
    icon: "🎵",
    description: "Discover new music and artists tailored to your unique taste and listening history.",
    features: [
      "Taste-based recommendations",
      "Mood and activity matching",
      "Genre exploration assistance",
      "Playlist generation"
    ],
    stats: { users: "31K", rating: 4.9 }
  },
  {
    id: 4,
    name: "Film Curator",
    href: "/tools/movies",
    icon: "🎬",
    description: "Find your next favorite films and shows with personalized recommendations.",
    features: [
      "Preference-based suggestions",
      "Hidden gem discovery",
      "Similar content matching",
      "Watch platform availability"
    ],
    stats: { users: "27K", rating: 4.6 }
  },
];

export default function ToolsSection() {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [showUserMenu, setShowUserMenu] = useState<boolean>(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });
  const { data: session, status } = useSession();
  const router = useRouter();

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleToolAccess = (toolHref: string) => {
    if (session) {
      router.push(toolHref);
    } else {
      signIn(undefined, { callbackUrl: toolHref });
    }
  };

  const handleSignOut = async () => {
    await signOut({ redirect: true, callbackUrl: '/' });
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
      setShowUserMenu(false);
    }
  };

  // Set up event listener for clicks outside user menu
  useEffect(() => {
    if (typeof window !== "undefined") {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, []);

  return (
    <div className="py-24 px-4 bg-gradient-to-b from-[#071a12] via-[#0d2b1a] to-[#071a12] relative overflow-hidden" ref={sectionRef}>
      {/* User Profile Section */}
      {status === "authenticated" && (
        <div className="absolute top-8 right-8 z-20">
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2 bg-teal-900/50 backdrop-blur-sm p-2 pr-4 rounded-full border border-teal-500/30 text-white"
            >
              {session.user?.image ? (
                <div className="w-8 h-8 rounded-full overflow-hidden relative">
                  <Image
                    src={session.user.image}
                    alt={session.user.name || "User"}
                    width={32}
                    height={32}
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
              )}
              <span className="text-sm font-medium">{session.user?.name || "User"}</span>
            </button>

            {/* User dropdown menu */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-teal-900/80 backdrop-blur-sm border border-teal-500/30 py-1 text-white">
                <div className="px-4 py-2 border-b border-teal-700/50">
                  <p className="text-sm font-medium truncate">{session.user?.name}</p>
                  <p className="text-xs text-teal-300 truncate">{session.user?.email}</p>
                </div>
                <Link href="/profile" className="block px-4 py-2 text-sm hover:bg-teal-800/50 transition-all">
                  Profile Settings
                </Link>
                <button
                  onClick={handleSignOut}
                  className="flex items-center w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-teal-800/50 transition-all"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Animated background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-2 h-2 rounded-full bg-teal-400 animate-ping opacity-75" style={{ animationDuration: "4s" }}></div>
        <div className="absolute top-2/3 right-1/4 w-2 h-2 rounded-full bg-amber-400 animate-ping opacity-75" style={{ animationDuration: "7s" }}></div>
        <div className="absolute bottom-1/4 left-1/4 w-2 h-2 rounded-full bg-emerald-400 animate-ping opacity-75" style={{ animationDuration: "5s" }}></div>
      </div>

      <div className="container mx-auto max-w-6xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Powerful <span className="bg-gradient-to-r from-teal-400 to-amber-400 bg-clip-text text-transparent">AI Tools</span> Suite
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Our advanced AI tools are designed to enhance your productivity, creativity, and decision-making.
            Each tool is built with cutting-edge technology to deliver exceptional results.
          </p>

          <div className="flex flex-wrap justify-center gap-6 mb-12">
            <div className="flex items-center bg-teal-900/30 backdrop-blur-sm px-4 py-3 rounded-full border border-teal-500/20">
              <Zap className="w-5 h-5 text-teal-400 mr-2" />
              <span className="text-gray-300">Built with advanced AI models</span>
            </div>
            <div className="flex items-center bg-teal-900/30 backdrop-blur-sm px-4 py-3 rounded-full border border-teal-500/20">
              <Shield className="w-5 h-5 text-teal-400 mr-2" />
              <span className="text-gray-300">Privacy-focused design</span>
            </div>
            <div className="flex items-center bg-teal-900/30 backdrop-blur-sm px-4 py-3 rounded-full border border-teal-500/20">
              <Users className="w-5 h-5 text-teal-400 mr-2" />
              <span className="text-gray-300">Used by 100K+ professionals</span>
            </div>
          </div>
        </motion.div>

        <div className="space-y-12">
          {tools.map((tool, index) => (
            <motion.div
              key={tool.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.7, delay: index * 0.1 }}
              className={`bg-gradient-to-br from-teal-900/30 to-emerald-900/30 backdrop-blur-sm rounded-2xl border border-teal-500/20 shadow-lg shadow-teal-500/10 overflow-hidden transition-all duration-500 ${expandedId === tool.id ? 'scale-102' : ''}`}
            >
              <div
                className="grid md:grid-cols-5 cursor-pointer"
                onClick={() => toggleExpand(tool.id)}
              >
                <div className="p-8 flex flex-col justify-center items-center md:items-start col-span-2">
                  <div className="flex items-center mb-4">
                    <span className="text-5xl mr-4">{tool.icon}</span>
                    <h3 className="text-2xl md:text-3xl font-bold text-white">{tool.name}</h3>
                  </div>
                  <p className="text-gray-300 mb-6 text-center md:text-left">
                    {tool.description}
                  </p>
                  <div className="flex space-x-4 text-sm">
                    <div className="flex items-center text-gray-300">
                      <Users className="w-4 h-4 text-teal-400 mr-2" />
                      <span>{tool.stats.users}+ users</span>
                    </div>
                    <div className="flex items-center text-gray-300">
                      <Star className="w-4 h-4 text-yellow-400 mr-2" />
                      <span>{tool.stats.rating}/5.0</span>
                    </div>
                  </div>
                </div>

                <div className="col-span-3 bg-teal-500/10 p-8">
                  <div className="mb-4">
                    <h4 className="text-lg font-medium text-teal-300 mb-3">Key Features</h4>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                      {tool.features.map((feature, i) => (
                        <li key={i} className="flex items-start text-gray-300">
                          <span className="text-teal-400 mr-2">•</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className={`overflow-hidden transition-all duration-500 ${expandedId === tool.id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="pt-4 border-t border-teal-500/20">
                      <h4 className="text-lg font-medium text-teal-300 mb-3">How it works</h4>
                      <p className="text-gray-300 mb-4">
                        Our {tool.name} tool uses advanced machine learning algorithms to analyze your preferences and provide highly personalized results. Simply input your requirements, and our AI will handle the rest.
                      </p>
                      <p className="text-gray-300">
                        The more you use the tool, the better it gets at understanding your specific needs and preferences, creating a truly customized experience.
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-between">
                    <button className="text-teal-300 flex items-center text-sm font-medium">
                      {expandedId === tool.id ? 'Show less' : 'Learn more'}
                      <svg
                        className={`ml-1 w-4 h-4 transition-transform duration-300 ${expandedId === tool.id ? 'rotate-180' : ''}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent triggering the parent onClick
                        handleToolAccess(tool.href);
                      }}
                      className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white text-sm font-medium transition-all duration-300"
                    >
                      Try {tool.name}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* <div className="mt-20 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">Ready to enhance your workflow?</h3>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Our AI tools are designed to work together seamlessly, providing a comprehensive solution for your needs.
          </p>
          {session ? (
            // <Link href="/dashboard" className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-400 hover:to-violet-400 text-white font-medium transition-all duration-300">
            //   Access Your Dashboard
            //   <ArrowRight className="w-5 h-5 ml-2" />
            // </Link>
            ''
          ) : (
            <button
              onClick={() => signIn(undefined, { callbackUrl: "/dashboard" })}
              className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-400 hover:to-violet-400 text-white font-medium transition-all duration-300"
            >
              Get Started with All Tools
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          )}
        </div> */}
      </div>
    </div>

  )
}