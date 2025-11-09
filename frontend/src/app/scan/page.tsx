'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CameraFeed from '@/components/CameraFeed';
import ObjectDetector from '@/components/ObjectDetector';
import ProfessionalAROverlay from '@/components/ProfessionalAROverlay';
import ConceptPanel from '@/components/ConceptPanel';
import AnnotatedResultViewer from '@/components/AnnotatedResultViewer';
import ObjectChatbot from '@/components/ObjectChatbot';
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
  
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const router = useRouter();
  
  const { setEnabled, clearOverlays, setConcepts: setStoreConcepts } = useARStore();

  // Handle object detection
  const handleDetection = useCallback(async (detections: any[]) => {
    setDetectedObjects(detections);
    
    if (detections.length > 0) {
      // Get the most confident detection
      const topDetection = detections.reduce((prev, current) => 
        (prev.score > current.score) ? prev : current
      );
      
      // Just update current object, don't fetch concepts yet
      if (topDetection.class !== currentObject) {
        setCurrentObject(topDetection.class);
      }
    }
  }, [currentObject]);

  // Capture frame and analyze with Gemini Vision
  const handleAnalyzeWithAI = async () => {
    try {
      setIsAnalyzing(true);

      // Get video element
      const videoElement = document.querySelector('video') as HTMLVideoElement;
      if (!videoElement) {
        console.error('Video element not found');
        return;
      }

      // Create canvas to capture frame
      const canvas = document.createElement('canvas');
      canvas.width = videoElement.videoWidth;
      canvas.height = videoElement.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        console.error('Failed to get canvas context');
        return;
      }

      // Draw current video frame to canvas
      ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

      // Convert canvas to blob
      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob(resolve, 'image/jpeg', 0.9);
      });

      if (!blob) {
        console.error('Failed to create image blob');
        return;
      }

      // Store captured image URL for display
      const imageUrl = canvas.toDataURL('image/jpeg', 0.9);
      setCapturedImageUrl(imageUrl);

      // Create FormData and upload to backend
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
      
      // Now fetch web info for the detected object to show in ConceptPanel
      if (result.object_detected) {
        try {
          const webResponse = await conceptAPI.extractConcepts(result.object_detected, result.confidence || 0.9);
          setConcepts(webResponse);
          setStoreConcepts(webResponse.concepts);
        } catch (error) {
          console.error('Failed to fetch web info:', error);
        }
      }
      
      // Stop scanning mode
      setIsScanning(false);
      setEnabled(false);

    } catch (error) {
      console.error('❌ Analysis error:', error);
      alert('Failed to analyze image. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const toggleScanning = () => {
    const newState = !isScanning;
    setIsScanning(newState);
    setEnabled(newState);
    
    if (!newState) {
      // Clear when stopping
      clearOverlays();
      setDetectedObjects([]);
      setCurrentObject(null);
      setConcepts(null);
    }
  };

  const handleCloseAnalysis = () => {
    setAnalysisResult(null);
    setCapturedImageUrl(null);
    setIsScanning(true);
    setEnabled(true);
  };

  const handleLearnMore = (conceptName: string) => {
    router.push(`/modules?topic=${encodeURIComponent(conceptName)}`);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* Left Sidebar - AI Chatbot 
          Shows: 
          1. Initially (before scanning) - welcome message
          2. Hidden during active scanning
          3. After analysis - with detected object info
      */}
      <AnimatePresence>
        {!isScanning && !analysisResult && (
          <ObjectChatbot 
            detectedObject={null} 
            objectInfo={null}
          />
        )}
        {analysisResult && !isScanning && (
          <ObjectChatbot 
            detectedObject={analysisResult.object_detected} 
            objectInfo={concepts?.web_info || analysisResult.educational_info}
          />
        )}
      </AnimatePresence>

      {/* Show Analysis Result if available */}
      <AnimatePresence>
        {analysisResult && capturedImageUrl && (
          <AnnotatedResultViewer
            imageUrl={capturedImageUrl}
            analysisResult={analysisResult}
            onClose={handleCloseAnalysis}
            onLearnMore={handleLearnMore}
          />
        )}
      </AnimatePresence>

      {/* Camera Feed */}
      {!analysisResult && <CameraFeed />}

      {/* Object Detector */}
      {isScanning && !analysisResult && (
        <ObjectDetector
          onDetection={handleDetection}
          isActive={isScanning}
        />
      )}

      {/* Professional AR Overlay Canvas - REMOVED, only show after Gemini Vision analysis */}

      {/* Top Bar */}
      {!analysisResult && (
        <div className="absolute top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/80 to-transparent p-4">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <Link href="/">
              <h1 className="text-2xl font-bold text-white cursor-pointer hover:text-kairos-accent transition-colors">
                KAIROS <span className="text-kairos-accent">2.0</span>
              </h1>
            </Link>
            
            <div className="flex items-center gap-4">
              {currentObject && (
                <div className="bg-black/60 backdrop-blur-sm px-4 py-2 rounded-lg text-white">
                  <span className="text-sm text-gray-300">Detected: </span>
                  <span className="font-bold">{currentObject}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Analyze with AI Button (appears when object detected) */}
      {isScanning && currentObject && !isAnalyzing && !analysisResult && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="absolute bottom-32 left-1/2 transform -translate-x-1/2 z-50"
        >
          <motion.button
            onClick={handleAnalyzeWithAI}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white rounded-2xl font-bold text-lg shadow-2xl relative overflow-hidden group"
          >
            {/* Animated background gradient */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity"
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear",
              }}
            />
            <span className="relative z-10 flex items-center gap-2">
              <span className="text-2xl">🤖</span>
              Analyze with AI
              <span className="text-2xl">✨</span>
            </span>
          </motion.button>
        </motion.div>
      )}

      {/* Analyzing Overlay */}
      <AnimatePresence>
        {isAnalyzing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm z-[90] flex items-center justify-center"
          >
            <div className="text-center">
              <motion.div
                animate={{
                  rotate: 360,
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="text-8xl mb-4"
              >
                🧠
              </motion.div>
              <motion.h2
                animate={{
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="text-3xl font-bold text-white mb-2"
              >
                Analyzing with Gemini Vision...
              </motion.h2>
              <p className="text-gray-400 text-lg">
                Detecting precise component positions and educational insights
              </p>
              
              {/* Progress dots */}
              <div className="flex items-center justify-center gap-2 mt-6">
                {[0, 1, 2].map((i) => (
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
                    className="w-3 h-3 bg-kairos-accent rounded-full"
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scan Button */}
      {!analysisResult && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-50">
          <button
            onClick={toggleScanning}
            className={`
              relative w-20 h-20 rounded-full font-bold text-lg shadow-2xl
              transition-all duration-300 transform hover:scale-110
              ${isScanning 
                ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                : 'bg-kairos-primary hover:bg-kairos-secondary'
              }
            `}
          >
            <span className="text-white text-3xl">
              {isScanning ? '⏹' : '🔍'}
            </span>
            
            {isScanning && (
              <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-white text-sm whitespace-nowrap">
                Scanning...
              </span>
            )}
          </button>
        </div>
      )}

      {/* Concept Panel - Only show AFTER analysis */}
      {analysisResult && concepts && (
        <ConceptPanel
          concepts={concepts.concepts}
          modules={concepts.modules}
          isLoading={isLoadingConcepts}
          webInfo={concepts.web_info}
        />
      )}

      {/* Detection Boxes Overlay */}
      {isScanning && detectedObjects.length > 0 && (
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
              <div
                key={index}
                style={{
                  position: 'absolute',
                  left: `${x * scaleX}px`,
                  top: `${y * scaleY}px`,
                  width: `${width * scaleX}px`,
                  height: `${height * scaleY}px`,
                  border: '3px solid #00ff00',
                  borderRadius: '8px',
                  boxShadow: '0 0 20px rgba(0, 255, 0, 0.5)',
                  animation: 'pulse 2s infinite',
                }}
              >
                <div 
                  className="absolute -top-10 left-0 bg-gradient-to-r from-green-500 to-blue-500 text-white px-3 py-1 rounded-lg text-sm font-bold shadow-lg"
                  style={{
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  {detection.class} ({Math.round(detection.score * 100)}%)
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Instructions Overlay (when not scanning) */}
      {!isScanning && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-40">
          <div className="text-center text-white max-w-lg px-4">
            <div className="text-8xl mb-6 animate-float">🔬</div>
            <h2 className="text-4xl font-bold mb-4">Ready to Discover Science?</h2>
            <p className="text-xl text-gray-300 mb-8">
              Point your camera at any object and tap the scan button to reveal 
              the hidden scientific principles inside it
            </p>
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              <span className="concept-tag">Physics</span>
              <span className="concept-tag">Chemistry</span>
              <span className="concept-tag">Biology</span>
              <span className="concept-tag">Geometry</span>
            </div>
          </div>
        </div>
      )}

      {/* Object Chatbot - Visible before scanning and after analysis */}
      {(!isScanning || analysisResult) && (
        <ObjectChatbot 
          detectedObject={analysisResult?.object_detected || null}
          objectInfo={analysisResult}
        />
      )}
    </div>
  );
}
