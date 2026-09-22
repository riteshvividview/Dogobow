import { useEffect, useRef, useState } from 'react'
import { gsap } from '../lib/gsap'
import { markReady } from '../lib/ready'
import { allImageUrls, mediaUrl } from './Media'
import Logo from './Logo'
import Particles from './Particles'
import { PawIcon } from './Icons'
import { categories } from '../data/content'

const SESSION_KEY = 'dogobow-intro-seen'
const MIN_MS = 2400
const MAX_MS = 8000

const CRITICAL = ['hero-background-image-wide', 'hero-background-image', ...categories.map((c) => c.heroSlot)]

function load(url: string) {
  return new Promise<void>((resolve) => {
    const img = new Image()
    img.onload = () => (img.decode ? img.decode().catch(() => {}).finally(resolve) : resolve())
    img.onerror = () => resolve()
    img.src = url
  })
}

/** Quietly warm every other image after the page is open so hovers and scrolling feel instant. */
function warmRest(skip: Set<string>) {
  const queue = allImageUrls().filter((u) => !skip.has(u))
  const step = () => {
    const batch = queue.splice(0, 2)
    if (!batch.length) return
    Promise.all(batch.map(load)).then(() =>
      'requestIdleCallback' in window ? window.requestIdleCallback(step) : setTimeout(step, 150),
    )
  }
  step()
}

