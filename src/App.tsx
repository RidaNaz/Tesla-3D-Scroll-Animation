import { Suspense, useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import { AnimatePresence, motion } from 'framer-motion'
import { Roadster } from './components/Roadster'
import { CameraRig } from './components/CameraRig'
import { Loader } from './components/Loader'
import { useLenis } from './hooks/useLenis'
import { registerScrollTrigger } from './lib/scrollState'

const SECTIONS = [
  { 
    id: 'exterior', 
    title: 'Exterior', 
    copy: 'Sculpted for speed. Every line tells a story of aerodynamic precision and uncompromising design.',
    specs: null 
  },
  { 
    id: 'performance', 
    title: 'Performance', 
    copy: 'Pushing boundaries. The Roadster redefines what\'s possible on four wheels.',
    specs: [
      { label: 'HP', value: '1000' },
      { label: '0–60', value: '1.9', unit: 's' },
      { label: 'Torque', value: '10100', unit: 'Nm' }
    ]
  },
  { 
    id: 'interior', 
    title: 'Interior', 
    copy: 'Crafted for the driver. Premium materials, intuitive controls, and a focus on what matters.',
    specs: null 
  },
]

export default function App() {
  const [activeSection, setActiveSection] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  useLenis()

  useEffect(() => {
    return registerScrollTrigger(setActiveSection)
  }, [])

  return (
    <>
      {isLoading && <Loader />}
      
      <div className="fixed inset-0 -z-10">
        <Canvas 
          dpr={[1, 2]} 
          camera={{ fov: 35, position: [-3.51, 3.03, 5.7] }}
          onCreated={() => setIsLoading(false)}
        >
          <Suspense fallback={null}>
            <Environment preset="studio" />
            <Roadster />
            <CameraRig />
          </Suspense>
        </Canvas>
      </div>

      <div id="scroll-root" className="relative">
        {SECTIONS.map((section, i) => (
          <section key={section.id} className="h-screen flex items-center justify-start p-6 sm:p-8 md:p-12">
            <AnimatePresence>
              {activeSection === i && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                >
                  <div>
                    <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-black drop-shadow-lg">
                    {section.title}
                    </h2>
                    <p className="text-base sm:text-lg md:text-xl text-black/80 mt-4 max-w-xs sm:max-w-sm md:max-w-md leading-relaxed">
                      {section.copy}
                    </p>
                    
                    {section.specs && (
                      <div className="mt-8 flex gap-6 sm:gap-8">
                        {section.specs.map((spec, idx) => (
                          <motion.div
                            key={spec.label}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.1 + 0.2, duration: 0.3 }}
                          >
                            <div className="text-sm font-semibold text-black/60 uppercase tracking-wide">
                              {spec.label}
                            </div>
                            <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-black mt-1">
                              {spec.value}{spec.unit || ''}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>
        ))}
      </div>
    </>
  )
}
