import { Suspense, useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import { AnimatePresence, motion } from 'framer-motion'
import { Roadster } from './components/Roadster'
import { CameraRig } from './components/CameraRig'
import { useLenis } from './hooks/useLenis'
import { registerScrollTrigger } from './lib/scrollState'

const SECTIONS = [
  { id: 'exterior', title: 'Exterior', copy: 'Sculpted for speed.' },
  { id: 'performance', title: 'Performance', copy: '0–60 in 1.9 seconds.' },
  { id: 'interior', title: 'Interior', copy: 'A cabin built for the driver.' },
]

export default function App() {
  const [activeSection, setActiveSection] = useState(0)
  useLenis()

  useEffect(() => {
    return registerScrollTrigger(setActiveSection)
  }, [])

  return (
    <>
      <div className="fixed inset-0 -z-10">
        <Canvas dpr={[1, 2]} camera={{ fov: 35, position: [-3.51, 3.03, 5.7] }}>
          <Suspense fallback={null}>
            <Environment preset="studio" />
            <Roadster />
            <CameraRig />
          </Suspense>
        </Canvas>
      </div>

      <div id="scroll-root" className="relative">
        {SECTIONS.map((section, i) => (
          <section key={section.id} className="h-screen flex items-end p-6 sm:p-8 md:p-12">
            <AnimatePresence>
              {activeSection === i && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                >
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-black drop-shadow-lg">
                    {section.title}
                  </h2>
                  <p className="text-sm sm:text-base text-black/80 mt-2 max-w-xs sm:max-w-sm md:max-w-md">{section.copy}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </section>
        ))}
      </div>
    </>
  )
}
