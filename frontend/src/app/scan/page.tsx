'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CameraFeed from '@/components/CameraFeed';
import ObjectDetector from '@/components/ObjectDetector';
import { conceptAPI } from '@/lib/api/client';
import { useARStore } from '@/lib/stores/arStore';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { DetectedObject, ConceptResponse } from '@/types';

export default function ScanPage() {
  const [isScanning, setIsScanning] = useState(false);
  const [detectedObjects, setDetectedObjects] = useState<any[]>([]);
  const [currentObject, setCurrentObject] = useState<string | null>(null);
  const [concepts, setConcepts] = useState<ConceptResponse | null>(null);
  const [isLoadingConcepts, setIsLoadingConcepts] = useState(false);
  
  // Gemini Vision Analysis State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [capturedImageUrl, setCapturedImageUrl] = useState<string | null>(null);
  
  // Chat State
  const [messages, setMessages] = useState<any[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const router = useRouter();
  
  const { setEnabled, clearOverlays, setConcepts: setStoreConcepts } = useARStore();


  // Initialize welcome message
  useEffect(() => {
    const welcomeMsg = {
      id: Date.now().toString(),
      role: 'assistant',
      content: `👋 **Welcome to KAIROS 2.0 AI Assistant!**\n\n🎓 **I'm your intelligent educational companion powered by Gemini AI.**\n\n**I can help you with:**\n• 📸 Analyzing scanned objects\n• 🔬 Explaining scientific concepts\n• 📐 Solving math problems\n• 🧪 Understanding chemistry\n• ⚡ Physics questions\n• 🌱 Biology topics\n• 💡 Any educational question!\n\n**To get started:**\n1. Click the scan button 🔍\n2. Point camera at any object\n3. I'll analyze and explain it!\n\nReady to explore? 🚀`,
      timestamp: new Date(),
    };
    setMessages([welcomeMsg]);
  }, []);

  // Auto-scroll messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle object detection
  const handleDetection = useCallback(async (detections: any[]) => {
    setDetectedObjects(detections);
    
    if (detections.length > 0) {
      const topDetection = detections.reduce((prev, current) => 
        (prev.score > current.score) ? prev : current
      );
      
      if (topDetection.class !== currentObject) {
        setCurrentObject(topDetection.class);
      }
    }
  }, [currentObject]);


  // Capture frame and analyze with Gemini Vision
  const handleAnalyzeWithAI = async () => {
    try {
      setIsAnalyzing(true);

      const videoElement = document.querySelector('video') as HTMLVideoElement;
      if (!videoElement) {
        console.error('Video element not found');
        return;
      }

      const canvas = document.createElement('canvas');
      canvas.width = videoElement.videoWidth;
      canvas.height = videoElement.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        console.error('Failed to get canvas context');
        return;
      }

      ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob(resolve, 'image/jpeg', 0.9);
      });

      if (!blob) {
        console.error('Failed to create image blob');
        return;
      }

      const imageUrl = canvas.toDataURL('image/jpeg', 0.9);
      setCapturedImageUrl(imageUrl);

      const formData = new FormData();
      formData.append('file', blob, 'capture.jpg');

      const response = await fetch('http://localhost:8000/api/analyze-image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Analysis failed');
      }

      const result = await response.json();
      console.log('✅ Gemini Vision Analysis:', result);
      
      setAnalysisResult(result);
      
      // Generate AI message about the detected object
      const aiMsg = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `🎯 **Detected: ${result.object_detected}**\n\n📊 **Confidence:** ${Math.round((result.confidence || 0.9) * 100)}%\n\n${result.educational_info?.description || 'Analyzing the object...'}\n\n**Key Facts:**\n${(result.educational_info?.key_facts || []).map((fact: string, idx: number) => `${idx + 1}. ${fact}`).join('\n')}\n\n💡 **Fun Fact:** ${result.educational_info?.fun_fact || 'Ask me to learn more!'}`,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMsg]);

      // Fetch web info
      if (result.object_detected) {
        try {
          const webResponse = await conceptAPI.extractConcepts(result.object_detected, result.confidence || 0.9);
          setConcepts(webResponse);
          setStoreConcepts(webResponse.concepts);
        } catch (error) {
          console.error('Failed to fetch web info:', error);
        }
      }
      
      setIsScanning(false);
      setEnabled(false);

    } catch (error) {
      console.error('❌ Analysis error:', error);
      const errorMsg = {
        id: Date.now().toString(),
        role: 'assistant',
        content: '⚠️ Failed to analyze image. Please try again!',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const toggleScanning = () => {
    const newState = !isScanning;
    setIsScanning(newState);
    setEnabled(newState);
    
    if (!newState) {
      clearOverlays();
      setDetectedObjects([]);
      setCurrentObject(null);
      setConcepts(null);
    } else {
      // Add scanning message
      const scanMsg = {
        id: Date.now().toString(),
        role: 'assistant',
        content: '🔍 **Scanning mode activated!**\n\nPoint your camera at any object and I\'ll detect it. Once detected, tap "Analyze" to get detailed information!',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, scanMsg]);
    }
  };

  // Handle chat messages
  const handleSendMessage = async () => {
    if (!inputValue.trim() || isChatLoading) return;

    const userMsg = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsChatLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/chat-query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: inputValue.trim(),
          context: currentObject || analysisResult?.object_detected,
          conversation_history: messages.slice(-5),
        }),
      });

      let aiResponse = '';

      if (response.ok) {
        const data = await response.json();
        aiResponse = data.response || 'I received your question but couldn\'t generate a response.';
      } else {
        aiResponse = `I understand you're asking about "${inputValue.trim()}". While I can't connect to the AI right now, feel free to scan objects for analysis!`;
      }

      const assistantMsg = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMsg = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '⚠️ I\'m having trouble connecting. Please try again!',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    const welcomeMsg = {
      id: Date.now().toString(),
      role: 'assistant',
      content: '🔄 **Chat cleared!**\n\nHow can I help you today? Scan an object or ask me any question!',
      timestamp: new Date(),
    };
    setMessages([welcomeMsg]);
  };

  return (
    <div className="fixed inset-0 flex bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900">
      
      {/* LEFT SIDE - CHATBOT PANEL */}
      <motion.div 
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full md:w-2/5 lg:w-1/3 h-full flex flex-col border-r border-white/10 backdrop-blur-xl"
      >
        {/* Header */}
        <div className="relative p-6 border-b border-white/10">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10"></div>
          
          <div className="relative flex items-center justify-between">
            <Link href="/">
              <motion.h1 
                whileHover={{ scale: 1.02 }}
                className="text-3xl font-bold text-white cursor-pointer"
              >
                KAIROS <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">2.0</span>
              </motion.h1>
            </Link>
            
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={clearChat}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
            >
              <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </motion.button>
          </div>

          {/* AI Badge */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-white/20"
          >
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
            <span className="text-sm text-gray-300">AI Assistant Online</span>
            <span className="text-lg">🤖</span>
          </motion.div>

          {/* Detection Status */}
          <AnimatePresence>
            {currentObject && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-3 px-4 py-2 rounded-xl bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30"
              >
                <p className="text-xs text-green-300 font-medium">Currently Detecting:</p>
                <p className="text-white font-bold text-lg">{currentObject}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          <AnimatePresence mode="popLayout">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-5 py-4 shadow-xl ${
                    message.role === 'user'
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white ml-auto'
                      : 'bg-white/10 backdrop-blur-xl text-white border border-white/20'
                  }`}
                >
                  <div className="text-sm leading-relaxed whitespace-pre-wrap">
                    {message.content.split('\n').map((line: string, idx: number) => {
                      if (line.startsWith('**') && line.endsWith('**')) {
                        return <p key={idx} className="font-bold text-base mb-2 mt-1">{line.replace(/\*\*/g, '')}</p>;
                      }
                      if (line.trim().startsWith('•') || /^\d+\./.test(line.trim())) {
                        return <p key={idx} className="ml-3 mb-1 text-sm opacity-90">{line}</p>;
                      }
                      if (line.startsWith('🎯') || line.startsWith('📊') || line.startsWith('💡') || line.startsWith('🔍')) {
                        return <p key={idx} className="font-semibold text-sm mb-1 mt-2">{line}</p>;
                      }
                      return line ? <p key={idx} className="mb-1">{line}</p> : <br key={idx} />;
                    })}
                  </div>
                  <p className="text-xs opacity-50 mt-2 text-right">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isChatLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl px-5 py-4 border border-white/20">
                <div className="flex gap-1.5">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      animate={{ 
                        scale: [1, 1.3, 1], 
                        opacity: [0.5, 1, 0.5] 
                      }}
                      transition={{ 
                        duration: 0.8, 
                        repeat: Infinity, 
                        delay: i * 0.15 
                      }}
                      className="w-2.5 h-2.5 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-6 border-t border-white/10 bg-white/5 backdrop-blur-xl">
          <div className="flex gap-3">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything..."
              disabled={isChatLoading}
              className="flex-1 bg-white/10 border border-white/20 rounded-2xl px-5 py-3.5 text-white text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50 transition-all"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isChatLoading}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:from-gray-600 disabled:to-gray-700 text-white rounded-2xl px-6 py-3.5 font-semibold transition-all disabled:cursor-not-allowed shadow-lg"
            >
              <span className="text-lg">➤</span>
            </motion.button>
          </div>
          <div className="mt-3 flex items-center justify-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse"></div>
            <p className="text-xs text-gray-400">Powered by Gemini AI</p>
          </div>
        </div>
      </motion.div>

      {/* RIGHT SIDE - AR CAMERA VIEW */}
      <div className="flex-1 relative">
        {/* Camera Feed Background */}
        <div className="absolute inset-0">
          <CameraFeed />
        </div>

        {/* Object Detector */}
        {isScanning && (
          <ObjectDetector
            onDetection={handleDetection}
            isActive={isScanning}
          />
        )}

        {/* Captured Image with AR Annotations */}
        <AnimatePresence>
          {capturedImageUrl && analysisResult && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/95 backdrop-blur-sm z-40"
            >
              <div className="relative w-full h-full flex items-center justify-center p-8">
                <div className="relative max-w-4xl max-h-full">
                  <img 
                    src={capturedImageUrl} 
                    alt="Captured frame"
                    className="max-w-full max-h-full rounded-2xl shadow-2xl border-4 border-purple-500/30"
                  />
                  
                  {/* AR Annotations */}
                  {analysisResult.components?.map((component: any, idx: number) => {
                    const imgElement = document.querySelector('img[alt="Captured frame"]') as HTMLImageElement;
                    if (!imgElement) return null;

                    const rect = imgElement.getBoundingClientRect();
                    const x = component.position.x * rect.width + rect.left;
                    const y = component.position.y * rect.height + rect.top;

                    return (
                      <motion.div
                        key={idx}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: idx * 0.1 }}
                        style={{
                          position: 'fixed',
                          left: `${x}px`,
                          top: `${y}px`,
                          transform: 'translate(-50%, -50%)',
                        }}
                        className="pointer-events-none"
                      >
                        {/* Dot */}
                        <div className="w-4 h-4 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 animate-pulse shadow-lg"></div>
                        
                        {/* Label */}
                        <motion.div
                          initial={{ y: -10, opacity: 0 }}
                          animate={{ y: -30, opacity: 1 }}
                          transition={{ delay: idx * 0.1 + 0.2 }}
                          className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap"
                        >
                          <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-xl border border-white/20">
                            {component.name}
                          </div>
                        </motion.div>
                      </motion.div>
                    );
                  })}

                  {/* Close Button */}
                  <motion.button
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      setCapturedImageUrl(null);
                      setAnalysisResult(null);
                      setIsScanning(true);
                      setEnabled(true);
                    }}
                    className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-full shadow-2xl flex items-center justify-center font-bold text-xl border-4 border-white/20"
                  >
                    ✕
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Analyzing Overlay */}
        <AnimatePresence>
          {isAnalyzing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/90 backdrop-blur-xl z-50 flex items-center justify-center"
            >
              <div className="text-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="text-9xl mb-6"
                >
                  🧠
                </motion.div>
                <motion.h2
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-4xl font-bold text-white mb-3"
                >
                  Analyzing with Gemini Vision
                </motion.h2>
                <p className="text-gray-400 text-xl">
                  Detecting components and extracting insights...
                </p>
                
                <div className="flex items-center justify-center gap-3 mt-8">
                  {[0, 1, 2, 3].map((i) => (
                    <motion.div
                      key={i}
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.3, 1, 0.3],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        delay: i * 0.2,
                      }}
                      className="w-4 h-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Detection Boxes */}
        {isScanning && detectedObjects.length > 0 && !capturedImageUrl && (
          <div className="absolute inset-0 pointer-events-none z-30">
            {detectedObjects.map((detection, index) => {
              const videoElement = document.querySelector('video');
              if (!videoElement) return null;

              const videoWidth = videoElement.videoWidth;
              const videoHeight = videoElement.videoHeight;
              const displayWidth = videoElement.clientWidth;
              const displayHeight = videoElement.clientHeight;

              const scaleX = displayWidth / videoWidth;
              const scaleY = displayHeight / videoHeight;

              const [x, y, width, height] = detection.bbox;

              return (
                <motion.div
                  key={index}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  style={{
                    position: 'absolute',
                    left: `${x * scaleX}px`,
                    top: `${y * scaleY}px`,
                    width: `${width * scaleX}px`,
                    height: `${height * scaleY}px`,
                  }}
                >
                  <div className="w-full h-full border-4 border-green-400 rounded-2xl shadow-2xl shadow-green-500/50 animate-pulse"></div>
                  <motion.div 
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="absolute -top-12 left-0 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-xl"
                  >
                    {detection.class} • {Math.round(detection.score * 100)}%
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Analyze Button (when object detected) - Positioned above scan button */}
        <AnimatePresence>
          {isScanning && currentObject && !isAnalyzing && !capturedImageUrl && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              transition={{ type: "spring", damping: 15, stiffness: 300 }}
              className="absolute bottom-28 left-1/2 -translate-x-1/2 z-50"
            >
              {/* Glow effect container */}
              <div className="relative flex items-center justify-center">
                {/* Outer glow ring */}
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.4, 0.7, 0.4],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute -inset-2 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-2xl blur-xl"
                />

                {/* Main button - Compact size */}
                <motion.button
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: "0 20px 40px -12px rgba(168, 85, 247, 0.5)",
                  }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAnalyzeWithAI}
                  className="relative px-6 py-3 rounded-2xl font-bold text-base shadow-2xl overflow-hidden group backdrop-blur-xl border-2 border-white/20"
                  style={{
                    background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.95) 0%, rgba(236, 72, 153, 0.95) 50%, rgba(59, 130, 246, 0.95) 100%)',
                  }}
                >
                  {/* Animated shimmer effect */}
                  <motion.div
                    animate={{
                      x: ['-200%', '200%'],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "linear",
                      repeatDelay: 1,
                    }}
                    className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12"
                  />

                  {/* Hover gradient overlay */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
                    style={{ mixBlendMode: 'overlay' }}
                  />

                  {/* Button content - Centered with sparkles only */}
                  <span className="relative z-10 flex items-center justify-center gap-2 text-white">
                    {/* Sparkle icon left */}
                    <motion.span 
                      animate={{ 
                        rotate: [0, 360],
                        scale: [1, 1.15, 1],
                      }}
                      transition={{ 
                        duration: 2, 
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="text-xl drop-shadow-lg"
                    >
                      ✨
                    </motion.span>
                    
                    {/* Text */}
                    <span className="font-extrabold text-base tracking-wide drop-shadow-lg whitespace-nowrap">
                      Analyze with AI
                    </span>
                    
                    {/* Sparkle icon right */}
                    <motion.span 
                      animate={{ 
                        rotate: [0, -360],
                        scale: [1, 1.15, 1],
                      }}
                      transition={{ 
                        duration: 2, 
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="text-xl drop-shadow-lg"
                    >
                      ✨
                    </motion.span>
                  </span>

                  {/* Bottom shine effect */}
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-white/60 to-transparent" />
                  
                  {/* Top highlight */}
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scan Control Button - Smaller size */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-50">
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleScanning}
            className={`relative w-16 h-16 rounded-full font-bold shadow-2xl transition-all overflow-hidden ${
              isScanning 
                ? 'bg-gradient-to-r from-red-500 to-pink-500' 
                : 'bg-gradient-to-r from-blue-600 to-purple-600'
            }`}
          >
            <motion.div
              animate={isScanning ? { scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="absolute inset-0 bg-white/20 rounded-full"
            ></motion.div>
            <span className="relative text-white text-3xl">
              {isScanning ? '⏹' : '🔍'}
            </span>
          </motion.button>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-white text-xs font-medium mt-2"
          >
            {isScanning ? 'Stop' : 'Scan'}
          </motion.p>
        </div>

        {/* Instructions (when not scanning) */}
        {!isScanning && !capturedImageUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-40"
          >
            <div className="text-center text-white max-w-2xl px-8">
              <motion.div
                animate={{ 
                  y: [0, -20, 0],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity 
                }}
                className="text-9xl mb-8"
              >
                🔬
              </motion.div>
              <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
                Ready to Explore?
              </h2>
              <p className="text-2xl text-gray-300 mb-10 leading-relaxed">
                Point your camera at any object and discover the fascinating science behind it
              </p>
              <div className="flex flex-wrap justify-center gap-4 mb-10">
                {['Physics', 'Chemistry', 'Biology', 'Mathematics'].map((subject, idx) => (
                  <motion.span
                    key={subject}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    className="px-6 py-3 bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-white/20 rounded-full text-lg font-semibold backdrop-blur-xl"
                  >
                    {subject}
                  </motion.span>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
