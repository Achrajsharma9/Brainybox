"use client"

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function SongRecommender() {
  const [songName, setSongName] = useState('');
  const [recommendations, setRecommendations] = useState<null | {
    playlistName: string;
    description: string;
    songs: string[];
  }>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const router = useRouter();

  // Simulated loading progress
  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 95) {
            clearInterval(interval);
            return prev;
          }
          return prev + Math.random() * 15;
        });
      }, 300);
      
      return () => {
        clearInterval(interval);
        setProgress(0);
      };
    }
  }, [loading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('/api/music', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ songName }),
      });

      if (!response.ok) {
        throw new Error('Failed to get recommendations');
      }

      const data = await response.json();
      setRecommendations(data.recommendations);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.push('/tools')
  }

  const handleDelete = () => {
    setSongName('');
    setRecommendations(null);
  };

  return (
    <main className="min-h-screen w-full relative text-white bg-gradient-to-b from-black via-purple-950 to-black">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-full h-full opacity-20">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-cyan-500 rounded-full mix-blend-screen filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600 rounded-full mix-blend-screen filter blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/3 left-1/2 w-72 h-72 bg-fuchsia-500 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-pulse delay-2000"></div>
        </div>
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiMzMjM2NDgiIGQ9Ik0wIDBoNjB2NjBIMHoiLz48cGF0aCBkPSJNNjAgMEgwdjYwaDYwVjB6TTMwIDMwaDMwdjMwSDMwVjMwem0wLTMwaDMwdjMwSDMwVjB6TTAgMGgzMHYzMEgwVjB6bTAgMzBoMzB2MzBIMFYzMHoiIHN0cm9rZT0icmdiYSgxMzQsIDEzNCwgMjU1LCAwLjAzKSIgc3Ryb2tlLXdpZHRoPSIuNSIvPjwvZz48L3N2Zz4=')] opacity-30"></div>
        
        {/* Hexagon pattern */}
        <div className="absolute inset-0 opacity-10">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-24 h-24 border border-cyan-500/30"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                transform: 'rotate(45deg)',
              }}
              animate={{
                opacity: [0.2, 0.5, 0.2],
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 3 + Math.random() * 5,
                repeat: Infinity,
                delay: Math.random() * 5,
              }}
            />
          ))}
        </div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Header with futuristic elements */}
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
          <div className="mb-12 text-center relative">
            <div className="inline-block relative">
              <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-500 to-fuchsia-400 mb-2">
                SONIC<span className="text-white">VERSE</span>
              </h1>
              <div className="absolute -bottom-2 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent"></div>
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <p className="text-center max-w-2xl mx-auto mt-6 text-lg text-gray-300 font-light">
                Discover your next favorite tracks through our decentralized music recommendation algorithm
              </p>
              
              {/* Tech stats bar */}
              <div className="flex justify-center items-center mt-4 space-x-8 text-xs text-gray-400 font-mono">
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></div>
                  <span>ALGORITHM V2.7</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-cyan-500 mr-2"></div>
                  <span>NODES: 256</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-purple-500 mr-2"></div>
                  <span>HASH RATE: 97.3TH/s</span>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="space-y-8">
            {/* Current selection panel */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="relative"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl blur opacity-30"></div>
              <div className="bg-gray-900/90 backdrop-blur-md rounded-lg p-5 relative">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center mr-3">
                      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-xs text-cyan-400 uppercase tracking-wider font-mono mb-1">Current Track</div>
                      <span className="text-lg font-medium">{songName || "No track selected"}</span>
                    </div>
                  </div>
                  
                  {songName && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleDelete}
                      className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 transition-colors text-sm flex items-center"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Clear
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Search Input */}
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              onSubmit={handleSubmit}
              className="relative"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
              <div className="relative flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={songName}
                    onChange={(e) => setSongName(e.target.value)}
                    placeholder="Enter a track name to discover new sounds..."
                    className="w-full bg-gray-900/90 backdrop-blur-md text-white rounded-lg p-4 pl-12 outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all border border-gray-800"
                  />
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                    <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  type="submit"
                  disabled={!songName || loading}
                  className={`relative py-4 px-6 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-lg hover:shadow-lg hover:shadow-purple-600/20 transition-all whitespace-nowrap font-medium
                    ${(!songName || loading) ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  <span className="relative z-10 flex items-center justify-center">
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Generate Playlist
                      </>
                    )}
                  </span>
                </motion.button>
              </div>
            </motion.form>

            {/* Loading indicator */}
            <AnimatePresence>
              {loading && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="relative overflow-hidden"
                >
                  <div className="bg-gray-900/90 backdrop-blur-md rounded-lg p-6 border border-gray-800">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-purple-600/30 flex items-center justify-center mr-3">
                          <svg className="w-4 h-4 text-purple-400 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                        </div>
                        <div className="text-sm font-medium">Processing request</div>
                      </div>
                      <div className="text-xs text-gray-500 font-mono">{Math.round(progress)}%</div>
                    </div>
                    
                    <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                      <motion.div 
                        className="h-full bg-gradient-to-r from-cyan-500 to-purple-600"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    
                    <div className="mt-4 grid grid-cols-2 gap-4 text-xs text-gray-500">
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                        <span>Analyzing audio fingerprint</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                        <span>Scanning decentralized database</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-purple-500 mr-2"></div>
                        <span>Mapping neural connections</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-yellow-500 mr-2"></div>
                        <span>Consensus verification</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Recommendations Display */}
            <AnimatePresence>
              {recommendations && (
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.6 }}
                  className="relative"
                >
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-xl blur opacity-30"></div>
                  <div className="bg-gray-900/90 backdrop-blur-md rounded-lg p-8 relative border border-gray-800">
                    <div className="flex items-start mb-6 gap-4">
                      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-600 to-cyan-500 flex-shrink-0 flex items-center justify-center">
                        <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-400">{recommendations.playlistName}</h2>
                          <div className="bg-gray-800 px-3 py-1 rounded-full text-xs text-gray-400 font-mono">
                            {recommendations.songs.length} tracks
                          </div>
                        </div>
                        <p className="text-gray-400 mt-2 text-sm leading-relaxed">{recommendations.description}</p>
                      </div>
                    </div>
                    
                    <div className="grid gap-1">
                      {recommendations.songs.map((song, index) => (
                        <motion.div 
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          className="group flex items-center gap-4 p-3 hover:bg-gray-800/50 rounded-lg transition-colors"
                        >
                          <div className="w-8 h-8 flex-shrink-0 rounded-full bg-gray-800 flex items-center justify-center group-hover:bg-gradient-to-r group-hover:from-cyan-500 group-hover:to-purple-600 transition-colors">
                            <span className="text-sm font-medium">{index + 1}</span>
                          </div>
                          <span className="flex-1 text-gray-300 group-hover:text-white transition-colors">{song}</span>
                          <button className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-gray-700 rounded-full">
                            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                          </button>
                        </motion.div>
                      ))}
                    </div>
                    
                    <div className="mt-8 flex justify-center">
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className="py-2 px-6 bg-gray-800 border border-gray-700 rounded-full text-sm hover:bg-gray-700 transition-colors flex items-center"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                        Export to Playlist
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* Footer with blockchain-like stats */}
          <div className="mt-16 border-t border-gray-800 pt-6 flex justify-between items-center text-xs text-gray-500 font-mono">
            <div>SONICVERSE v2.4.1</div>
            <div className="flex items-center space-x-6">
              <div className="flex items-center">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5 animate-pulse"></div>
                <span>NETWORK: ACTIVE</span>
              </div>
              <div>BLOCKS: 4,293,121</div>
              <div>PING: 35ms</div>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}