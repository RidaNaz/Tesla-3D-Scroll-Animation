import { Suspense, useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import { AnimatePresence, motion } from 'framer-motion'
import { Roadster, type RoadsterConfig } from './components/Roadster'
import { Configurator } from './components/Configurator'
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
  const [config, setConfig] = useState<RoadsterConfig>({
    paint: '#E31C23',
    contrast: 'chrome',
    wheels: 'silver',
    interior: 'black',
  })
  useLenis()

  useEffect(() => {
    return registerScrollTrigger(setActiveSection)
  }, [])

  useEffect(() => {
    const loadingTimeout = window.setTimeout(() => setIsLoading(false), 12000)
    return () => window.clearTimeout(loadingTimeout)
  }, [])

  return (
    <>
      {isLoading && <Loader />}

      <header className="fixed inset-x-0 top-0 z-20 px-4 py-4 sm:px-8 sm:py-6 md:px-12">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <a href="#exterior" className="flex min-w-0 shrink-0 items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-[#111214] sm:gap-3 sm:text-base">
            <img src="/favicon.svg" alt="Rida Naz logo" className="size-7 object-contain sm:size-8" />
            <span>Roadster</span>
          </a>
          <nav aria-label="Section navigation" className="flex min-w-0 items-center gap-3 overflow-x-auto text-[10px] font-semibold uppercase tracking-[0.12em] text-[#111214]/65 sm:gap-6 sm:text-xs">
            {SECTIONS.map((section) => (
              <a key={section.id} href={`#${section.id}`} className="shrink-0 py-2 transition-colors hover:text-[#e31c23] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#111214]">
                {section.title}
              </a>
            ))}
          </nav>
        </div>
      </header>
      
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Canvas 
          dpr={[1, 1.5]} 
          camera={{ fov: 35, position: [-3.51, 3.03, 5.7] }}
          onCreated={() => setIsLoading(false)}
        >
          <Suspense fallback={null}>
            <Environment preset="studio" />
          </Suspense>
          <Suspense fallback={null}>
            <Roadster config={config} onLoaded={() => setIsLoading(false)} />
          </Suspense>
          <CameraRig />
        </Canvas>
      </div>

      <div id="scroll-root" className="relative z-10">
        {SECTIONS.map((section, i) => (
          <section id={section.id} key={section.id} className="flex h-screen items-center justify-start p-6 pt-24 sm:p-8 sm:pt-28 md:p-12">
            <AnimatePresence>
              {activeSection === i && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                >
                  <div>
                    <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-[#111214] drop-shadow-lg">
                    {section.title}
                    </h2>
                    <p className="text-base sm:text-lg md:text-xl text-[#111214]/80 mt-4 max-w-xs sm:max-w-sm md:max-w-md leading-relaxed">
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
                            <div className="font-mono text-sm font-semibold uppercase tracking-wide text-[#5e6265]">
                              {spec.label}
                            </div>
                            <div className="mt-1 font-mono text-2xl font-bold text-[#111214] sm:text-3xl md:text-4xl">
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

      <Configurator config={config} onChange={setConfig} />

      <footer className="relative z-10 mt-12 border-t border-[#111214]/10 bg-[#f8f7f3]/95 px-6 py-6 backdrop-blur-sm sm:mt-16 sm:px-8 md:mt-20 md:px-12">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 text-xs leading-relaxed text-[#5e6265] sm:flex-row sm:items-center sm:justify-between sm:gap-6">
          <p>
            3D model “Tesla Roadster 2020” by metarex.4d, via Sketchfab, CC-BY-4.0. Built by{' '}
            <a
              href="https://ridanaz.com"
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-[#111214] underline decoration-[#111214]/30 underline-offset-4 transition-colors hover:text-[#e31c23] hover:decoration-[#e31c23] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#111214]"
            >
              Rida Naz
            </a>
            .
          </p>
          <a
            href="https://sketchfab.com/3d-models/tesla-roadster-2020-wwwvecarzcom-fac3d813620f4c4a95da1933c2592069"
            target="_blank"
            rel="noreferrer"
            className="shrink-0 font-semibold text-[#111214] underline decoration-[#111214]/30 underline-offset-4 transition-colors hover:text-[#e31c23] hover:decoration-[#e31c23] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#111214]"
          >
            View source on Sketchfab
          </a>
        </div>
      </footer>
    </>
  )
}
