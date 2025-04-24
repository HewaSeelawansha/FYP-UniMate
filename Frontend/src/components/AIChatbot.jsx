import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaRobot, FaTimes, FaPaperPlane, FaSpinner } from 'react-icons/fa';
import { GoogleGenerativeAI } from '@google/generative-ai';

const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const gemini_key = import.meta.env.VITE_GEMINI_API_KEY;

  // Initialize Gemini API
  const genAI = new GoogleGenerativeAI(gemini_key);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      text: input,
      sender: 'user'
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Get the Gemini model
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

      // Create context for the AI
      const context = `You are a helpful assistant specialized in helping students find boarding houses near NSBM Green University Sri Lanka. 
      The user is looking for accommodation for their academic life. Be friendly and concise.
      Guide them to choose better home. Focus on:
      - Finding boardings with needed amenities
      - Lower distance from the university
      - Suggesting to sort boardings by distance
      - Recommending to check pictures and reviews
      - Using the platform's chat system to contact owners
      Keep answers short and practical. Don't ask too many questions.
      Current conversation: ${messages.slice(-5).map(m => `${m.sender}: ${m.text}`).join('\n')}`;

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

  return (
    <>
      {/* Floating Chat Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-lg z-50 hover:bg-green-600 transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Open AI Chat"
      >
        <FaRobot className="text-xl" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed right-6 bottom-24 z-50"
          >
            <motion.div 
              className="bg-white rounded-xl shadow-xl flex flex-col w-80 h-96"
              layout
            >
              {/* Chat Header */}
              <div className="bg-green-500 text-white p-3 rounded-t-xl flex justify-between items-center">
                <div className="flex items-center">
                  <FaRobot className="mr-2" />
                  <h3 className="font-medium">Academic Housing Assistant</h3>
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:text-green-100 transition-colors"
                >
                  <FaTimes />
                </button>
              </div>

              {/* Messages Container */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.length === 0 ? (
                  <div className="text-center text-gray-500 h-full flex flex-col items-center justify-center">
                    <FaRobot className="text-4xl mb-2 text-gray-300" />
                    <p>How can I help you find the perfect boarding house?</p>
                  </div>
                ) : (
                  messages.map(message => (
                    <div 
                      key={message.id}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div 
                        className={`max-w-xs rounded-lg px-4 py-2 ${message.sender === 'user' 
                          ? 'bg-green-500 text-white rounded-br-none' 
                          : 'bg-gray-100 text-gray-800 rounded-bl-none'}`}
                      >
                        {message.text}
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 text-gray-800 rounded-lg rounded-bl-none px-4 py-2">
                      <FaSpinner className="animate-spin" />
                    </div>
                  </div>
                )}
              </div>

              {/* Input Form */}
              <form onSubmit={handleSubmit} className="border-t p-3">
                <div className="flex">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 border border-gray-300 rounded-l-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-green-500"
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || isLoading}
                    className="bg-green-500 text-white px-4 py-2 rounded-r-lg hover:bg-green-600 disabled:bg-gray-300 transition-colors"
                  >
                    <FaPaperPlane />
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