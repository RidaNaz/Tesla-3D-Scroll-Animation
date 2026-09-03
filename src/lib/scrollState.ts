import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Mutable, outside React — CameraRig reads this every frame without triggering re-renders
export const scrollState = { progress: 0 }

export function registerScrollTrigger(onSectionChange: (index: number) => void) {
  const trigger = ScrollTrigger.create({
    trigger: '#scroll-root',
    start: 'top top',
    end: 'bottom bottom',
    scrub: true,
    onUpdate: (self) => {
      scrollState.progress = self.progress
      const section = Math.min(2, Math.floor(self.progress * 3))
      onSectionChange(section)
    },
  })
  return () => trigger.kill()
}
