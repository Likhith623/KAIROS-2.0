'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { STATIC_MODULES, ModuleTopic } from '@/lib/staticModules';

export default function ModulesPage() {
  const searchParams = useSearchParams();
  const topicFromUrl = searchParams.get('topic');
  
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState(topicFromUrl || '');
  const [expandedModule, setExpandedModule] = useState<string | null>(null);
  const [userNotes, setUserNotes] = useState<Record<string, string>>({});

  const categories = ['all', 'math', 'physics', 'chemistry', 'biology'];

  // Load all static modules (NO API CALLS!)
  const allModules: ModuleTopic[] = useMemo(() => {
    return [
      ...STATIC_MODULES.math,
      ...STATIC_MODULES.physics,
      ...STATIC_MODULES.chemistry,
      ...STATIC_MODULES.biology,
    ];
  }, []);

  // Load user notes from localStorage on mount
  useEffect(() => {
    const savedNotes = localStorage.getItem('kairos-user-notes');
    if (savedNotes) {
      try {
        setUserNotes(JSON.parse(savedNotes));
      } catch (e) {
        console.error('Failed to load user notes:', e);
      }
    }
  }, []);

  // Save user notes to localStorage whenever they change
  const saveNote = (moduleId: string, note: string) => {
    const updated = { ...userNotes, [moduleId]: note };
    setUserNotes(updated);
    localStorage.setItem('kairos-user-notes', JSON.stringify(updated));
  };

  // Filter modules based on category and search
  const filteredModules = useMemo(() => {
    let filtered = allModules;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((m) => m.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter((m) =>
        m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.theory.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [selectedCategory, searchQuery, allModules]);

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
              className="module-card group cursor-pointer relative"
              onClick={() => setExpandedModule(expandedModule === module.id ? null : module.id)}
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

              <p className="text-sm text-white/80 mb-4 line-clamp-3">
                {module.description}
              </p>

              {/* Expanded Content */}
              {expandedModule === module.id && (
                <div className="mt-4 pt-4 border-t border-white/20 max-h-96 overflow-y-auto">
                  {/* Key Points */}
                  {module.keyPoints && module.keyPoints.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-lg font-bold text-kairos-accent mb-2">🎯 Key Points:</h4>
                      <ul className="list-disc list-inside text-sm text-white/80 space-y-1">
                        {module.keyPoints.slice(0, 5).map((point, idx) => (
                          <li key={idx}>{point}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Formulas */}
                  {module.formulas && module.formulas.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-lg font-bold text-kairos-accent mb-2">📐 Key Formulas:</h4>
                      <div className="space-y-2">
                        {module.formulas.slice(0, 3).map((formula, idx) => (
                          <div key={idx} className="bg-white/5 px-3 py-2 rounded text-sm font-mono text-white/90">
                            {formula}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Applications */}
                  {module.applications && module.applications.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-lg font-bold text-kairos-accent mb-2">🚀 Applications:</h4>
                      <ul className="list-disc list-inside text-sm text-white/80 space-y-1">
                        {module.applications.slice(0, 3).map((app, idx) => (
                          <li key={idx}>{app}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* User Notes */}
                  <div className="mt-4">
                    <h4 className="text-lg font-bold text-kairos-accent mb-2">📝 Your Notes:</h4>
                    <textarea
                      value={userNotes[module.id] || ''}
                      onChange={(e) => {
                        e.stopPropagation();
                        saveNote(module.id, e.target.value);
                      }}
                      onClick={(e) => e.stopPropagation()}
                      placeholder="Add your personal notes here..."
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-kairos-accent resize-none"
                      rows={3}
                    />
                  </div>
                </div>
              )}

              <button className="mt-4 w-full text-center bg-kairos-primary/80 hover:bg-kairos-primary text-white font-bold py-2 px-4 rounded-lg transition-all">
                {expandedModule === module.id ? '▲ Show Less' : '▼ Explore Topic'}
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
