import { useRef } from 'react'
import { gsap, ScrollTrigger, useGSAP } from '../lib/gsap'

interface MarqueeProps {
  items: string[]
  className?: string
  itemClassName?: string
  duration?: number
  separator?: React.ReactNode
}

/** Endless ticker that speeds up with scroll velocity and reverses with scroll direction. */
export default function Marquee({
  items,
  className = '',
  itemClassName = '',
  duration = 42,
  separator,
}: MarqueeProps) {
  const root = useRef<HTMLDivElement>(null)
  const inner = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const tween = gsap.to(inner.current, {
        xPercent: -50,
        repeat: -1,
        duration,
        ease: 'none',
      })

      ScrollTrigger.create({
        trigger: root.current,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: (self) => {
          const boost = 1 + Math.min(Math.abs(self.getVelocity()) / 350, 5)
          gsap.to(tween, { timeScale: self.direction * boost, duration: 0.25, overwrite: true })
          gsap.to(tween, { timeScale: self.direction, duration: 1.2, delay: 0.25 })
        },
      })
    },
    { scope: root },
  )

  return (
    <div ref={root} className={`overflow-hidden ${className}`}>
      <div ref={inner} className="flex w-max will-change-transform">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0 items-center" aria-hidden={copy === 1}>
            {items.map((item) => (
              <span key={item} className="flex items-center">
                <span className={itemClassName}>{item}</span>
                {separator}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
