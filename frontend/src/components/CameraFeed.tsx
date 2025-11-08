'use client';

import { useEffect, useRef, useState } from 'react';

interface CameraFeedProps {
  onStreamReady?: (stream: MediaStream) => void;
  onError?: (error: string) => void;
}

export default function CameraFeed({ onStreamReady, onError }: CameraFeedProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');

  const startCamera = async (facing: 'user' | 'environment' = 'environment') => {
    try {
      setIsLoading(true);
      setError(null);

      // Stop existing stream
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }

      // Request camera access
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facing,
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        
        // Wait for video to be ready
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play();
          setIsLoading(false);
          setStream(mediaStream);
          onStreamReady?.(mediaStream);
        };
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to access camera';
      setError(errorMessage);
      setIsLoading(false);
      onError?.(errorMessage);
      console.error('Camera error:', err);
    }
  };

  useEffect(() => {
    startCamera(facingMode);

    return () => {
      // Cleanup: stop all tracks
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [facingMode]);

  const switchCamera = () => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  };

  return (
    <div className="camera-feed">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-full object-cover"
      />

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70">
          <div className="text-center">
            <div className="loading-spinner mx-auto mb-4" />
            <p className="text-white text-lg">Initializing camera...</p>
          </div>
        </div>
      )}

      {/* Error Overlay */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70">
          <div className="text-center text-white max-w-md px-4">
            <div className="text-6xl mb-4">📷</div>
            <h3 className="text-xl font-bold mb-2">Camera Access Required</h3>
            <p className="text-gray-300 mb-4">{error}</p>
            <button
              onClick={() => startCamera(facingMode)}
              className="bg-kairos-primary hover:bg-kairos-secondary text-white font-bold py-2 px-6 rounded-full transition-all"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Camera Controls */}
      {!isLoading && !error && (
        <div className="absolute bottom-8 right-8 flex flex-col gap-2">
          <button
            onClick={switchCamera}
            className="bg-black/50 hover:bg-black/70 text-white p-4 rounded-full backdrop-blur-sm transition-all shadow-lg"
            title="Switch Camera"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </button>
        </div>
      )}

      {/* Scan Line Animation */}
      {!isLoading && !error && (
        <div className="scan-line" />
      )}
    </div>
  );
}
