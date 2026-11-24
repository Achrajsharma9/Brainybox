"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
}

export default function LLMChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showInitAnimation, setShowInitAnimation] = useState(true);
  const [sessionId, setSessionId] = useState<any>("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const router = useRouter();

  useEffect(() => {
    setSessionId(`session-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`);
  }, []);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    setTimeout(() => {
      setShowInitAnimation(false);
    }, 2000);
  }, []);

  const handleBack = () => {
    router.push('/tools');
  };

  const sendMessage = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!input.trim()) return;

    const newMessage: Message = {
      id: Date.now(),
      role: "user",
      content: input.trim(),
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/conversation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: input,
          sessionId: sessionId
        }),
      });

      if (!response.ok) throw new Error("Network response was not ok");

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      const aiResponse: Message = {
        id: Date.now() + 1,
        role: "assistant",
        content: data.message,
      };

      setMessages((prevMessages) => [...prevMessages, aiResponse]);
    } catch (error) {
      console.error("Failed to get AI response:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { 
          id: Date.now() + 2, 
          role: "assistant", 
          content: "System error. Neural connection interrupted. Please retry your query." 
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Format content with newlines
  const formatContent = (content: string) => {
    return content.split('\n').map((line, i) => (
      <span key={i}>
        {line}
        {i !== content.split('\n').length - 1 && <br />}
      </span>
    ));
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-b from-gray-900 to-black text-gray-100 overflow-hidden">
      {/* Initial animation */}
      <AnimatePresence>
        {showInitAnimation && (
          <motion.div 
            className="absolute inset-0 z-50 bg-black flex items-center justify-center"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="flex flex-col items-center"
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 2 }}
            >
              <svg className="w-16 h-16 text-cyan-500" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="64" cy="64" r="60" stroke="currentColor" strokeWidth="4" strokeOpacity="0.3" />
                <motion.path
                  d="M64 4 A 60 60 0 0 1 124 64"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5 }}
                />
              </svg>
              <motion.div 
                className="mt-4 text-cyan-500 font-mono text-lg tracking-widest"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                SYSTEM ONLINE
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="bg-black/90 border-b border-cyan-800/50 flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none">
              <path d="M12 17C14.2091 17 16 15.2091 16 13C16 10.7909 14.2091 9 12 9C9.79086 9 8 10.7909 8 13C8 15.2091 9.79086 17 12 17Z" fill="currentColor" fillOpacity="0.8" />
              <path d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z" stroke="currentColor" strokeWidth="2" />
              <path d="M12 7V5M17 12H19M12 19V17M5 12H7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <h1 className="font-bold text-white text-lg">NEURO<span className="text-cyan-500">CORE</span></h1>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center text-xs text-green-400 font-mono">
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1.5 animate-pulse"></span>
            <span>NEURAL LINK ACTIVE</span>
          </div>
          <button className="ml-4 p-2 rounded-full hover:bg-gray-800 transition-colors">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
          </button>
        </div>
      </div>
      {/* Back button */}
      <div className="w-full max-w-2xl flex justify-start px-6 mb-4 relative z-10">
                <motion.button
                  onClick={handleBack}
                  className="py-2 px-4 bg-black/30 backdrop-blur-sm border border-white/20 rounded-xl text-cyan-300 hover:text-white hover:border-cyan-400/50 transition-all duration-300 flex items-center group"
                  whileHover={{ scale: 1.05, x: -5 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 transform group-hover:translate-x-[-3px] transition-transform"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back to Tools
                </motion.button>
              </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-500">
            <div className="w-20 h-20 mb-6 rounded-full bg-gray-800/70 flex items-center justify-center">
              <svg className="w-10 h-10 text-cyan-500 opacity-70" viewBox="0 0 24 24" fill="none">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="1.5" />
                <path d="M8 12H16M12 8V16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <h2 className="text-xl font-mono mb-2 text-gray-400">NEUROCORE READY</h2>
            <p className="text-sm text-gray-500 max-w-md text-center">
              Enter your message below to begin neural interface communication.
            </p>
          </div>
        ) : (
          <div className="pb-32 pt-4">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`px-4 md:px-8 lg:px-16 py-6 ${
                  message.role === "assistant" ? "bg-gray-800/30" : "bg-transparent"
                } border-b border-gray-800/50`}
              >
                <div className="max-w-4xl mx-auto">
                  <div className="flex items-start">
                    <div className={`
                      flex-shrink-0 h-8 w-8 rounded-lg 
                      ${message.role === "assistant" 
                        ? "bg-gradient-to-br from-cyan-500 to-blue-600" 
                        : "bg-gradient-to-br from-purple-500 to-pink-600"
                      } flex items-center justify-center mr-4
                    `}>
                      {message.role === "assistant" ? (
                        <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none">
                          <path d="M12 17C14.2091 17 16 15.2091 16 13C16 10.7909 14.2091 9 12 9C9.79086 9 8 10.7909 8 13C8 15.2091 9.79086 17 12 17Z" fill="currentColor" />
                          <path d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z" stroke="currentColor" strokeWidth="1.5" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none">
                          <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" fill="currentColor" />
                          <path d="M12 14C7.58172 14 4 17.5817 4 22H20C20 17.5817 16.4183 14 12 14Z" fill="currentColor" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1 prose prose-invert prose-cyan max-w-none">
                      <p className="text-base leading-relaxed whitespace-pre-wrap">
                        {formatContent(message.content)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {loading && (
              <div className="px-4 md:px-8 lg:px-16 py-6 bg-gray-800/30 border-b border-gray-800/50">
                <div className="max-w-4xl mx-auto">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-8 w-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mr-4">
                      <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none">
                        <path d="M12 17C14.2091 17 16 15.2091 16 13C16 10.7909 14.2091 9 12 9C9.79086 9 8 10.7909 8 13C8 15.2091 9.79086 17 12 17Z" fill="currentColor" />
                        <path d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z" stroke="currentColor" strokeWidth="1.5" />
                      </svg>
                    </div>
                    <div className="flex space-x-2 mt-2">
                      <span className="h-2 w-2 bg-cyan-500 rounded-full animate-pulse"></span>
                      <span className="h-2 w-2 bg-cyan-500 rounded-full animate-pulse delay-300"></span>
                      <span className="h-2 w-2 bg-cyan-500 rounded-full animate-pulse delay-600"></span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        <div ref={messagesEndRef}></div>
      </div>

      {/* Input Area */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900 to-transparent pt-20 pb-6 pointer-events-none">
        <div className="max-w-4xl mx-auto px-4 pointer-events-auto">
          <form onSubmit={sendMessage} className="relative bg-gray-800/90 border border-gray-700/50 rounded-xl shadow-lg overflow-hidden backdrop-blur-sm">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage(e);
                }
              }}
              placeholder="Enter your query..."
              className="w-full bg-transparent text-gray-100 p-4 pr-20 outline-none resize-none max-h-40"
              rows={1}
            />
            <div className="absolute right-2 bottom-2">
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="p-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
              >
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none">
                  <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
            <div className="absolute left-3 bottom-2 flex items-center space-x-2 text-gray-400 text-xs">
              <div className="text-xs font-mono opacity-60">SHIFT+ENTER for new line</div>
            </div>
          </form>
          <div className="text-center text-xs text-gray-500 mt-2">
            <span className="inline-block px-2 py-1 bg-black/30 rounded-md backdrop-blur-sm">
              <span className="text-cyan-500">NEUROCORE</span> v.1.0.3 • Neural Interface Mode
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}