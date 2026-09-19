import type { RefObject } from 'react'
import { gsap, SplitText, useGSAP } from '../lib/gsap'

/**
 * Declarative scroll animations driven by data attributes, scoped to one
 * container so every section can opt in without writing timelines:
 *
 *  data-reveal           fade + rise on enter (data-reveal-delay="0.2")
 *  data-stagger          children fade + rise in sequence
 *  data-split            headline split into masked lines that rise in
 *  data-parallax="0.3"   scrubbed vertical drift (negative inverts it)
 *  data-magnetic         element leans toward the cursor
 *  [data-parallax-root]  optional ancestor used as the scroll trigger
 */
export function useSiteAnimations(scope: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      const root = scope.current
      if (!root) return

      gsap.utils.toArray<HTMLElement>('[data-reveal]', root).forEach((el) => {
        gsap.from(el, {
          autoAlpha: 0,
          y: 56,
          duration: 1.1,
          delay: Number(el.dataset.revealDelay ?? 0),
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 90%', once: true },
        })
      })

      gsap.utils.toArray<HTMLElement>('[data-stagger]', root).forEach((group) => {
        gsap.from(group.children, {
          autoAlpha: 0,
          y: 64,
          duration: 1,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: group, start: 'top 86%', once: true },
        })
      })

      gsap.utils.toArray<HTMLElement>('[data-split]', root).forEach((el) => {
        SplitText.create(el, {
          type: 'lines',
          mask: 'lines',
          autoSplit: true,
          onSplit: (self) =>
            gsap.from(self.lines, {
              yPercent: 110,
              duration: 1.2,
              stagger: 0.12,
              ease: 'power4.out',
              scrollTrigger: { trigger: el, start: 'top 88%', once: true },
            }),
        })
      })

      gsap.utils.toArray<HTMLElement>('[data-parallax]', root).forEach((el) => {
        const speed = parseFloat(el.dataset.parallax ?? '0.2')
        const trigger = el.closest<HTMLElement>('[data-parallax-root]') ?? el
        const fromTop = el.hasAttribute('data-parallax-top')
        gsap.fromTo(
          el,
          { y: () => (fromTop ? 0 : -speed * window.innerHeight * 0.5) },
          {
            y: () => (fromTop ? speed : speed * 0.5) * window.innerHeight,
            ease: 'none',
            scrollTrigger: {
              trigger,
              start: fromTop ? 'top top' : 'top bottom',
              end: 'bottom top',
              scrub: true,
              invalidateOnRefresh: true,
            },
          },
        )
      })

      const cleanups: Array<() => void> = []
      gsap.utils.toArray<HTMLElement>('[data-magnetic]', root).forEach((el) => {
        const x = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3.out' })
        const y = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3.out' })
        const move = (e: MouseEvent) => {
          const r = el.getBoundingClientRect()
          x((e.clientX - (r.left + r.width / 2)) * 0.25)
          y((e.clientY - (r.top + r.height / 2)) * 0.35)
        }
        const leave = () => {
          x(0)
          y(0)
        }
        el.addEventListener('mousemove', move)
        el.addEventListener('mouseleave', leave)
        cleanups.push(() => {
          el.removeEventListener('mousemove', move)
          el.removeEventListener('mouseleave', leave)
        })
      })

      return () => cleanups.forEach((fn) => fn())
    },
    { scope },
  )
}
