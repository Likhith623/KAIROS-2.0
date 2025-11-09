'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ObjectChatbotProps {
  detectedObject: string | null;
  objectInfo?: any;
}

export default function ObjectChatbot({ detectedObject, objectInfo }: ObjectChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-generate object information when object is detected
  useEffect(() => {
    if (detectedObject && messages.length === 0) {
      // Add welcome message for detected object
      const welcomeMsg: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `🔬 **Object Detected: ${detectedObject}**\n\nGenerating comprehensive educational information...`,
        timestamp: new Date(),
      };
      setMessages([welcomeMsg]);

      // Auto-generate information
      generateObjectInfo(detectedObject);
    } else if (!detectedObject && messages.length === 0) {
      // Initial welcome message (no object detected yet)
      const initialMsg: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `👋 **Welcome to KAIROS 2.0 AI Assistant!**\n\n🎓 **I'm your intelligent educational companion powered by Gemini AI.**\n\n**I can help you with:**\n• 📸 Analyzing scanned objects\n• 🔬 Explaining scientific concepts\n• 📐 Solving math problems\n• 🧪 Understanding chemistry\n• ⚡ Physics questions\n• 🌱 Biology topics\n• 💡 Any educational question!\n\n**To scan objects:**\n1. Tap the 🔍 button to start scanning\n2. Point camera at any object\n3. Tap "Analyze with AI" 🤖\n\n**Or just ask me anything!**\nExample: "Explain photosynthesis" or "What is Newton's second law?"\n\nReady to learn? Let's explore! 🚀`,
        timestamp: new Date(),
      };
      setMessages([initialMsg]);
    }
  }, [detectedObject]);

  // Clear and reset messages when object changes
  useEffect(() => {
    if (detectedObject) {
      setMessages([]);
    }
  }, [detectedObject]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const generateObjectInfo = async (objectName: string) => {
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/extract-concepts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          object_class: objectName,
          confidence: 0.9,
          context: 'educational',
        }),
      });

      if (!response.ok) throw new Error('Failed to fetch object info');

      const data = await response.json();

      let infoText = `**${objectName.charAt(0).toUpperCase() + objectName.slice(1)} - Educational Overview**\n\n`;

      if (data.web_info) {
        infoText += `📖 ${data.web_info.description}\n\n`;
        
        if (data.web_info.key_facts && data.web_info.key_facts.length > 0) {
          infoText += `**Key Facts:**\n`;
          data.web_info.key_facts.forEach((fact: string, idx: number) => {
            infoText += `${idx + 1}. ${fact}\n`;
          });
          infoText += `\n`;
        }

        if (data.web_info.scientific_principles && data.web_info.scientific_principles.length > 0) {
          infoText += `**Scientific Principles:**\n`;
          data.web_info.scientific_principles.forEach((principle: string) => {
            infoText += `• ${principle}\n`;
          });
          infoText += `\n`;
        }

        if (data.web_info.fun_fact) {
          infoText += `💡 **Fun Fact:** ${data.web_info.fun_fact}\n`;
        }
      }

      if (data.concepts && data.concepts.length > 0) {
        infoText += `\n**Related Concepts:**\n`;
        data.concepts.forEach((concept: any) => {
          infoText += `• ${concept.name} (${concept.category})\n`;
        });
      }

      const infoMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: infoText,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, infoMsg]);
    } catch (error) {
      console.error('Error fetching object info:', error);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `I couldn't fetch detailed information right now, but feel free to ask me questions about ${objectName}!`,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Call Gemini API through backend
      const response = await fetch('http://localhost:8000/api/chat-query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: inputValue.trim(),
          context: detectedObject,
          conversation_history: messages.slice(-5), // Last 5 messages for context
        }),
      });

      let aiResponse = '';

      if (response.ok) {
        const data = await response.json();
        aiResponse = data.response || 'I received your question but couldn\'t generate a response.';
      } else {
        // Fallback response if API fails
        aiResponse = `I understand you're asking about "${inputValue.trim()}" related to ${detectedObject}. While I can't connect to the AI right now, I can help you explore scientific concepts through the KAIROS platform!`;
      }

      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I apologize, but I\'m having trouble connecting right now. Please try again!',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const clearChat = () => {
    setMessages([]);
    if (detectedObject) {
      const welcomeMsg: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `🔬 **Object Detected: ${detectedObject}**\n\nChat cleared. Ask me anything about ${detectedObject} or any other topic!`,
        timestamp: new Date(),
      };
      setMessages([welcomeMsg]);
    } else {
      const initialMsg: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `👋 **Welcome to KAIROS 2.0 AI Assistant!**\n\n🎓 **I'm your intelligent educational companion powered by Gemini AI.**\n\n**I can help you with:**\n• 📸 Analyzing scanned objects\n• 🔬 Explaining scientific concepts\n• 📐 Solving math problems\n• 🧪 Understanding chemistry\n• ⚡ Physics questions\n• 🌱 Biology topics\n• 💡 Any educational question!\n\n**To scan objects:**\n1. Tap the 🔍 button to start scanning\n2. Point camera at any object\n3. Tap "Analyze with AI" 🤖\n\n**Or just ask me anything!**\nExample: "Explain photosynthesis" or "What is Newton's second law?"\n\nReady to learn? Let's explore! 🚀`,
        timestamp: new Date(),
      };
      setMessages([initialMsg]);
    }
  };

  return (
    <motion.div
      initial={{ x: -400, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -400, opacity: 0 }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className={`absolute left-0 top-0 bottom-0 z-40 ${isExpanded ? 'w-96' : 'w-16'} transition-all duration-300`}
    >
      <div className="h-full bg-gradient-to-b from-slate-900/98 via-slate-800/98 to-slate-900/98 backdrop-blur-2xl border-r border-purple-500/20 shadow-2xl flex flex-col">
        {/* Header with gradient accent */}
        <div className="relative">
          {/* Animated gradient bar */}
          <motion.div
            className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'linear',
            }}
            style={{
              backgroundSize: '200% 100%',
            }}
          />
          
          <div className="flex items-center justify-between p-4 border-b border-white/10 bg-gradient-to-r from-purple-900/30 to-blue-900/30">
            {isExpanded && (
              <>
                <div className="flex items-center gap-3">
                  <motion.span 
                    className="text-3xl"
                    animate={{
                      rotate: [0, 10, -10, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  >
                    🤖
                  </motion.span>
                  <div>
                    <h3 className="text-white font-bold text-lg bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                      KAIROS AI Assistant
                    </h3>
                    {detectedObject ? (
                      <motion.p 
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-xs text-purple-300 font-semibold"
                      >
                        📌 {detectedObject}
                      </motion.p>
                    ) : (
                      <p className="text-xs text-gray-400">Ask me anything educational!</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={clearChat}
                    className="text-gray-400 hover:text-white p-2 rounded-lg transition-colors bg-white/5 hover:bg-white/10"
                    title="Clear chat"
                  >
                    <span className="text-lg">🗑️</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={toggleExpand}
                    className="text-gray-400 hover:text-white p-2 rounded-lg transition-colors bg-white/5 hover:bg-white/10"
                    title="Collapse"
                  >
                    <span className="text-lg">◀</span>
                  </motion.button>
                </div>
              </>
            )}
            {!isExpanded && (
              <motion.button
                whileHover={{ scale: 1.2, rotate: 15 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleExpand}
                className="mx-auto text-3xl hover:scale-110 transition-transform p-2 rounded-full bg-gradient-to-r from-purple-600 to-blue-600"
                title="Expand AI Assistant"
              >
                💬
              </motion.button>
            )}
          </div>
        </div>

        {/* Messages */}
        {isExpanded && (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-purple-500/50 scrollbar-track-transparent">
              <AnimatePresence>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-5 py-3 shadow-lg ${
                        message.role === 'user'
                          ? 'bg-gradient-to-br from-blue-500 via-purple-600 to-pink-600 text-white'
                          : 'bg-gradient-to-br from-slate-700/90 to-slate-800/90 text-white border border-purple-500/30 backdrop-blur-xl'
                      }`}
                    >
                      <div className="text-sm whitespace-pre-wrap break-words leading-relaxed">
                        {message.content.split('\n').map((line, idx) => {
                          // Handle bold text
                          if (line.startsWith('**') && line.endsWith('**')) {
                            return (
                              <p key={idx} className="font-bold text-base mb-2 mt-2">
                                {line.replace(/\*\*/g, '')}
                              </p>
                            );
                          }
                          // Handle bullet points
                          if (line.trim().startsWith('•') || /^\d+\./.test(line.trim())) {
                            return (
                              <p key={idx} className="ml-3 mb-1.5 flex items-start gap-2">
                                <span className="text-purple-300 font-bold">→</span>
                                <span>{line.replace(/^[•\d+\.]/, '').trim()}</span>
                              </p>
                            );
                          }
                          // Handle emoji lines
                          if (line.trim().startsWith('📖') || line.trim().startsWith('💡')) {
                            return (
                              <p key={idx} className="mb-2 mt-2 bg-white/10 rounded-lg p-2 border-l-4 border-purple-400">
                                {line}
                              </p>
                            );
                          }
                          return line ? <p key={idx} className="mb-1.5">{line}</p> : <br key={idx} />;
                        })}
                      </div>
                      <p className="text-xs opacity-60 mt-2 text-right">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-gradient-to-br from-slate-700/90 to-slate-800/90 rounded-2xl px-5 py-4 border border-purple-500/30 backdrop-blur-xl shadow-lg">
                    <div className="flex items-center gap-3">
                      <div className="flex gap-1.5">
                        {[0, 1, 2].map((i) => (
                          <motion.div
                            key={i}
                            animate={{
                              scale: [1, 1.5, 1],
                              opacity: [0.3, 1, 0.3],
                            }}
                            transition={{
                              duration: 1.2,
                              repeat: Infinity,
                              delay: i * 0.2,
                              ease: 'easeInOut',
                            }}
                            className="w-2.5 h-2.5 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full"
                          />
                        ))}
                      </div>
                      <span className="text-sm text-purple-200 font-medium">Gemini AI is thinking...</span>
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Section - Enhanced */}
            <div className="p-4 border-t border-purple-500/20 bg-gradient-to-r from-slate-900/50 to-slate-800/50 backdrop-blur-xl">
              <div className="flex items-end gap-3">
                <div className="flex-1 relative">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={detectedObject ? `Ask about ${detectedObject} or anything else...` : 'Ask me anything: math, physics, chemistry, biology...'}
                    disabled={isLoading}
                    className="w-full bg-slate-800/80 border-2 border-purple-500/30 rounded-2xl px-5 py-3.5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50 text-sm shadow-lg transition-all backdrop-blur-sm"
                  />
                  {/* Animated border glow */}
                  <motion.div
                    className="absolute inset-0 rounded-2xl pointer-events-none"
                    animate={{
                      boxShadow: [
                        '0 0 0px rgba(168, 85, 247, 0)',
                        '0 0 20px rgba(168, 85, 247, 0.4)',
                        '0 0 0px rgba(168, 85, 247, 0)',
                      ],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isLoading}
                  className="bg-gradient-to-r from-blue-500 via-purple-600 to-pink-600 hover:from-blue-600 hover:via-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white rounded-2xl px-6 py-3.5 font-bold transition-all shadow-lg hover:shadow-purple-500/50 disabled:shadow-none"
                >
                  <span className="text-lg">➤</span>
                </motion.button>
              </div>
              <div className="flex items-center justify-between mt-3 px-1">
                <p className="text-xs text-gray-500">
                  <span className="text-purple-400 font-semibold">Enter</span> to send • <span className="text-purple-400 font-semibold">Shift+Enter</span> for new line
                </p>
                <motion.div
                  className="flex items-center gap-1 text-xs text-gray-500"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span>Gemini AI Active</span>
                </motion.div>
              </div>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}
