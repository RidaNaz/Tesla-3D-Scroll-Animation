import { useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { scrollState } from '../lib/scrollState'

const EXTERIOR_POS = new THREE.Vector3(-3.51, 3.03, 5.70)
const PERFORMANCE_POS = new THREE.Vector3(2.14, 1.41, 3.30)
const INTERIOR_POS = new THREE.Vector3(4.74, 1.12, -0.04)

// Rough look-at points — these weren't captured (only camera position was),
// so tune these visually once you see it animate; adjust freely.
const EXTERIOR_LOOK = new THREE.Vector3(0, 0.6, 0)
const PERFORMANCE_LOOK = new THREE.Vector3(0.6, 0.3, 1.8)
const INTERIOR_LOOK = new THREE.Vector3(0, 1.0, 0)

const tmpPos = new THREE.Vector3()
const tmpLook = new THREE.Vector3()

export function CameraRig() {
  const { camera } = useThree()

  useEffect(() => {
    const updateCameraFov = () => {
      const fov = window.innerWidth < 768 ? 45 : 35

      // eslint-disable-next-line react-hooks/immutability -- mutating the live THREE.Camera is intentional in R3F
      if (camera instanceof THREE.PerspectiveCamera && camera.fov !== fov) {
        camera.fov = fov
        camera.updateProjectionMatrix()
      }
    }

    updateCameraFov()
    window.addEventListener('resize', updateCameraFov)
    return () => window.removeEventListener('resize', updateCameraFov)
  }, [camera])

  useFrame(() => {
    const progress = scrollState.progress
    let posA, posB, lookA, lookB, t

    if (progress <= 1 / 3) {
      t = progress / (1 / 3)
      posA = EXTERIOR_POS; posB = PERFORMANCE_POS
      lookA = EXTERIOR_LOOK; lookB = PERFORMANCE_LOOK
    } else if (progress <= 2 / 3) {
      t = (progress - 1 / 3) / (1 / 3)
      posA = PERFORMANCE_POS; posB = PERFORMANCE_POS // hold steady during this section
      lookA = PERFORMANCE_LOOK; lookB = PERFORMANCE_LOOK
    } else {
      t = (progress - 2 / 3) / (1 / 3)
      posA = PERFORMANCE_POS; posB = INTERIOR_POS
      lookA = PERFORMANCE_LOOK; lookB = INTERIOR_LOOK
    }

    tmpPos.lerpVectors(posA, posB, t)
    tmpLook.lerpVectors(lookA, lookB, t)

    camera.position.lerp(tmpPos, 0.15)
    camera.lookAt(tmpLook)
  })

  return null
}
