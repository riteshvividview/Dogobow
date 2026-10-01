import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { BoneIcon, PawIcon } from './Icons'

/**
 * Replaces the native pointer with an animated bone (over the hero) or paw
 * (everywhere else) icon that trails the cursor with a light spring. Desktop
 * only — touch devices keep their native behaviour untouched.
 */
export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false)
  const [inHero, setInHero] = useState(false)
  const [interactive, setInteractive] = useState(false)
  const [down, setDown] = useState(false)
  const [visible, setVisible] = useState(false)

  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const springX = useSpring(x, { stiffness: 500, damping: 34, mass: 0.5 })
  const springY = useSpring(y, { stiffness: 500, damping: 34, mass: 0.5 })

  const inHeroRef = useRef(false)
  const interactiveRef = useRef(false)
  const visibleRef = useRef(false)

  useEffect(() => {
    const isTouch = window.matchMedia('(pointer: coarse)').matches
    if (isTouch) return
    setEnabled(true)
    document.documentElement.classList.add('bone-cursor-active')

    const onMove = (e: MouseEvent) => {
      if (!visibleRef.current) {
        visibleRef.current = true
        setVisible(true)
      }
      x.set(e.clientX)
      y.set(e.clientY)

      const target = e.target as Element | null
      const hero = !!target?.closest('[data-bone-cursor]')
      if (hero !== inHeroRef.current) {
        inHeroRef.current = hero
        setInHero(hero)
      }

      const clickable = !!target?.closest('a, button, [role="button"], input, textarea, select')
      if (clickable !== interactiveRef.current) {
        interactiveRef.current = clickable
        setInteractive(clickable)
      }
    }
    const onDown = () => setDown(true)
    const onUp = () => setDown(false)
    const onLeave = () => {
      visibleRef.current = false
      setVisible(false)
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)
    document.documentElement.addEventListener('mouseleave', onLeave)

    return () => {
      document.documentElement.classList.remove('bone-cursor-active')
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
      document.documentElement.removeEventListener('mouseleave', onLeave)
    }
  }, [x, y])

  if (!enabled) return null

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[999]"
      style={{ x: springX, y: springY }}
    >
      <motion.div
        className={`-translate-x-1/2 -translate-y-1/2 ${inHero ? 'text-cream drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)]' : 'text-gold drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]'}`}
        animate={{
          opacity: visible ? 1 : 0,
          scale: down ? 0.8 : interactive ? 1.35 : 1,
          rotate: inHero ? [-18, 18, -18] : [-14, 14, -14],
        }}
        transition={{
          opacity: { duration: 0.15, ease: 'easeOut' },
          scale: { duration: 0.18, ease: 'easeOut' },
          rotate: { duration: inHero ? 1.6 : 1.9, repeat: Infinity, ease: 'easeInOut' },
        }}
      >
        {inHero ? <BoneIcon size={38} /> : <PawIcon size={22} />}
      </motion.div>
    </motion.div>
  )
}