export default function Preloader() {
  const skip = typeof window !== 'undefined' && sessionStorage.getItem(SESSION_KEY) === '1'
  const [gone, setGone] = useState(skip)
  const root = useRef<HTMLDivElement>(null)
  const counter = useRef<HTMLSpanElement>(null)
  const ring = useRef<SVGCircleElement>(null)
  const bar = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (skip) {
      markReady()
      window.setTimeout(() => warmRest(new Set()), 2500)
      return
    }
    const html = document.documentElement
    html.classList.add('is-loading')
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const state = { shown: 0, target: 0, done: false }
    const startedAt = performance.now()
    const critical = CRITICAL.map((n) => mediaUrl(n)).filter((u): u is string => Boolean(u))
    const total = critical.length + 2 // images + fonts + first paint
    let finished = 0
    const bump = () => {
      finished++
      state.target = Math.min(1, finished / total)
    }

    critical.forEach((u) => load(u).then(bump))
    ;(document.fonts ? document.fonts.ready : Promise.resolve()).then(bump)
    requestAnimationFrame(() => requestAnimationFrame(bump))

    const setUI = (v: number) => {
      if (counter.current) counter.current.textContent = String(Math.round(v * 100)).padStart(2, '0')
      if (ring.current) ring.current.style.strokeDashoffset = String(1 - v)
      if (bar.current) bar.current.style.transform = `scaleX(${v})`
    }
    setUI(0)

    const scope = root.current
    const intro = gsap.timeline({ defaults: { ease: 'power3.out' } })
    intro
      .fromTo('[data-pre-logo]', { autoAlpha: 0, scale: 0.86, filter: 'blur(14px)' }, { autoAlpha: 1, scale: 1, filter: 'blur(0px)', duration: 1.3 }, 0.1)
      .fromTo('[data-pre-glow]', { autoAlpha: 0, scale: 0.6 }, { autoAlpha: 1, scale: 1, duration: 1.8 }, 0)
      .fromTo('[data-pre-line]', { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.12 }, 0.5)
    const glowPulse = gsap.to('[data-pre-glow]', { scale: 1.12, duration: 3, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: 1.8 })
    const pawBob = gsap.to('[data-pre-paw]', { y: -6, rotation: -8, duration: 1.4, yoyo: true, repeat: -1, ease: 'sine.inOut', stagger: 0.25 })

    let exitTl: gsap.core.Timeline | null = null
    const exit = () => {
      if (state.done) return
      state.done = true
      sessionStorage.setItem(SESSION_KEY, '1')
      setUI(1)
      glowPulse.kill()
      exitTl = gsap.timeline({
        // Fires once the curtain has fully cleared the screen — the page is
        // sitting there with just its background, nothing has animated in
        // yet. That's the moment Hero is allowed to start its own (separately
        // delayed) entrance, not partway through the curtain sliding away.
        onComplete: () => {
          pawBob.kill()
          html.classList.remove('is-loading')
          setGone(true)
          window.dispatchEvent(new Event('resize'))
          warmRest(new Set(critical))
          markReady()
        },
      })
      if (reduce) {
        exitTl.to(scope, { autoAlpha: 0, duration: 0.4 }).add(markReady, 0)
        return
      }
      exitTl
        .to('[data-pre-stage]', { scale: 1.08, autoAlpha: 0, y: -30, duration: 0.7, ease: 'power2.in' }, 0.35)
        .to('[data-pre-top]', { yPercent: -101, duration: 1.15, ease: 'power4.inOut' }, 0.95)
        .to('[data-pre-bottom]', { yPercent: 101, duration: 1.15, ease: 'power4.inOut' }, 0.95)
    }

    const tick = () => {
      const now = performance.now() - startedAt
      // Displayed value eases toward real progress and never runs ahead of a time floor.
      const timeCap = Math.min(1, now / MIN_MS)
      const target = now > MAX_MS ? 1 : Math.min(state.target, timeCap)
      state.shown += (target - state.shown) * 0.09
      if (target === 1 && state.shown > 0.995) state.shown = 1
      setUI(state.shown)
      if (state.shown >= 1) {
        gsap.ticker.remove(tick)
        window.setTimeout(exit, 250)
      }
    }
    gsap.ticker.add(tick)

    return () => {
      gsap.ticker.remove(tick)
      intro.kill()
      glowPulse.kill()
      pawBob.kill()
      exitTl?.kill()
      html.classList.remove('is-loading')
    }
  }, [skip])

  if (gone) return null

  return (
    <div ref={root} className="fixed inset-0 z-[100] overflow-hidden" role="status" aria-live="polite" aria-label="Loading">
      <div data-pre-top className="absolute inset-x-0 top-0 h-1/2 bg-ink" />
      <div data-pre-bottom className="absolute inset-x-0 bottom-0 h-1/2 bg-ink" />

      <div data-pre-stage className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
        <div
          data-pre-glow
          className="pointer-events-none absolute h-[70vmin] w-[70vmin] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(217,178,106,0.22), rgba(224,138,69,0.08) 45%, transparent 70%)' }}
        />
        <Particles count={14} />

        <div data-pre-logo className="relative flex h-[250px] w-[250px] items-center justify-center sm:h-[300px] sm:w-[300px]">
          <svg viewBox="0 0 100 100" className="absolute inset-0 -rotate-90" aria-hidden="true">
            <defs>
              <linearGradient id="pre-gold" x1="0" x2="1" y1="0" y2="1">
                <stop offset="0" stopColor="#eacea0" />
                <stop offset="1" stopColor="#d9b26a" />
              </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="48" fill="none" stroke="rgba(247,243,234,0.1)" strokeWidth="0.6" />
            <circle
              ref={ring}
              cx="50"
              cy="50"
              r="48"
              fill="none"
              stroke="url(#pre-gold)"
              strokeWidth="1.1"
              strokeLinecap="round"
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={1}
            />
          </svg>
          <Logo className="h-[128px] sm:h-[150px]" />
        </div>

        <div className="relative mt-9 flex items-baseline gap-1 font-display text-cream">
          <span ref={counter} data-pre-line className="text-[clamp(3.4rem,8vw,5.6rem)] leading-none tabular-nums">
            00
          </span>
          <span data-pre-line className="text-2xl italic text-gold-soft">
            %
          </span>
        </div>

        <p data-pre-line className="relative mt-5 text-[11px] uppercase tracking-[0.42em] text-cream/75">
          Loading your experience
        </p>
        <p data-pre-line className="relative mt-2 flex items-center gap-2 font-script text-[2rem] leading-none text-gold-soft">
          <PawIcon data-pre-paw size={14} className="text-gold" />
          please wait a moment
          <PawIcon data-pre-paw size={14} className="text-gold" />
        </p>

        <span data-pre-line className="relative mt-8 block h-px w-56 overflow-hidden bg-cream/10 sm:w-72">
          <span ref={bar} className="absolute inset-0 origin-left bg-gradient-to-r from-gold-soft to-gold" style={{ transform: 'scaleX(0)' }} />
        </span>
      </div>
    </div>
  )
}
