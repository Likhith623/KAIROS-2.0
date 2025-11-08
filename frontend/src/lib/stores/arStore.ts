import { create } from 'zustand';
import { ARState, DetectedObject, ScientificConcept, AROverlay } from '@/types';

interface ARStore extends ARState {
  setEnabled: (enabled: boolean) => void;
  addOverlay: (overlay: AROverlay) => void;
  removeOverlay: (conceptId: string) => void;
  clearOverlays: () => void;
  addDetectedObject: (object: DetectedObject) => void;
  clearDetectedObjects: () => void;
  setConcepts: (concepts: ScientificConcept[]) => void;
  reset: () => void;
}

const initialState: ARState = {
  isEnabled: false,
  overlays: [],
  detectedObjects: [],
  currentConcepts: [],
};

export const useARStore = create<ARStore>((set) => ({
  ...initialState,
  
  setEnabled: (enabled) => set({ isEnabled: enabled }),
  
  addOverlay: (overlay) =>
    set((state) => ({
      overlays: [...state.overlays, overlay],
    })),
  
  removeOverlay: (conceptId) =>
    set((state) => ({
      overlays: state.overlays.filter((o) => o.concept_id !== conceptId),
    })),
  
  clearOverlays: () => set({ overlays: [] }),
  
  addDetectedObject: (object) =>
    set((state) => ({
      detectedObjects: [...state.detectedObjects, object],
    })),
  
  clearDetectedObjects: () => set({ detectedObjects: [] }),
  
  setConcepts: (concepts) => set({ currentConcepts: concepts }),
  
  reset: () => set(initialState),
}));
