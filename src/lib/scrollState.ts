import gsap from 'gsap'
import { invalidate } from '@react-three/fiber'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Mutable, outside React — CameraRig reads this every frame without triggering re-renders
export const scrollState = { progress: 0 }

export function registerScrollTrigger(onSectionChange: (index: number) => void) {
  let activeSection = -1

  const trigger = ScrollTrigger.create({
    trigger: '#scroll-root',
    start: 'top top',
    end: 'bottom bottom',
    scrub: true,
    onUpdate: (self) => {
      scrollState.progress = self.progress
      invalidate() // scroll changed — tell R3F a new frame is needed
      const section = Math.min(2, Math.floor(self.progress * 3))
      if (section !== activeSection) {
        activeSection = section
        onSectionChange(section)
      }
    },
  })

  ScrollTrigger.refresh()
  scrollState.progress = trigger.progress
  invalidate()
  const initialSection = Math.min(2, Math.floor(trigger.progress * 3))
  activeSection = initialSection
  onSectionChange(initialSection)

  return () => trigger.kill()
}
