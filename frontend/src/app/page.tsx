'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const features = [
    {
      icon: '📷',
      title: 'Real-Time Scanning',
      description: 'Point your camera at any object and watch KAIROS identify it instantly using browser-based ML models',
    },
    {
      icon: '🔬',
      title: 'Scientific Concepts',
      description: 'Discover hidden principles: torque, diffusion, geometry, friction, and more in everyday objects',
    },
    {
      icon: '✨',
      title: 'AR Overlays',
      description: 'See vector arrows, flows, diagrams, and animations overlaid directly on real objects',
    },
    {
      icon: '📚',
      title: 'Study Modules',
      description: 'Get detailed explanations, formulas, examples, and practice questions for each concept',
    },
  ];

  const examples = [
    {
      object: '🌱 Plant',
      concepts: ['Photosynthesis', 'Diffusion', 'Transpiration', 'Osmosis'],
      color: 'from-green-500 to-emerald-600',
    },
    {
      object: '🚲 Bicycle',
      concepts: ['Torque', 'Angular Momentum', 'Mechanical Advantage', 'Friction'],
      color: 'from-blue-500 to-cyan-600',
    },
    {
      object: '🍶 Bottle',
      concepts: ['Volume & Surface Area', 'Pressure', 'Material Properties', 'Geometry'],
      color: 'from-purple-500 to-pink-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-kairos-dark via-slate-900 to-kairos-dark">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-kairos-primary/10 to-transparent" />
        
        <div className="container mx-auto px-4 py-20 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-6xl md:text-8xl font-bold text-white mb-6">
              KAIROS <span className="text-kairos-accent">2.0</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Turn your camera into an <span className="text-kairos-accent font-semibold">interactive science teacher</span>
            </p>
            <p className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto">
              Scan any real-world object and discover the hidden scientific principles inside it 
              with AR overlays and instant study modules
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/scan">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="xr-button text-lg"
                >
                  🚀 Start Scanning
                </motion.button>
              </Link>
              <Link href="/modules">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-6 rounded-full shadow-lg transition-all duration-300 text-lg backdrop-blur-sm border border-white/20"
                >
                  📚 Browse Modules
                </motion.button>
              </Link>
            </div>
          </motion.div>

          {/* Animated Background Elements */}
          <div className="absolute top-20 left-10 w-20 h-20 bg-kairos-primary/20 rounded-full blur-xl animate-float" />
          <div className="absolute bottom-20 right-10 w-32 h-32 bg-kairos-accent/20 rounded-full blur-xl animate-float" style={{ animationDelay: '1s' }} />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white/5 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold text-white text-center mb-16"
          >
            How It Works
          </motion.h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="concept-card bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 transition-all duration-300"
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Examples Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold text-white text-center mb-16"
          >
            See It In Action
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-8">
            {examples.map((example, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`module-card bg-gradient-to-br ${example.color}`}
              >
                <div className="text-4xl mb-4">{example.object}</div>
                <h3 className="text-2xl font-bold mb-4">Detected Concepts:</h3>
                <div className="flex flex-wrap gap-2">
                  {example.concepts.map((concept, i) => (
                    <span key={i} className="bg-white/20 px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                      {concept}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-kairos-primary to-kairos-secondary">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Learn?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Start exploring the science behind everyday objects. No installation, no database, completely free.
            </p>
            <Link href="/scan">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-kairos-primary font-bold py-4 px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 text-lg"
              >
                Launch KAIROS 2.0 →
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-kairos-dark border-t border-white/10 py-8">
        <div className="container mx-auto px-4 text-center text-gray-400">
          <p>© 2025 KAIROS 2.0. Open-source AI learning platform.</p>
          <p className="mt-2 text-sm">Built with Next.js, WebXR, TensorFlow.js, and WebLLM</p>
        </div>
      </footer>
    </div>
  );
}
