'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Component {
  name: string;
  position: { x: number; y: number };
  description: string;
}

interface Process {
  name: string;
  type: string;
  from: { x: number; y: number };
  to: { x: number; y: number };
  label: string;
  color: string;
}

interface AnalysisResult {
  object_detected: string;
  confidence: number;
  components: Component[];
  concepts: Array<{
    name: string;
    category: string;
    formulas: string[];
  }>;
  educational_info: {
    description: string;
    key_facts: string[];
    scientific_principles: string[];
    fun_fact: string;
  };
  processes?: Process[];
  image_width: number;
  image_height: number;
}

interface Props {
  imageUrl: string;
  analysisResult: AnalysisResult;
  onClose: () => void;
  onLearnMore: (conceptName: string) => void;
}

export default function AnnotatedResultViewer({ 
  imageUrl, 
  analysisResult, 
  onClose,
  onLearnMore 
}: Props) {
  const [selectedComponent, setSelectedComponent] = useState<Component | null>(null);
  const [showInfo, setShowInfo] = useState(false);

  const handleShare = async () => {
    try {
      // Create a canvas to combine image and annotations
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const img = new Image();
      img.src = imageUrl;
      await new Promise((resolve) => {
        img.onload = resolve;
      });

      canvas.width = img.width;
      canvas.height = img.height;

      // Draw image
      ctx.drawImage(img, 0, 0);

      // Draw annotations
      ctx.font = 'bold 20px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      analysisResult.components.forEach((component) => {
        const x = component.position.x * canvas.width;
        const y = component.position.y * canvas.height;

        // Draw label background
        const textWidth = ctx.measureText(component.name).width;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(x - textWidth / 2 - 10, y - 20, textWidth + 20, 40);

        // Draw label text
        ctx.fillStyle = '#00ff00';
        ctx.fillText(component.name, x, y);

        // Draw dot at component location
        ctx.beginPath();
        ctx.arc(x, y, 8, 0, Math.PI * 2);
        ctx.fillStyle = '#ff0080';
        ctx.fill();
      });

      // Convert to blob and share
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        
        const file = new File([blob], 'kairos-ar-analysis.jpg', { type: 'image/jpeg' });
        
        if (navigator.share) {
          await navigator.share({
            title: `${analysisResult.object_detected} - KAIROS AR Analysis`,
            text: analysisResult.educational_info.description,
            files: [file],
          });
        } else {
          // Fallback: download the image
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'kairos-ar-analysis.jpg';
          a.click();
          URL.revokeObjectURL(url);
        }
      }, 'image/jpeg', 0.95);
    } catch (error) {
      console.error('Share failed:', error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950"
    >
      {/* Close Button - Top Right */}
      <motion.button
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 0.3, type: 'spring' }}
        whileHover={{ scale: 1.1, rotate: 90 }}
        whileTap={{ scale: 0.9 }}
        onClick={onClose}
        className="fixed top-6 right-6 z-[120] w-12 h-12 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all shadow-2xl"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </motion.button>

      {/* Action Buttons - Top Center */}
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="fixed top-6 left-1/2 -translate-x-1/2 z-[120] flex gap-3"
      >
        <motion.button
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowInfo(!showInfo)}
          className="px-6 py-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium shadow-lg hover:shadow-purple-500/50 transition-all backdrop-blur-xl border border-white/20"
        >
          <span className="flex items-center gap-2">
            <span className="text-lg">📚</span>
            {showInfo ? 'Hide Info' : 'Show Info'}
          </span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleShare}
          className="px-6 py-3 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-white font-medium shadow-lg hover:bg-white/20 transition-all"
        >
          <span className="flex items-center gap-2">
            <span className="text-lg">↗️</span>
            Share
          </span>
        </motion.button>
      </motion.div>

      {/* Main Content Area */}
      <div className="w-full h-full flex items-center justify-center p-24 pl-96">
        {/* Image Container with Annotations */}
        <div className="relative max-w-5xl max-h-full">
          <motion.img
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, type: 'spring', stiffness: 100 }}
            src={imageUrl}
            alt="Analyzed Object"
            className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl"
          />

          {/* Component Labels - Minimal & Elegant */}
          <AnimatePresence>
            {analysisResult.components.map((component, index) => {
              const xPercent = component.position.x * 100;
              const yPercent = component.position.y * 100;

              return (
                <motion.div
                  key={index}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ delay: 0.3 + index * 0.1, type: 'spring' }}
                  style={{
                    position: 'absolute',
                    left: `${xPercent}%`,
                    top: `${yPercent}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                  className="cursor-pointer group"
                  onClick={() => setSelectedComponent(component)}
                >
                  {/* Dot */}
                  <motion.div
                    whileHover={{ scale: 1.5 }}
                    className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 shadow-lg relative z-10"
                  >
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 animate-ping opacity-75"></div>
                  </motion.div>

                  {/* Label */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileHover={{ opacity: 1, y: 0, scale: 1.05 }}
                    className="absolute top-5 left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-1.5 rounded-full bg-black/80 backdrop-blur-xl border border-white/20 text-white text-xs font-medium shadow-xl opacity-0 group-hover:opacity-100 transition-all"
                  >
                    {component.name}
                  </motion.div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* Object Title Overlay - Bottom */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 via-black/50 to-transparent backdrop-blur-sm rounded-b-2xl"
          >
            <h2 className="text-3xl font-bold text-white mb-1">
              {analysisResult.object_detected}
            </h2>
            <p className="text-purple-300 text-sm">
              Confidence: {(analysisResult.confidence * 100).toFixed(1)}%
            </p>
          </motion.div>
        </div>
      </div>

      {/* Educational Info Panel */}
      <AnimatePresence>
        {showInfo && (
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 100, opacity: 0 }}
            transition={{ type: 'spring', damping: 20 }}
            className="fixed right-6 top-24 bottom-6 w-96 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2xl overflow-hidden z-[110]"
          >
            <div className="h-full overflow-y-auto p-6">
              {/* Description */}
              <div className="mb-6">
                <h3 className="text-white font-bold text-lg mb-3">About</h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {analysisResult.educational_info.description}
                </p>
              </div>

              {/* Key Facts */}
              {analysisResult.educational_info.key_facts.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-white font-bold text-lg mb-3">Key Facts</h3>
                  <div className="space-y-2">
                    {analysisResult.educational_info.key_facts.map((fact, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="flex items-start gap-3 text-sm text-gray-300"
                      >
                        <span className="text-purple-400 mt-1">•</span>
                        <span>{fact}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Fun Fact */}
              {analysisResult.educational_info.fun_fact && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-4 rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-400/30"
                >
                  <p className="text-purple-300 text-sm font-medium mb-1">💡 Fun Fact</p>
                  <p className="text-white text-sm">
                    {analysisResult.educational_info.fun_fact}
                  </p>
                </motion.div>
              )}

              {/* Related Concepts */}
              {analysisResult.concepts.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-white font-bold text-lg mb-3">Related Concepts</h3>
                  <div className="space-y-2">
                    {analysisResult.concepts.map((concept, idx) => (
                      <motion.button
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        whileHover={{ scale: 1.02, x: 5 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onLearnMore(concept.name)}
                        className="w-full text-left p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
                      >
                        <p className="text-white font-medium text-sm">{concept.name}</p>
                        <p className="text-gray-400 text-xs">{concept.category}</p>
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Selected Component Detail Modal */}
      <AnimatePresence>
        {selectedComponent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[115] bg-black/60 backdrop-blur-sm flex items-center justify-center"
            onClick={() => setSelectedComponent(null)}
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              transition={{ type: 'spring', damping: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-8 max-w-md shadow-2xl"
            >
              <h3 className="text-2xl font-bold text-white mb-3">
                {selectedComponent.name}
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed mb-6">
                {selectedComponent.description}
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedComponent(null)}
                className="w-full py-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium"
              >
                Close
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
