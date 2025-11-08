import axios from 'axios';
import { ConceptResponse } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const conceptAPI = {
  /**
   * Extract scientific concepts from detected object
   */
  async extractConcepts(
    objectClass: string,
    confidence: number,
    context: string = ''
  ): Promise<ConceptResponse> {
    const response = await apiClient.post<ConceptResponse>('/api/extract-concepts', {
      object_class: objectClass,
      confidence,
      context,
    });
    return response.data;
  },

  /**
   * Solve a mathematical equation
   */
  async solveEquation(equation: string, variable: string = 'x') {
    const response = await apiClient.post('/api/solve-equation', null, {
      params: { equation, variable },
    });
    return response.data;
  },

  /**
   * Get relationships between concepts
   */
  async getConceptRelationships(concepts: string[]) {
    const response = await apiClient.post('/api/concept-relationships', concepts);
    return response.data;
  },

  /**
   * Health check
   */
  async healthCheck() {
    const response = await apiClient.get('/api/health');
    return response.data;
  },
};
