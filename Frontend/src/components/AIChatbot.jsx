import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaRobot, FaTimes, FaPaperPlane, FaSpinner, FaRegLightbulb, FaRegCommentDots } from 'react-icons/fa';
import { HiOutlineLocationMarker, HiOutlineCurrencyDollar, HiOutlineHome, HiOutlineAcademicCap } from 'react-icons/hi';
import { GoogleGenerativeAI } from '@google/generative-ai';

const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [isBotButtonHovered, setIsBotButtonHovered] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const chatContainerRef = useRef(null);

  const gemini_key = import.meta.env.VITE_GEMINI_API_KEY;

  // Initialize Gemini API
  const genAI = new GoogleGenerativeAI(gemini_key);

  // Predefined suggestions
  const suggestions = [
    { 
      id: 1, 
      icon: <HiOutlineLocationMarker />, 
      text: "Boarding houses near NSBM",
      prompt: "What are the best boarding houses within 2km of NSBM campus?" 
    },
    { 
      id: 2, 
      icon: <HiOutlineCurrencyDollar />, 
      text: "Affordable options",
      prompt: "What are the most affordable boarding options for students with a budget of 15,000-20,000 LKR per month?" 
    },
    { 
      id: 3, 
      icon: <HiOutlineHome />, 
      text: "Required amenities", 
      prompt: "What essential amenities should I look for in a boarding house? I need WiFi and AC." 
    },
    { 
      id: 4, 
      icon: <HiOutlineAcademicCap />, 
      text: "Student-friendly places",
      prompt: "Which boarding houses are best for study-focused environments with good desk space and quiet areas?" 
    },
  ];

  // Scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  // Welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage = {
        id: Date.now(),
        text: "👋 Hi there! I'm UniMate, your NSBM boarding house assistant. How can I help you find the perfect accommodation near campus today?",
        sender: 'bot'
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, messages.length]);

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (chatContainerRef.current && !chatContainerRef.current.contains(event.target) && !event.target.closest('button[aria-label="Open AI Chat"]')) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      text: input,
      sender: 'user'
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setShowSuggestions(false);

    try {
      // Get the Gemini model
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

      // Create context for the AI
      const context = `You are UniMate AI Assistant, a specialized assistant for NSBM Green University students seeking boarding houses. 
      Your ONLY purpose is to help students find accommodation near campus. 

      STRICT RULES:
      1. ONLY answer questions about boarding houses, rentals, or student accommodation near NSBM
      2. For all other topics, respond: "I specialize only in boarding house queries near NSBM. Let's chat about accommodation."

      BOARDING HOUSE GUIDANCE:
      - Focus on practical advice about:
        * Finding places with required amenities (WiFi, AC, etc.)
        * Distance from NSBM (recommend under 5km)
        * Checking photos/reviews before deciding
        * Using our messaging system to contact owners
        * Rental prices in the area (LKR 15,000-35,000/month typical)

      RESPONSE STYLE:
      - Concise answers (1-3 sentences max)
      - Bullet points for multiple suggestions
      - Friendly but professional tone
      - Never suggest off-campus activities/services

      Current conversation context: ${messages.slice(-3).map(m => `${m.sender}: ${m.text}`).join('\n')}`;

      const prompt = `${context}\nUser: ${input}\nAssistant:`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: text,
        sender: 'bot'
      }]);
    } catch (error) {
      console.error('AI Error:', error);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: "Sorry, I'm having trouble connecting to the service. Please try again later.",
        sender: 'bot'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (prompt) => {
    setInput(prompt);
    handleSuggestion(prompt);
  };

  const handleSuggestion = async (suggestion) => {
    const userMessage = {
      id: Date.now(),
      text: suggestion,
      sender: 'user'
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setShowSuggestions(false);

    try {
      // Get the Gemini model
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

      // Create context for the AI
      const context = `You are UniMate AI Assistant, a specialized assistant for NSBM Green University students seeking boarding houses. 
      Your ONLY purpose is to help students find accommodation near campus. 

      STRICT RULES:
      1. ONLY answer questions about boarding houses, rentals, or student accommodation near NSBM
      2. For all other topics, respond: "I specialize only in boarding house queries near NSBM. Please ask about accommodation."

      BOARDING HOUSE GUIDANCE:
      - Focus on practical advice about:
        * Finding places with required amenities (WiFi, AC, etc.)
        * Distance from NSBM (recommend under 5km)
        * Checking photos/reviews before deciding
        * Using our messaging system to contact owners
        * Rental prices in the area (LKR 15,000-35,000/month typical)

      RESPONSE STYLE:
      - Concise answers (1-3 sentences max)
      - Bullet points for multiple suggestions
      - Friendly but professional tone
      - Never suggest off-campus activities/services

      Current conversation context: ${messages.slice(-3).map(m => `${m.sender}: ${m.text}`).join('\n')}`;

      const prompt = `${context}\nUser: ${suggestion}\nAssistant:`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: text,
        sender: 'bot'
      }]);
    } catch (error) {
      console.error('AI Error:', error);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: "Sorry, I'm having trouble connecting to the service. Please try again later.",
        sender: 'bot'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    setTimeout(() => {
      const welcomeMessage = {
        id: Date.now(),
        text: "👋 Hi there! I'm UniMate, your NSBM boarding house assistant. How can I help you find the perfect accommodation near campus today?",
        sender: 'bot'
      };
      setMessages([welcomeMessage]);
      setShowSuggestions(true);
    }, 300);
  };

  return (
    <>
      {/* Floating tooltip */}
      <AnimatePresence>
        {isBotButtonHovered && !isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="fixed bottom-20 right-6 bg-white text-gray-800 px-4 py-2 rounded-lg shadow-lg z-50"
          >
            Need help finding accommodation?
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Chat Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        onMouseEnter={() => setIsBotButtonHovered(true)}
        onMouseLeave={() => setIsBotButtonHovered(false)}
        className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-lg z-50 hover:bg-green-600 transition-all duration-300"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Open AI Chat"
      >
        <FaRobot className="text-xl xl:text-xl" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed right-6 bottom-24 z-50"
            ref={chatContainerRef}
          >
            <motion.div 
              className="bg-white rounded-xl shadow-2xl flex flex-col xl:w-[400px] xl:h-[600px] w-[350px] h-[500px] overflow-hidden"
              layout
            >
              {/* Chat Header */}
              <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-t-xl flex justify-between items-center">
                <div className="flex items-center">
                  <div className="bg-white/20 p-2 rounded-full mr-3">
                    <FaRobot className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium">UniMate Assistant</h3>
                    <p className="text-xs text-green-100">NSBM Housing Expert</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={clearChat}
                    className="text-white hover:text-green-200 transition-colors bg-white/10 hover:bg-white/20 p-1.5 rounded-full"
                    aria-label="Clear chat"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="text-white hover:text-green-200 transition-colors bg-white/10 hover:bg-white/20 p-1.5 rounded-full"
                    aria-label="Close chat"
                  >
                    <FaTimes className="text-sm" />
                  </button>
                </div>
              </div>

              {/* Messages Container */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                <AnimatePresence>
                  {messages.map(message => (
                    <motion.div 
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div 
                        className={`max-w-xs rounded-2xl px-4 py-2 ${message.sender === 'user' 
                          ? 'bg-green-500 text-white rounded-br-none shadow-md' 
                          : 'bg-white text-gray-800 rounded-bl-none border border-gray-200 shadow-sm'}`}
                      >
                        {message.text}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                <div ref={messagesEndRef} />

                {/* Loading indicator */}
                <AnimatePresence>
                  {isLoading && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex justify-start"
                    >
                      <div className="bg-white text-gray-800 rounded-2xl rounded-bl-none px-4 py-3 border border-gray-200 shadow-sm flex items-center space-x-2">
                        <FaSpinner className="animate-spin text-green-500" />
                        <span className="text-sm text-gray-500">Thinking...</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Suggestions */}
                <AnimatePresence>
                  {showSuggestions && messages.length <= 1 && !isLoading && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="mt-4"
                    >
                      <div className="flex items-center text-sm text-gray-500 mb-2">
                        <FaRegLightbulb className="mr-2 text-green-500" />
                        <span>Suggested questions:</span>
                      </div>
                      <div className="grid grid-cols-1 gap-2">
                        {suggestions.map(suggestion => (
                          <motion.button
                            key={suggestion.id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleSuggestionClick(suggestion.prompt)}
                            className="flex items-center bg-white border border-gray-200 hover:border-green-300 hover:bg-green-50 rounded-lg p-3 text-left transition-colors shadow-sm"
                          >
                            <span className="bg-green-100 text-green-600 p-2 rounded-full mr-3">
                              {suggestion.icon}
                            </span>
                            <span className="text-gray-700 text-sm font-medium">{suggestion.text}</span>
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Input Form */}
              <form onSubmit={handleSubmit} className="border-t bg-white p-3">
                <div className="flex relative">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 border border-gray-300 rounded-full pl-4 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || isLoading}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-green-500 text-white p-2 rounded-full hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    <FaPaperPlane className="text-sm" />
                  </button>
                </div>
                <div className="flex justify-center mt-2">
                  <button
                    type="button"
                    onClick={() => setShowSuggestions(!showSuggestions)}
                    className="text-xs text-gray-500 hover:text-green-600 flex items-center transition-colors"
                  >
                    <FaRegCommentDots className="mr-1" />
                    {showSuggestions ? 'Hide suggestions' : 'Show suggestions'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIChatbot;