import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment, OrbitControls } from '@react-three/drei'
import { Roadster } from './components/Roadster'

export default function App() {
  return (
    <div className="w-screen h-screen">

      <Canvas dpr={[1, 2]} camera={{ fov: 35, position: [5, 2, 5] }}>
        <Suspense fallback={null}>
          <Environment preset="studio" />
          <Roadster />
          <OrbitControls /> {/* temporary — for eyeballing angles, remove once camera shots are locked */}
        </Suspense>
      </Canvas>
    </div>
  )
}
