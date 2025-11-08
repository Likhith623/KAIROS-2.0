'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

// Module data structure
interface Module {
  id: string;
  title: string;
  category: string;
  difficulty: string;
  concepts: string[];
  icon: string;
}

const SAMPLE_MODULES: Module[] = [
  {
    id: 'photosynthesis',
    title: 'Photosynthesis',
    category: 'biology',
    difficulty: 'intermediate',
    concepts: ['CO₂ → O₂ conversion', 'Chlorophyll function', 'Light reactions'],
    icon: '🌱',
  },
  {
    id: 'torque',
    title: 'Torque & Rotation',
    category: 'physics',
    difficulty: 'intermediate',
    concepts: ['τ = r × F', 'Angular momentum', 'Rotational motion'],
    icon: '⚙️',
  },
  {
    id: 'diffusion',
    title: 'Diffusion',
    category: 'chemistry',
    difficulty: 'beginner',
    concepts: ["Fick's laws", 'Concentration gradients', 'Molecular movement'],
    icon: '🧪',
  },
  {
    id: 'geometry',
    title: 'Geometric Optimization',
    category: 'geometry',
    difficulty: 'advanced',
    concepts: ['Volume calculations', 'Surface area', 'Optimization'],
    icon: '📐',
  },
  {
    id: 'projectile',
    title: 'Projectile Motion',
    category: 'physics',
    difficulty: 'intermediate',
    concepts: ['Parabolic trajectory', 'Velocity components', 'Range formula'],
    icon: '🎯',
  },
  {
    id: 'thermodynamics',
    title: 'Thermodynamics',
    category: 'physics',
    difficulty: 'advanced',
    concepts: ['Laws of thermodynamics', 'Heat transfer', 'Entropy'],
    icon: '🔥',
  },
];

export default function ModulesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredModules, setFilteredModules] = useState(SAMPLE_MODULES);

  const categories = ['all', 'physics', 'chemistry', 'biology', 'geometry'];

  useEffect(() => {
    let filtered = SAMPLE_MODULES;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(m => m.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        m =>
          m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.concepts.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    setFilteredModules(filtered);
  }, [selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-kairos-dark via-slate-900 to-kairos-dark">
      {/* Header */}
      <header className="bg-black/50 backdrop-blur-sm border-b border-white/10 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <h1 className="text-2xl font-bold text-white cursor-pointer hover:text-kairos-accent transition-colors">
                KAIROS <span className="text-kairos-accent">2.0</span>
              </h1>
            </Link>
            <Link href="/scan">
              <button className="bg-kairos-primary hover:bg-kairos-secondary text-white font-bold py-2 px-6 rounded-full transition-all">
                🔍 Start Scanning
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            Study Modules
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Explore scientific concepts with detailed explanations, formulas, and practice problems
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <input
            type="text"
            placeholder="Search modules or concepts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-6 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-kairos-accent"
          />
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`
                px-6 py-2 rounded-full font-semibold transition-all capitalize
                ${
                  selectedCategory === category
                    ? 'bg-kairos-primary text-white shadow-lg scale-105'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }
              `}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Modules Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {filteredModules.map((module) => (
            <div
              key={module.id}
              className="module-card group cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="text-5xl">{module.icon}</div>
                <span className="text-xs bg-white/20 px-3 py-1 rounded-full capitalize">
                  {module.difficulty}
                </span>
              </div>

              <h3 className="text-2xl font-bold mb-2 group-hover:text-kairos-accent transition-colors">
                {module.title}
              </h3>

              <div className="mb-4">
                <span className="text-sm text-white/70 capitalize bg-white/10 px-2 py-1 rounded">
                  {module.category}
                </span>
              </div>

              <div className="space-y-2">
                {module.concepts.map((concept, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-white/80">
                    <span className="text-kairos-accent">•</span>
                    {concept}
                  </div>
                ))}
              </div>

              <button className="mt-4 w-full bg-white/10 hover:bg-white/20 text-white font-bold py-2 px-4 rounded-lg transition-all">
                Learn More →
              </button>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredModules.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-white mb-2">No modules found</h3>
            <p className="text-gray-400">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="bg-gradient-to-r from-kairos-primary to-kairos-secondary rounded-3xl p-12 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Want to discover more concepts?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Use the AR scanner to point at real objects and instantly generate custom study modules
          </p>
          <Link href="/scan">
            <button className="bg-white text-kairos-primary font-bold py-4 px-8 rounded-full shadow-xl hover:shadow-2xl transition-all text-lg hover:scale-105">
              🚀 Start Scanning Now
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
