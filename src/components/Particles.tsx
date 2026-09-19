import { useRef } from 'react'
import { gsap, useGSAP } from '../lib/gsap'

interface ParticlesProps {
  count?: number
  className?: string
}

/** Drifting golden embers. Positions are derived from the index so renders stay pure. */
export default function Particles({ count = 18, className = '' }: ParticlesProps) {
  const root = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      gsap.utils.toArray<HTMLElement>('[data-ember]', root.current).forEach((el, i) => {
        gsap.set(el, { opacity: 0 })
        gsap.to(el, {
          y: -(80 + ((i * 37) % 160)),
          x: ((i % 2 ? 1 : -1) * (20 + ((i * 13) % 50))),
          opacity: 0.85,
          duration: 5 + ((i * 7) % 6),
          delay: (i * 0.55) % 6,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
        })
      })
    },
    { scope: root },
  )

  return (
    <div
      ref={root}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      {Array.from({ length: count }, (_, i) => {
        const size = 2 + ((i * 5) % 4)
        return (
          <span
            key={i}
            data-ember
            className="absolute rounded-full bg-gold-soft shadow-[0_0_12px_2px] shadow-gold/70"
            style={{
              left: `${(i * 61.8) % 100}%`,
              top: `${20 + ((i * 37.3) % 75)}%`,
              width: size,
              height: size,
            }}
          />
        )
      })}
    </div>
  )
}
