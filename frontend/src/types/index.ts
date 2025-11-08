// Type definitions for KAIROS 2.0

export interface DetectedObject {
  class: string;
  confidence: number;
  boundingBox: BoundingBox;
  timestamp: number;
}

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ScientificConcept {
  id: string;
  name: string;
  category: 'physics' | 'chemistry' | 'biology' | 'geometry' | 'engineering' | 'general';
  formulas: string[];
  description?: string;
}

export interface AROverlay {
  concept_id: string;
  type: 'vector' | 'flow' | 'label' | 'arrow' | 'heatmap' | 'particles' | 'trajectory' | 'dimension' | 'outline';
  position?: { x: number; y: number; z: number };
  color?: string;
  label?: string;
  from?: string;
  to?: string;
  direction?: string;
  [key: string]: any;
}

export interface StudyModule {
  id: string;
  title: string;
  category: string;
  formulas: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  content?: string;
  examples?: Example[];
  questions?: Question[];
}

export interface Example {
  id: string;
  title: string;
  description: string;
  solution?: string;
}

export interface Question {
  id: string;
  question: string;
  options?: string[];
  answer: string;
  explanation?: string;
}

export interface ConceptResponse {
  concepts: ScientificConcept[];
  overlays: AROverlay[];
  modules: StudyModule[];
}

export interface CameraState {
  isActive: boolean;
  stream: MediaStream | null;
  error: string | null;
}

export interface ARState {
  isEnabled: boolean;
  overlays: AROverlay[];
  detectedObjects: DetectedObject[];
  currentConcepts: ScientificConcept[];
}

export interface LLMState {
  isLoaded: boolean;
  isGenerating: boolean;
  model: string;
  error: string | null;
}
