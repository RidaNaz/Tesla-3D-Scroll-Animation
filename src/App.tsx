import { Suspense, useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import { AnimatePresence, motion } from 'framer-motion'
import { Roadster, type RoadsterConfig } from './components/Roadster'
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

  return (
    <>
      {isLoading && <Loader />}

      <header className="fixed inset-x-0 top-0 z-20 px-4 py-4 sm:px-8 sm:py-6 md:px-12">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <a href="#exterior" className="flex min-w-0 shrink-0 items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-black sm:gap-3 sm:text-base">
            <img src="/favicon.svg" alt="Rida Naz logo" className="size-7 object-contain sm:size-8" />
            <span>Roadster</span>
          </a>
          <nav aria-label="Section navigation" className="flex min-w-0 items-center gap-3 overflow-x-auto text-[10px] font-semibold uppercase tracking-[0.12em] text-black/65 sm:gap-6 sm:text-xs">
            {SECTIONS.map((section) => (
              <a key={section.id} href={`#${section.id}`} className="shrink-0 py-2 transition-colors hover:text-black focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black">
                {section.title}
              </a>
            ))}
          </nav>
        </div>
      </header>
      
      <div className="fixed inset-0 -z-10">
        <Canvas 
          dpr={[1, 2]} 
          camera={{ fov: 35, position: [-3.51, 3.03, 5.7] }}
          onCreated={() => setIsLoading(false)}
        >
          <Suspense fallback={null}>
            <Environment preset="studio" />
            <Roadster config={config} />
            <CameraRig />
          </Suspense>
        </Canvas>
      </div>

      <div id="scroll-root" className="relative">
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

      <aside className="fixed bottom-5 right-5 z-20 w-[min(19rem,calc(100vw-2.5rem))] rounded-2xl border border-black/10 bg-[#f5f3ee]/95 p-5 text-black shadow-2xl shadow-black/10 backdrop-blur-md sm:bottom-8 sm:right-8" aria-label="Roadster configurator">
        <div className="flex items-start justify-between gap-4 border-b border-black/10 pb-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/45">Your Roadster</p>
            <h2 className="mt-1 text-lg font-bold tracking-tight">Configure the finish</h2>
          </div>
          <span className="mt-1 size-3 shrink-0 rounded-full" style={{ backgroundColor: config.paint }} aria-label={`Selected paint ${config.paint}`} />
        </div>

        <div className="space-y-5 pt-4">
          <fieldset>
            <legend className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-black/55">Paint</legend>
            <div className="flex gap-3">
              {[['#E31C23', 'Inferno'], ['#F2F1ED', 'Pearl'], ['#1C1E21', 'Obsidian'], ['#4B555B', 'Titanium']].map(([color, name]) => (
                <button key={color} type="button" title={name} aria-label={`${name} paint`} aria-pressed={config.paint === color} onClick={() => setConfig((current) => ({ ...current, paint: color }))} className={`size-8 rounded-full border-2 shadow-sm transition-transform hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black ${config.paint === color ? 'scale-110 border-black' : 'border-white'}`} style={{ backgroundColor: color }} />
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-black/55">Contrast package</legend>
            <div className="grid grid-cols-2 gap-2">
              {(['chrome', 'blackout'] as const).map((option) => (
                <button key={option} type="button" aria-pressed={config.contrast === option} onClick={() => setConfig((current) => ({ ...current, contrast: option }))} className={`rounded-lg border px-3 py-2 text-left text-xs font-semibold capitalize transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black ${config.contrast === option ? 'border-black bg-black text-white' : 'border-black/15 bg-white/50 hover:border-black/40'}`}>
                  {option}
                </button>
              ))}
            </div>
          </fieldset>

          <div className="grid grid-cols-2 gap-4">
            <fieldset>
              <legend className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-black/55">Wheels</legend>
              <select value={config.wheels} onChange={(event) => setConfig((current) => ({ ...current, wheels: event.target.value as RoadsterConfig['wheels'] }))} className="w-full rounded-lg border border-black/15 bg-white/60 px-2 py-2 text-xs font-semibold outline-none focus:border-black">
                <option value="silver">Silver</option>
                <option value="dark">Dark alloy</option>
              </select>
            </fieldset>
            <fieldset>
              <legend className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-black/55">Interior</legend>
              <select value={config.interior} onChange={(event) => setConfig((current) => ({ ...current, interior: event.target.value as RoadsterConfig['interior'] }))} className="w-full rounded-lg border border-black/15 bg-white/60 px-2 py-2 text-xs font-semibold outline-none focus:border-black">
                <option value="black">Onyx</option>
                <option value="cream">Cream</option>
              </select>
            </fieldset>
          </div>
        </div>
      </aside>

      <footer className="relative z-10 mt-12 border-t border-black/10 bg-white/90 px-6 py-6 backdrop-blur-sm sm:mt-16 sm:px-8 md:mt-20 md:px-12">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 text-xs leading-relaxed text-black/60 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
          <p>
            3D model “Tesla Roadster 2020” by metarex.4d, via Sketchfab, CC-BY-4.0. Built by{' '}
            <a
              href="https://ridanaz.com"
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-black underline decoration-black/30 underline-offset-4 transition-colors hover:decoration-black focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black"
            >
              Rida Naz
            </a>
            .
          </p>
          <a
            href="https://sketchfab.com/3d-models/tesla-roadster-2020-wwwvecarzcom-fac3d813620f4c4a95da1933c2592069"
            target="_blank"
            rel="noreferrer"
            className="shrink-0 font-semibold text-black underline decoration-black/30 underline-offset-4 transition-colors hover:decoration-black focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black"
          >
            View source on Sketchfab
          </a>
        </div>
      </footer>
    </>
  )
}
