'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { STATIC_MODULES, ModuleTopic } from '@/lib/staticModules';

export default function ModulesPage() {
  const searchParams = useSearchParams();
  const topicFromUrl = searchParams.get('topic');
  
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState(topicFromUrl || '');
  const [expandedModule, setExpandedModule] = useState<string | null>(null);
  const [userNotes, setUserNotes] = useState<Record<string, string>>({});
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);

  const categories = ['all', 'math', 'physics', 'chemistry', 'biology'];

  const categoryIcons: Record<string, string> = {
    all: '🌟',
    math: '📐',
    physics: '⚡',
    chemistry: '🧪',
    biology: '🌱',
  };

  const categoryGradients: Record<string, string> = {
    all: 'from-purple-500 via-pink-500 to-blue-500',
    math: 'from-blue-500 via-cyan-500 to-teal-500',
    physics: 'from-yellow-500 via-orange-500 to-red-500',
    chemistry: 'from-green-500 via-emerald-500 to-teal-500',
    biology: 'from-pink-500 via-rose-500 to-red-500',
  };

  // Mouse move handler
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

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
    <div className="min-h-screen bg-black overflow-hidden relative">
      {/* Animated cursor follower */}
      <motion.div
        className="fixed w-8 h-8 rounded-full pointer-events-none z-50 mix-blend-difference"
        animate={{
          x: mousePosition.x - 16,
          y: mousePosition.y - 16,
        }}
        transition={{ type: "spring", damping: 30, stiffness: 200 }}
      >
        <div className="w-full h-full bg-white rounded-full blur-sm"></div>
      </motion.div>

      {/* Animated background gradient */}
      <motion.div 
        className="fixed inset-0 bg-gradient-to-br from-purple-950 via-black to-blue-950"
        style={{ y: backgroundY }}
      />

      {/* Floating particles background */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              opacity: Math.random() * 0.5,
            }}
            animate={{
              y: [null, Math.random() * window.innerHeight],
              opacity: [null, Math.random() * 0.5, 0],
            }}
            transition={{
              duration: 10 + Math.random() * 20,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* Header */}
      <motion.header 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="sticky top-0 z-40 bg-black/30 backdrop-blur-2xl border-b border-white/10"
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <motion.h1 
                whileHover={{ scale: 1.05 }}
                className="text-3xl font-black text-white cursor-pointer"
              >
                KAIROS <motion.span 
                  className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400"
                  animate={{
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                  style={{ backgroundSize: '200% 200%' }}
                >
                  2.0
                </motion.span>
              </motion.h1>
            </Link>
            <Link href="/scan">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 20px 60px rgba(168, 85, 247, 0.4)" }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-3 px-6 rounded-2xl shadow-xl transition-all"
              >
                <span className="flex items-center gap-2">
                  <span className="text-xl">🔍</span>
                  <span>Start Scanning</span>
                </span>
              </motion.button>
            </Link>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16 relative z-10">
        {/* Title Section with Premium Animation */}
        <motion.div 
          ref={heroRef}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          {/* Premium badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 mb-6"
          >
            <span className="text-2xl">📚</span>
            <span className="text-white/90 font-semibold">Interactive Learning Modules</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-6xl md:text-8xl font-black text-white mb-6"
          >
            Study <motion.span
              className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400"
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{ duration: 5, repeat: Infinity }}
              style={{ backgroundSize: '200% 200%' }}
            >
              Modules
            </motion.span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
          >
            Explore scientific concepts with <span className="text-purple-400 font-semibold">detailed explanations</span>, 
            {' '}<span className="text-pink-400 font-semibold">formulas</span>, and 
            {' '}<span className="text-blue-400 font-semibold">practice problems</span>
          </motion.p>
        </motion.div>

        {/* Search Bar with Premium Design */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="max-w-3xl mx-auto mb-12"
        >
          <div className="relative group">
            <motion.div
              className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-3xl blur opacity-30 group-hover:opacity-60 transition duration-500"
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{ duration: 3, repeat: Infinity }}
              style={{ backgroundSize: '200% 200%' }}
            />
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="Search modules, concepts, formulas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-8 py-5 bg-black/50 backdrop-blur-2xl border border-white/20 rounded-3xl text-white text-lg placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-all"
              />
              <motion.div 
                className="absolute right-6 text-3xl"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                🔍
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Category Filter with Premium Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="flex flex-wrap justify-center gap-4 mb-16"
        >
          {categories.map((category, index) => (
            <motion.button
              key={category}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1 + index * 0.1, duration: 0.4 }}
              whileHover={{ scale: 1.1, y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(category)}
              className={`
                relative group px-8 py-4 rounded-2xl font-bold capitalize transition-all overflow-hidden
                ${selectedCategory === category 
                  ? 'text-white shadow-2xl' 
                  : 'text-gray-300 bg-white/5 backdrop-blur-xl border border-white/10 hover:border-white/30'
                }
              `}
            >
              {selectedCategory === category && (
                <motion.div
                  layoutId="categoryBg"
                  className={`absolute inset-0 bg-gradient-to-r ${categoryGradients[category]}`}
                  initial={false}
                  transition={{ type: "spring", damping: 20, stiffness: 300 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                <span className="text-2xl">{categoryIcons[category]}</span>
                <span>{category}</span>
              </span>
            </motion.button>
          ))}
        </motion.div>

        {/* Modules Grid with Mind-Blowing Cards */}
        <motion.div 
          layout
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto"
        >
          <AnimatePresence mode="popLayout">
            {filteredModules.map((module, index) => (
              <motion.div
                key={module.id}
                layout
                initial={{ opacity: 0, scale: 0.8, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -50 }}
                transition={{ 
                  duration: 0.5, 
                  delay: index * 0.05,
                  type: "spring",
                  stiffness: 100
                }}
                onMouseEnter={() => setHoveredCard(module.id)}
                onMouseLeave={() => setHoveredCard(null)}
                className="group relative cursor-pointer"
                style={{ perspective: "1000px" }}
              >
                {/* Card Container with 3D Effect */}
                <motion.div
                  whileHover={{ 
                    scale: 1.05, 
                    rotateY: hoveredCard === module.id ? 5 : 0,
                    z: 50 
                  }}
                  transition={{ type: "spring", stiffness: 300 }}
                  onClick={() => setExpandedModule(expandedModule === module.id ? null : module.id)}
                  className="relative p-8 rounded-3xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl border border-white/20 overflow-hidden"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  {/* Animated gradient overlay on hover */}
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-br ${categoryGradients[module.category]} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                  />

                  {/* Shine effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "200%" }}
                    transition={{ duration: 0.8 }}
                  />

                  {/* Glow effect */}
                  {hoveredCard === module.id && (
                    <motion.div
                      className={`absolute -inset-1 bg-gradient-to-r ${categoryGradients[module.category]} rounded-3xl blur-2xl opacity-30`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.4 }}
                      exit={{ opacity: 0 }}
                    />
                  )}

                  <div className="relative z-10">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-6">
                      <motion.div 
                        className="text-6xl"
                        animate={hoveredCard === module.id ? {
                          scale: [1, 1.2, 1],
                          rotate: [0, 10, -10, 0],
                        } : {}}
                        transition={{ duration: 0.5 }}
                      >
                        {module.icon}
                      </motion.div>
                      <motion.span 
                        whileHover={{ scale: 1.1 }}
                        className={`
                          text-xs font-bold px-4 py-2 rounded-full capitalize
                          ${module.difficulty === 'beginner' ? 'bg-green-500/20 text-green-300 border border-green-500/30' : ''}
                          ${module.difficulty === 'intermediate' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' : ''}
                          ${module.difficulty === 'advanced' ? 'bg-red-500/20 text-red-300 border border-red-500/30' : ''}
                        `}
                      >
                        {module.difficulty}
                      </motion.span>
                    </div>

                    {/* Title */}
                    <motion.h3 
                      className="text-2xl font-black mb-4 text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 transition-all"
                    >
                      {module.title}
                    </motion.h3>

                    {/* Category Badge */}
                    <div className="mb-4">
                      <motion.span 
                        whileHover={{ scale: 1.05 }}
                        className={`inline-flex items-center gap-2 text-sm font-semibold capitalize px-4 py-2 rounded-xl bg-gradient-to-r ${categoryGradients[module.category]} text-white shadow-lg`}
                      >
                        <span>{categoryIcons[module.category]}</span>
                        <span>{module.category}</span>
                      </motion.span>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-white/80 mb-6 leading-relaxed line-clamp-3">
                      {module.description}
                    </p>

                    {/* Expanded Content with Smooth Animation */}
                    <AnimatePresence>
                      {expandedModule === module.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.4 }}
                          className="mt-6 pt-6 border-t border-white/20 max-h-96 overflow-y-auto scrollbar-thin"
                        >
                          {/* Key Points */}
                          {module.keyPoints && module.keyPoints.length > 0 && (
                            <motion.div 
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.1 }}
                              className="mb-6"
                            >
                              <h4 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-3 flex items-center gap-2">
                                <span>🎯</span>
                                <span>Key Points</span>
                              </h4>
                              <div className="space-y-2">
                                {module.keyPoints.slice(0, 5).map((point, idx) => (
                                  <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.1 + idx * 0.05 }}
                                    className="flex items-start gap-3 text-sm text-white/80 bg-white/5 p-3 rounded-xl hover:bg-white/10 transition-colors"
                                  >
                                    <span className="text-purple-400 font-bold">•</span>
                                    <span>{point}</span>
                                  </motion.div>
                                ))}
                              </div>
                            </motion.div>
                          )}

                          {/* Formulas */}
                          {module.formulas && module.formulas.length > 0 && (
                            <motion.div 
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.2 }}
                              className="mb-6"
                            >
                              <h4 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 mb-3 flex items-center gap-2">
                                <span>📐</span>
                                <span>Key Formulas</span>
                              </h4>
                              <div className="space-y-3">
                                {module.formulas.slice(0, 3).map((formula, idx) => (
                                  <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2 + idx * 0.05 }}
                                    whileHover={{ scale: 1.02, x: 5 }}
                                    className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/30 px-4 py-3 rounded-xl text-sm font-mono text-white/90 hover:border-blue-400/50 transition-all"
                                  >
                                    {formula}
                                  </motion.div>
                                ))}
                              </div>
                            </motion.div>
                          )}

                          {/* Applications */}
                          {module.applications && module.applications.length > 0 && (
                            <motion.div 
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.3 }}
                              className="mb-6"
                            >
                              <h4 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400 mb-3 flex items-center gap-2">
                                <span>🚀</span>
                                <span>Applications</span>
                              </h4>
                              <div className="space-y-2">
                                {module.applications.slice(0, 3).map((app, idx) => (
                                  <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 + idx * 0.05 }}
                                    className="flex items-start gap-3 text-sm text-white/80 bg-white/5 p-3 rounded-xl hover:bg-white/10 transition-colors"
                                  >
                                    <span className="text-green-400 font-bold">→</span>
                                    <span>{app}</span>
                                  </motion.div>
                                ))}
                              </div>
                            </motion.div>
                          )}

                          {/* User Notes */}
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="mt-6"
                          >
                            <h4 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-rose-400 mb-3 flex items-center gap-2">
                              <span>📝</span>
                              <span>Your Notes</span>
                            </h4>
                            <textarea
                              value={userNotes[module.id] || ''}
                              onChange={(e) => {
                                e.stopPropagation();
                                saveNote(module.id, e.target.value);
                              }}
                              onClick={(e) => e.stopPropagation()}
                              placeholder="Add your personal notes here..."
                              className="w-full px-4 py-3 bg-black/30 backdrop-blur-xl border border-white/20 rounded-xl text-white text-sm placeholder-gray-400 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 resize-none transition-all"
                              rows={4}
                            />
                          </motion.div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Action Button */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`
                        mt-6 w-full text-center font-bold py-4 px-6 rounded-2xl transition-all
                        ${expandedModule === module.id 
                          ? 'bg-gradient-to-r from-red-600 to-pink-600 text-white shadow-lg' 
                          : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg hover:shadow-2xl'
                        }
                      `}
                    >
                      <span className="flex items-center justify-center gap-2">
                        {expandedModule === module.id ? (
                          <>
                            <span>▲</span>
                            <span>Show Less</span>
                          </>
                        ) : (
                          <>
                            <span>▼</span>
                            <span>Explore Topic</span>
                          </>
                        )}
                      </span>
                    </motion.button>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* No Results with Premium Animation */}
        {filteredModules.length === 0 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center py-32"
          >
            <motion.div 
              animate={{ 
                y: [0, -20, 0],
                rotate: [0, 10, -10, 0]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-8xl mb-8"
            >
              🔍
            </motion.div>
            <h3 className="text-4xl font-black text-white mb-4">No modules found</h3>
            <p className="text-xl text-gray-400 mb-8">Try adjusting your search or filters</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-4 px-8 rounded-2xl shadow-xl"
            >
              Reset Filters
            </motion.button>
          </motion.div>
        )}
      </div>

      {/* CTA Section with Premium Design */}
      <div className="container mx-auto px-4 py-24 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-[3rem] p-1"
        >
          {/* Animated gradient border */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-[3rem]"
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{ duration: 5, repeat: Infinity }}
            style={{ backgroundSize: '200% 200%' }}
          />

          <div className="relative bg-gradient-to-br from-purple-900/90 via-pink-900/90 to-blue-900/90 backdrop-blur-xl rounded-[3rem] p-16 text-center overflow-hidden">
            {/* Floating geometric shapes */}
            <motion.div
              animate={{ 
                rotate: 360,
                scale: [1, 1.2, 1],
              }}
              transition={{ 
                rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                scale: { duration: 5, repeat: Infinity, ease: "easeInOut" }
              }}
              className="absolute top-10 right-10 w-32 h-32 border-4 border-white/20 rounded-3xl"
            />
            <motion.div
              animate={{ 
                rotate: -360,
                scale: [1, 1.3, 1],
              }}
              transition={{ 
                rotate: { duration: 25, repeat: Infinity, ease: "linear" },
                scale: { duration: 6, repeat: Infinity, ease: "easeInOut" }
              }}
              className="absolute bottom-10 left-10 w-40 h-40 border-4 border-white/20 rounded-full"
            />

            <div className="relative z-10">
              {/* Icon Animation */}
              <motion.div
                animate={{ 
                  y: [0, -15, 0],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="text-8xl mb-8"
              >
                🎓
              </motion.div>

              <motion.h2 
                className="text-5xl md:text-6xl font-black text-white mb-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                viewport={{ once: true }}
              >
                Want to discover more?
              </motion.h2>

              <motion.p 
                className="text-xl md:text-2xl text-white/90 mb-10 max-w-3xl mx-auto leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                viewport={{ once: true }}
              >
                Use the <span className="font-bold text-yellow-300">AR scanner</span> to point at real objects 
                and <span className="font-bold text-pink-300">instantly generate</span> custom study modules with 
                <span className="font-bold text-cyan-300"> AI-powered insights</span>
              </motion.p>

              <Link href="/scan">
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 }}
                  viewport={{ once: true }}
                  whileHover={{ 
                    scale: 1.1,
                    boxShadow: "0 30px 80px rgba(255, 255, 255, 0.3)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="group relative px-12 py-6 bg-white text-purple-900 text-xl font-black rounded-2xl shadow-2xl overflow-hidden"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-pink-400 to-cyan-400"
                    animate={{
                      x: ['-100%', '200%'],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                  <span className="relative z-10 flex items-center gap-4">
                    <span className="text-2xl">🚀</span>
                    <span>Start Scanning Now</span>
                    <motion.span
                      animate={{ x: [0, 10, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      →
                    </motion.span>
                  </span>
                </motion.button>
              </Link>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                viewport={{ once: true }}
                className="mt-12 flex flex-wrap justify-center gap-8 text-white/70"
              >
                {[
                  { icon: '⚡', text: 'Instant Analysis' },
                  { icon: '🎯', text: 'Personalized Learning' },
                  { icon: '💯', text: 'Free Forever' },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.1, color: '#ffffff' }}
                    className="flex items-center gap-2"
                  >
                    <span className="text-3xl">{item.icon}</span>
                    <span className="font-bold text-lg">{item.text}</span>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}