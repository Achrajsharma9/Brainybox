"use client"

import { useState, FormEvent, KeyboardEvent, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface Recipe {
  name: string;
  ingredients: string[];
  instructions: string[];
}

interface Suggestion {
  matchedIngredients: string;
  name: string;
  description: string;
}

export default function Chef() {
  const [dishName, setDishName] = useState<string>('');
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  
  const [ingredients, setIngredients] = useState<string>('');
  const [ingredientList, setIngredientList] = useState<string[]>([]);
  const [currentIngredient, setCurrentIngredient] = useState<string>('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  
  const [loading, setLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [activeRecipe, setActiveRecipe] = useState<Recipe | null>(null);
  const [activeTab, setActiveTab] = useState<string>('dish');

  const [bgPosition, setBgPosition] = useState({ x: 0, y: 0 });
  const router = useRouter()
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      setBgPosition({ x, y });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleDishSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('/api/chef', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          ingredients: "chef's choice",
          dishName 
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      
      setRecipe(data.recipe);
      setActiveRecipe(data.recipe);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Failed to generate recipe:', error);
      setRecipe({ 
        name: 'Error', 
        ingredients: [], 
        instructions: ['An error occurred while generating the recipe. Please try again.'] 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddIngredient = () => {
    if (currentIngredient.trim() && !ingredientList.includes(currentIngredient.trim())) {
      setIngredientList([...ingredientList, currentIngredient.trim()]);
      setCurrentIngredient('');
    }
  };

  const handleRemoveIngredient = (index: number) => {
    const newList = [...ingredientList];
    newList.splice(index, 1);
    setIngredientList(newList);
  };

  const handleIngredientsSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (ingredientList.length === 0) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/chef/suggest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          ingredients: ingredientList.join(', ')
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      
      setSuggestions(data.suggestions);
    } catch (error) {
      console.error('Failed to get dish suggestions:', error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.push('/tools');
  };


  // Handle click on a suggested dish
  const handleSuggestionClick = async (dishName: string) => {
    setLoading(true);
    try {
      const response = await fetch('/api/chef', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          ingredients: ingredientList.join(', '),
          dishName 
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      
      setActiveRecipe(data.recipe);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Failed to generate recipe:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setIsModalOpen(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddIngredient();
    }
  };

  return (
    <div 
      className="min-h-screen flex flex-col justify-start items-center py-10 bg-gradient-to-br from-indigo-950 via-purple-950 to-black overflow-hidden"
      style={{
        backgroundPosition: `${bgPosition.x * 100}% ${bgPosition.y * 100}%`,
        transition: 'background-position 0.3s ease-out',
      }}
    >
      {/* Background elements */}
      <div className="absolute inset-0 w-full h-full">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/noise.png')] opacity-5"></div>
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-blue-500 filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/3 w-80 h-80 rounded-full bg-purple-600 filter blur-3xl opacity-20 animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 right-1/4 w-72 h-72 rounded-full bg-pink-500 filter blur-3xl opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Main content */}
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

      <motion.h1 
        className="text-6xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 relative z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        CuisineAI
      </motion.h1>
      
      <motion.p 
        className="text-xl text-blue-200 mb-10 text-center max-w-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        Next-gen recipe generation powered by blockchain technology
      </motion.p>

      <motion.div 
        className="w-full max-w-2xl relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        {/* Glass card */}
        <div className="backdrop-blur-xl bg-white/10 rounded-3xl shadow-xl border border-white/20 overflow-hidden">
          
          {/* Tab navigation */}
          <div className="flex w-full border-b border-white/20">
            <button 
              onClick={() => setActiveTab('dish')}
              className={`flex-1 py-4 text-center font-medium transition-colors duration-300 ${activeTab === 'dish' ? 'text-white border-b-2 border-cyan-400' : 'text-blue-200 hover:text-white'}`}
            >
              Search by Dish
            </button>
            <button 
              onClick={() => setActiveTab('ingredients')}
              className={`flex-1 py-4 text-center font-medium transition-colors duration-300 ${activeTab === 'ingredients' ? 'text-white border-b-2 border-cyan-400' : 'text-blue-200 hover:text-white'}`}
            >
              Search by Ingredients
            </button>
          </div>
          
          {/* Tab content */}
          <div className="p-6">
            {activeTab === 'dish' ? (
              <form onSubmit={handleDishSubmit}>
                <h2 className="text-2xl font-semibold text-white mb-6">What would you like to cook?</h2>
                
                <div className="group relative mb-8">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-400 to-purple-600 rounded-xl blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                  <input 
                    type="text"
                    value={dishName}
                    onChange={(e) => setDishName(e.target.value)}
                    placeholder="Enter dish name..."
                    className="relative w-full p-5 bg-black/30 backdrop-blur-sm border border-white/20 rounded-xl focus:outline-none focus:border-cyan-400 text-white placeholder-blue-200/70"
                  />
                </div>
                
                <motion.button 
                  type="submit"
                  className={`w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-medium rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 shadow-lg ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                  disabled={loading || !dishName.trim()}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      <span>Synthesizing recipe...</span>
                    </div>
                  ) : 'Generate Recipe'}
                </motion.button>
              </form>
            ) : (
              <>
                <h2 className="text-2xl font-semibold text-white mb-6">What ingredients do you have?</h2>
                
                <div className="group relative mb-2">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-400 to-purple-600 rounded-xl blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                  <div className="relative flex w-full">
                    <input 
                      type="text"
                      value={currentIngredient}
                      onChange={(e) => setCurrentIngredient(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Add an ingredient..."
                      className="flex-grow p-4 bg-black/30 backdrop-blur-sm border border-white/20 rounded-l-xl focus:outline-none focus:border-cyan-400 text-white placeholder-blue-200/70"
                    />
                    <button 
                      type="button"
                      onClick={handleAddIngredient}
                      className="px-6 bg-gradient-to-br from-green-400 to-cyan-500 text-white font-medium rounded-r-xl hover:from-green-500 hover:to-cyan-600 transition-all duration-300"
                    >
                      Add
                    </button>
                  </div>
                </div>
                
                {/* Ingredient Tags */}
                <div className="flex flex-wrap gap-2 mb-8 mt-4 min-h-12">
                  <AnimatePresence>
                    {ingredientList.map((ingredient, index) => (
                      <motion.div 
                        key={`${ingredient}-${index}`}
                        className="bg-white/10 backdrop-blur-sm border border-white/20 text-cyan-100 px-4 py-2 rounded-full flex items-center"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        whileHover={{ scale: 1.05 }}
                      >
                        {ingredient}
                        <button 
                          onClick={() => handleRemoveIngredient(index)} 
                          className="ml-2 text-cyan-300 hover:text-white"
                        >
                          ×
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
                
                {/* Submit Button */}
                <motion.button 
                  onClick={handleIngredientsSubmit}
                  className={`w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-medium rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 shadow-lg ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                  disabled={loading || ingredientList.length === 0}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      <span>Finding perfect matches...</span>
                    </div>
                  ) : 'Discover Possible Dishes'}
                </motion.button>
                
                {/* Suggestions Section */}
                <AnimatePresence>
                  {suggestions.length > 0 && (
                    <motion.div 
                      className="mt-8"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      transition={{ duration: 0.5 }}
                    >
                      <h3 className="text-xl font-semibold text-white mb-4">Suggested Creations</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {suggestions.map((suggestion, index) => (
                          <motion.button
                            key={index}
                            onClick={() => handleSuggestionClick(suggestion.name)}
                            className="bg-white/5 backdrop-blur-sm hover:bg-white/10 border border-white/10 hover:border-cyan-400/50 rounded-xl p-4 text-left transition-all duration-300 group"
                            whileHover={{ scale: 1.02, y: -2 }}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ 
                              opacity: 1, 
                              y: 0,
                              transition: { delay: index * 0.1 }
                            }}
                          >
                            <h4 className="font-medium text-white group-hover:text-cyan-300 transition-colors">{suggestion.name}</h4>
                            <p className="text-sm text-blue-200 mt-1 opacity-80">
                              {suggestion.description || `Using ${suggestion.matchedIngredients || 'your ingredients'}`}
                            </p>
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            )}
          </div>
        </div>
      </motion.div>

      {/* Recipe Modal */}
      <AnimatePresence>
        {isModalOpen && activeRecipe && (
          <motion.div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={handleModalClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-gradient-to-b from-gray-900 to-black border border-white/20 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
            >
              <div className="p-6 border-b border-white/10">
                <div className="flex justify-between items-center">
                  <motion.h2 
                    className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    {activeRecipe.name}
                  </motion.h2>
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/20 text-white/80 hover:text-white transition-colors"
                  >
                    ×
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <h3 className="text-lg font-semibold text-cyan-400 mb-3">Ingredients</h3>
                  <ul className="space-y-2 mb-6">
                    {activeRecipe.ingredients.map((ing, index) => (
                      <motion.li 
                        key={index} 
                        className="text-blue-100 flex items-center"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + index * 0.05 }}
                      >
                        <div className="w-2 h-2 rounded-full bg-cyan-400 mr-3"></div>
                        {ing}
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <h3 className="text-lg font-semibold text-cyan-400 mb-3">Instructions</h3>
                  <ol className="space-y-4">
                    {activeRecipe.instructions.map((instr, index) => (
                      <motion.li 
                        key={index} 
                        className="text-blue-100 ml-8 relative"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 + index * 0.08 }}
                      >
                        <span className="absolute -left-8 -top-1 flex items-center justify-center w-6 h-6 rounded-full bg-blue-900/60 border border-cyan-500/50 text-cyan-400 text-sm">
                          {index + 1}
                        </span>
                        {instr}
                      </motion.li>
                    ))}
                  </ol>
                </motion.div>
              </div>
              
              <div className="p-6 border-t border-white/10 flex justify-end">
                <motion.button 
                  className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsModalOpen(false)}
                >
                  Close
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}