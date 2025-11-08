'use client';

import { useEffect, useRef, useState } from 'react';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import '@tensorflow/tfjs';

interface ObjectDetectorProps {
  onDetection: (detections: any[]) => void;
  isActive: boolean;
}

export default function ObjectDetector({ onDetection, isActive }: ObjectDetectorProps) {
  const [model, setModel] = useState<cocoSsd.ObjectDetection | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const detectionIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Load the COCO-SSD model
  useEffect(() => {
    const loadModel = async () => {
      try {
        setIsLoading(true);
        const loadedModel = await cocoSsd.load();
        setModel(loadedModel);
        setIsLoading(false);
        console.log('✅ Object detection model loaded');
      } catch (err) {
        console.error('Failed to load model:', err);
        setError('Failed to load object detection model');
        setIsLoading(false);
      }
    };

    loadModel();
  }, []);

  // Run detection on video element
  const detectObjects = async (videoElement: HTMLVideoElement) => {
    if (!model || !videoElement) return;

    try {
      const predictions = await model.detect(videoElement);
      
      if (predictions && predictions.length > 0) {
        onDetection(predictions);
      }
    } catch (err) {
      console.error('Detection error:', err);
    }
  };

  // Start detection loop
  useEffect(() => {
    if (isActive && model) {
      const videoElement = document.querySelector('video');
      
      if (videoElement) {
        // Run detection every 500ms
        detectionIntervalRef.current = setInterval(() => {
          detectObjects(videoElement);
        }, 500);
      }
    }

    return () => {
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current);
      }
    };
  }, [isActive, model]);

  if (isLoading) {
    return (
      <div className="fixed top-4 right-4 bg-black/80 text-white px-4 py-2 rounded-lg backdrop-blur-sm z-50">
        <div className="flex items-center gap-2">
          <div className="loading-spinner w-4 h-4" />
          <span>Loading AI model...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed top-4 right-4 bg-red-500/90 text-white px-4 py-2 rounded-lg backdrop-blur-sm z-50">
        <span>⚠️ {error}</span>
      </div>
    );
  }

  return (
    <div className="fixed top-4 right-4 bg-green-500/90 text-white px-4 py-2 rounded-lg backdrop-blur-sm z-50">
      <span>✓ AI Ready</span>
    </div>
  );
}
