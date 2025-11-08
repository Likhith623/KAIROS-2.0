'use client';

import { useState, useCallback, useEffect } from 'react';
import CameraFeed from '@/components/CameraFeed';
import ObjectDetector from '@/components/ObjectDetector';
import AROverlayCanvas from '@/components/AROverlayCanvas';
import ConceptPanel from '@/components/ConceptPanel';
import { conceptAPI } from '@/lib/api/client';
import { useARStore } from '@/lib/stores/arStore';
import Link from 'next/link';
import type { DetectedObject, ConceptResponse } from '@/types';

export default function ScanPage() {
  const [isScanning, setIsScanning] = useState(false);
  const [detectedObjects, setDetectedObjects] = useState<any[]>([]);
  const [currentObject, setCurrentObject] = useState<string | null>(null);
  const [concepts, setConcepts] = useState<ConceptResponse | null>(null);
  const [isLoadingConcepts, setIsLoadingConcepts] = useState(false);
  
  const { setEnabled, clearOverlays, setConcepts: setStoreConcepts } = useARStore();

  // Handle object detection
  const handleDetection = useCallback(async (detections: any[]) => {
    setDetectedObjects(detections);
    
    if (detections.length > 0) {
      // Get the most confident detection
      const topDetection = detections.reduce((prev, current) => 
        (prev.score > current.score) ? prev : current
      );
      
      // Only fetch concepts if it's a different object or first detection
      if (topDetection.class !== currentObject) {
        setCurrentObject(topDetection.class);
        await fetchConcepts(topDetection.class, topDetection.score);
      }
    }
  }, [currentObject]);

  // Fetch scientific concepts for detected object
  const fetchConcepts = async (objectClass: string, confidence: number) => {
    try {
      setIsLoadingConcepts(true);
      const response = await conceptAPI.extractConcepts(objectClass, confidence);
      setConcepts(response);
      setStoreConcepts(response.concepts);
      console.log('📚 Concepts loaded:', response);
    } catch (error) {
      console.error('Failed to fetch concepts:', error);
    } finally {
      setIsLoadingConcepts(false);
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

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* Camera Feed */}
      <CameraFeed />

      {/* Object Detector */}
      {isScanning && (
        <ObjectDetector
          onDetection={handleDetection}
          isActive={isScanning}
        />
      )}

      {/* AR Overlay Canvas */}
      {isScanning && concepts && (
        <AROverlayCanvas
          detections={detectedObjects}
          overlays={concepts.overlays}
        />
      )}

      {/* Top Bar */}
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

      {/* Scan Button */}
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

      {/* Concept Panel */}
      {isScanning && concepts && (
        <ConceptPanel
          concepts={concepts.concepts}
          modules={concepts.modules}
          isLoading={isLoadingConcepts}
        />
      )}

      {/* Detection Boxes Overlay */}
      {isScanning && detectedObjects.length > 0 && (
        <div className="absolute inset-0 pointer-events-none z-10">
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
                className="ar-marker"
                style={{
                  left: `${x * scaleX}px`,
                  top: `${y * scaleY}px`,
                  width: `${width * scaleX}px`,
                  height: `${height * scaleY}px`,
                }}
              >
                <div className="absolute -top-8 left-0 bg-kairos-primary text-white px-2 py-1 rounded text-sm font-bold">
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
    </div>
  );
}
