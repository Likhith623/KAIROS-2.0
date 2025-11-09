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
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -300, opacity: 0 }}
      transition={{ type: 'spring', damping: 20, stiffness: 100 }}
      className="fixed left-6 top-1/2 -translate-y-1/2 z-[110] w-80"
    >
      <div className="h-[80vh] max-h-[700px] bg-white/10 backdrop-blur-2xl border border-white/20 shadow-2xl rounded-3xl flex flex-col overflow-hidden">
        {/* Minimal Header */}
        <div className="relative">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400"></div>
          
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <span className="text-xl">🤖</span>
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm">AI Assistant</h3>
                {detectedObject && (
                  <p className="text-purple-300 text-xs">{detectedObject}</p>
                )}
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={clearChat}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </motion.button>
          </div>
        </div>

        {/* Messages - Clean & Simple */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <AnimatePresence mode="popLayout">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    message.role === 'user'
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                      : 'bg-white/10 backdrop-blur-xl text-white border border-white/10'
                  }`}
                >
                  <div className="text-sm leading-relaxed whitespace-pre-wrap">
                    {message.content.split('\n').map((line, idx) => {
                      if (line.startsWith('**') && line.endsWith('**')) {
                        return <p key={idx} className="font-bold mb-1">{line.replace(/\*\*/g, '')}</p>;
                      }
                      if (line.trim().startsWith('•') || /^\d+\./.test(line.trim())) {
                        return <p key={idx} className="ml-2 mb-0.5 text-sm opacity-90">{line}</p>;
                      }
                      return line ? <p key={idx} className="mb-1">{line}</p> : <br key={idx} />;
                    })}
                  </div>
                  <p className="text-xs opacity-50 mt-1 text-right">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl px-4 py-3 border border-white/10">
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
                      className="w-2 h-2 bg-purple-400 rounded-full"
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Clean Input */}
        <div className="p-4 border-t border-white/10 bg-white/5">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask anything..."
              disabled={isLoading}
              className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              className="bg-gradient-to-r from-blue-500 to-purple-600 disabled:from-gray-600 disabled:to-gray-700 text-white rounded-xl px-5 py-2.5 font-medium transition-all disabled:cursor-not-allowed"
            >
              ➤
            </motion.button>
          </div>
          <p className="text-xs text-gray-400 mt-2 text-center">Powered by Gemini AI</p>
        </div>
      </div>
    </motion.div>
  );
}
