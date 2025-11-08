'use client';

import { useState } from 'react';
import type { ScientificConcept, StudyModule } from '@/types';
import Link from 'next/link';

interface ConceptPanelProps {
  concepts: ScientificConcept[];
  modules: StudyModule[];
  isLoading: boolean;
}

export default function ConceptPanel({ concepts, modules, isLoading }: ConceptPanelProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  if (isLoading) {
    return (
      <div className="absolute top-20 left-4 bg-black/80 text-white px-4 py-3 rounded-lg backdrop-blur-sm z-40 max-w-sm">
        <div className="flex items-center gap-2">
          <div className="loading-spinner w-4 h-4" />
          <span>Analyzing concepts...</span>
        </div>
      </div>
    );
  }

  if (concepts.length === 0) return null;

  return (
    <div className="absolute top-20 left-4 z-40 max-w-md">
      <div className="concept-card bg-black/90 backdrop-blur-md border-white/20">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <span>🔬</span> Detected Concepts
          </h3>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-white hover:text-kairos-accent transition-colors"
          >
            {isExpanded ? '▼' : '▶'}
          </button>
        </div>

        {/* Concepts List */}
        {isExpanded && (
          <div className="space-y-3">
            {concepts.map((concept, index) => (
              <div
                key={concept.id}
                className="bg-white/10 rounded-lg p-3 hover:bg-white/20 transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-bold text-white mb-1">{concept.name}</h4>
                    <span className="text-xs text-gray-300 bg-kairos-accent/30 px-2 py-1 rounded-full">
                      {concept.category}
                    </span>
                  </div>
                  <div className="text-2xl">
                    {getCategoryIcon(concept.category)}
                  </div>
                </div>

                {/* Formulas */}
                {concept.formulas && concept.formulas.length > 0 && (
                  <div className="mt-2 text-sm text-gray-200 font-mono bg-black/30 px-2 py-1 rounded">
                    {concept.formulas[0]}
                  </div>
                )}
              </div>
            ))}

            {/* Learn More Button */}
            <Link href="/modules">
              <button className="w-full bg-kairos-primary hover:bg-kairos-secondary text-white font-bold py-3 px-4 rounded-lg transition-all mt-4">
                📚 Open Study Modules
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

function getCategoryIcon(category: string): string {
  const icons: Record<string, string> = {
    physics: '⚛️',
    chemistry: '🧪',
    biology: '🧬',
    geometry: '📐',
    engineering: '⚙️',
    general: '📋',
  };
  return icons[category] || '📋';
}
