"use client"

import { useState } from 'react';
import { Film, Search, Loader2, X, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function MovieRecommender() {
    const [movieName, setMovieName] = useState('');
    const [genre, setGenre] = useState('');
    const [useAdvancedAI, setUseAdvancedAI] = useState(false);
    const [recommendations, setRecommendations] = useState<null | {
        recommendations: string[];
        explanation: string;
    }>(null);
    const [loading, setLoading] = useState(false);
    const [usedGenerations, setUsedGenerations] = useState(0);
    const router = useRouter();

    const genres = [
        'Action', 'Adventure', 'Animation', 'Comedy', 'Crime',
        'Drama', 'Fantasy', 'Horror', 'Mystery', 'Romance',
        'Sci-Fi', 'Thriller'
    ];

    const handleBack = () => {
        router.push('/tools')
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        setLoading(true);
        try {
            const response = await fetch('/api/movies', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ movieName, genre, useAdvancedAI }),
            });

            if (!response.ok) {
                throw new Error('Failed to get recommendations');
            }

            const data = await response.json();
            setRecommendations(data);
            setUsedGenerations(prev => prev + 1);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleClear = () => {
        setMovieName('');
        setGenre('');
        setRecommendations(null);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#131320] to-[#1a1b26] py-12 px-4">
            <div className="max-w-3xl mx-auto">
                {/* Header Section */}
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
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center bg-purple-600 bg-opacity-20 p-3 rounded-full mb-4">
                        <Film size={32} className="text-purple-400" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Film<span className="text-purple-400">Finder</span>
                    </h1>
                    <p className="text-gray-400 text-lg max-w-xl mx-auto">
                        Discover your next favorite movies and TV shows with our AI-powered recommendation engine
                    </p>
                </div>

                {/* Main Card */}
                <div className="bg-[#1a1b26] rounded-xl shadow-2xl shadow-purple-900/10 border border-purple-900/20 overflow-hidden">
                    {/* Form Section */}
                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        {/* Movie Input */}
                        <div className="space-y-2">
                            <label className="text-gray-300 font-medium flex items-center gap-2">
                                <Search size={16} className="text-purple-400" />
                                What have you enjoyed watching?
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={movieName}
                                    onChange={(e) => setMovieName(e.target.value)}
                                    placeholder="Enter movie or TV show titles..."
                                    className="w-full p-4 pl-5 bg-[#2a2b36] rounded-lg text-white outline-none focus:ring-2 focus:ring-purple-500 transition-all placeholder:text-gray-500"
                                    required
                                />
                                {movieName && (
                                    <button 
                                        type="button"
                                        onClick={() => setMovieName('')}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                                    >
                                        <X size={16} />
                                    </button>
                                )}
                            </div>
                            <p className="text-xs text-gray-500">For better results, include multiple titles separated by commas</p>
                        </div>

                        {/* Genre Selection */}
                        <div className="space-y-3">
                            <label className="text-gray-300 font-medium">Preferred genre (optional)</label>
                            <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                                {genres.map(g => (
                                    <button
                                        key={g}
                                        type="button"
                                        onClick={() => setGenre(g === genre ? '' : g)}
                                        className={`py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                                            g === genre 
                                            ? 'bg-purple-600 text-white' 
                                            : 'bg-[#2a2b36] text-gray-300 hover:bg-[#3a3b46]'
                                        }`}
                                    >
                                        {g}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Advanced AI Toggle */}
                        <div className="flex items-center gap-3 p-4 bg-[#2a2b36] rounded-lg border border-purple-900/30">
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <Sparkles size={16} className="text-purple-400" />
                                    <span className="text-white font-medium">Enhanced recommendations</span>
                                    <span className="text-xs px-2 py-1 bg-purple-600 rounded-full text-white">Premium</span>
                                </div>
                                <p className="text-sm text-gray-400 mt-1">
                                    Get deeper insights and more personalized recommendations using our advanced AI model
                                </p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    className="sr-only peer" 
                                    checked={useAdvancedAI}
                                    onChange={() => setUseAdvancedAI(!useAdvancedAI)}
                                />
                                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-purple-800 rounded-full peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                            </label>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-4 pt-2">
                            <button
                                type="button"
                                onClick={handleClear}
                                className="px-4 py-3 bg-[#2a2b36] text-gray-300 rounded-lg hover:bg-[#3a3b46] transition-colors flex items-center gap-2 text-sm"
                            >
                                <X size={16} />
                                Clear
                            </button>

                            <button
                                type="submit"
                                disabled={loading || !movieName}
                                className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-lg hover:from-purple-700 hover:to-purple-600 transition-colors flex items-center justify-center gap-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 size={18} className="animate-spin" />
                                        Finding recommendations...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles size={18} />
                                        Find recommendations
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

                    {/* Results Section */}
                    {recommendations && (
                        <div className="border-t border-purple-900/20 bg-[#232438] p-6">
                            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                                <Film size={20} className="text-purple-400" />
                                Recommended for you
                            </h2>
                            
                            <div className="bg-[#1a1b26] p-4 rounded-lg mb-6">
                                <p className="text-gray-300 italic">{recommendations.explanation}</p>
                            </div>
                            
                            <div className="grid gap-3">
                                {recommendations.recommendations.map((movie, index) => (
                                    <div 
                                        key={index} 
                                        className="p-4 bg-[#2a2b36] rounded-lg text-white hover:bg-[#323340] transition-colors border border-purple-900/20 shadow-sm"
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="flex items-center justify-center bg-purple-600 bg-opacity-20 h-8 w-8 rounded-full text-purple-400 font-medium">
                                                {index + 1}
                                            </span>
                                            <span>{movie}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                
                {/* Footer */}
                <p className="text-gray-500 text-center text-sm mt-8">
                    All recommendations are AI-generated and may not reflect all available titles.
                </p>
            </div>
        </div>
    );
} 