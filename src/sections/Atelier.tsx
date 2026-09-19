import { useRef, useState } from 'react'
import { gsap, useGSAP } from '../lib/gsap'
import Media, { mediaUrl } from '../components/Media'
import Button from '../components/Button'
import Marquee from '../components/Marquee'
import Particles from '../components/Particles'
import { PauseIcon, PawIcon, PlayIcon } from '../components/Icons'
import { garments, promises } from '../data/content'

const FILM = mediaUrl('Dogs-dress-changing-videos')

type FilmMode = 'preview' | 'playing' | 'paused'

export default function Atelier() {
  const root = useRef<HTMLElement>(null)
  const panel = useRef<HTMLDivElement>(null)
  const video = useRef<HTMLVideoElement>(null)
  const playBtn = useRef<HTMLSpanElement>(null)
  const playLabel = useRef<HTMLSpanElement>(null)
  const [mode, setMode] = useState<FilmMode>('preview')

  const toggleFilm = () => {
    const v = video.current
    if (!v) return
    if (mode === 'playing') {
      v.pause()
      setMode('paused')
    } else if (mode === 'paused') {
      v.play().catch(() => {})
      setMode('playing')
    } else {
      v.muted = false
      v.loop = false
      v.currentTime = 0
      v.play().catch(() => {})
      setMode('playing')
    }
  }

  const filmEnded = () => {
    const v = video.current
    if (!v) return
    v.muted = true
    v.loop = true
    v.play().catch(() => {})
    setMode('preview')
  }

  useGSAP(
    () => {
      const cleanups: Array<() => void> = []
      gsap.to('[data-pulse]', {
        scale: 1.55,
        opacity: 0,
        duration: 2.2,
        stagger: 0.9,
        repeat: -1,
        ease: 'power2.out',
      })
      const btn = playBtn.current
      const area = panel.current
      if (btn && area) {
        const xTo = gsap.quickTo(btn, 'x', { duration: 0.55, ease: 'power3.out' })
        const yTo = gsap.quickTo(btn, 'y', { duration: 0.55, ease: 'power3.out' })
        const follow = (e: MouseEvent) => {
          const r = btn.getBoundingClientRect()
          const restX = r.left + r.width / 2 - (gsap.getProperty(btn, 'x') as number)
          const restY = r.top + r.height / 2 - (gsap.getProperty(btn, 'y') as number)
          xTo(e.clientX - restX)
          yTo(e.clientY - restY)
        }
        const enter = () => {
          gsap.to(btn, { scale: 1.15, duration: 0.4, ease: 'power3.out' })
          gsap.to(playLabel.current, { autoAlpha: 0, duration: 0.3 })
        }
        const leave = () => {
          xTo(0)
          yTo(0)
          gsap.to(btn, { scale: 1, duration: 0.5, ease: 'power3.out' })
          gsap.to(playLabel.current, { autoAlpha: 1, duration: 0.4, delay: 0.2 })
        }
        area.addEventListener('mousemove', follow)
        area.addEventListener('mouseenter', enter)
        area.addEventListener('mouseleave', leave)
        cleanups.push(() => {
          area.removeEventListener('mousemove', follow)
          area.removeEventListener('mouseenter', enter)
          area.removeEventListener('mouseleave', leave)
        })
      }

      gsap.to('[data-float]', {
        y: -14,
        rotation: -1.5,
        duration: 3.6,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
      })
      return () => cleanups.forEach((fn) => fn())
    },
    { scope: root },
  )

  return (
    <section ref={root} data-parallax-root className="relative isolate overflow-hidden bg-ink">
      <div className="grid grid-cols-1 lg:min-h-[700px] lg:grid-cols-[0.7fr_1.4fr_1fr_0.95fr]">
        {/* A — portrait */}
        <div className="relative z-10 min-h-[200px] overflow-hidden bg-gradient-to-br from-[#3a2314] via-[#1a120d] to-ink lg:min-h-0">
          <div
            data-parallax="0.16"
            className="absolute -inset-x-[10%] -inset-y-[10%]"
          >
            <Media slot="atelier-portrait" className="h-full w-full object-cover" />
          </div>
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(70% 50% at 20% 55%, rgba(224,138,69,0.35), transparent 70%)',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-ink/90" />
          <span
            data-reveal
            className="absolute bottom-10 left-7 rotate-180 whitespace-nowrap text-[10px] uppercase tracking-[0.42em] text-cream/55 [writing-mode:vertical-rl]"
          >
            Handcrafted · Hyderabad
          </span>
          <PawIcon
            size={22}
            data-float
            className="absolute right-8 top-10 text-gold/70"
          />
        </div>

        {/* B — the atelier */}
        <div className="relative z-[15] flex flex-col justify-center overflow-hidden bg-ink px-6 py-16 sm:px-10 lg:pl-14 lg:pr-[14%]">
          <div
            data-parallax="-0.12"
            className="pointer-events-none absolute -right-20 top-10 h-72 w-72 rounded-full opacity-60 blur-3xl"
            style={{ background: 'radial-gradient(circle, rgba(217,178,106,0.25), transparent 70%)' }}
          />
          <Media
            slot="atelier-fabrics"
            data-parallax="0.14"
            className="pointer-events-none absolute -right-10 bottom-0 w-[70%] object-contain opacity-90"
          />

          <div className="relative">
            <p data-reveal className="text-[11px] uppercase tracking-[0.34em] text-gold">
              The Atelier
            </p>
            <h2
              data-split
              className="mt-5 font-display text-[clamp(2rem,3.6vw,3.4rem)] leading-[1.08] text-cream"
            >
              Stitched by Hand.
              <br />
              Styled with <span className="italic text-gold-soft">Soul.</span>
            </h2>
            <p data-reveal className="mt-6 max-w-md text-[15px] leading-relaxed text-cream/65">
              Every tuxedo, sherwani and raincoat is cut, stitched and finished by artisans who
              obsess over the fit — because your dog deserves more than off-the-rack.
            </p>
            <div data-reveal className="mt-8">
              <Button variant="outline">Explore Couture</Button>
            </div>
          </div>

          <Marquee
            items={garments}
            duration={50}
            className="relative mt-12 border-y border-cream/10 py-4"
            itemClassName="px-6 font-display text-lg italic text-cream/70"
            separator={<PawIcon size={12} className="text-gold" />}
          />
        </div>

        {/* C — joy */}
        <div
          ref={panel}
          role="button"
          tabIndex={0}
          aria-label={mode === 'playing' ? 'Pause the atelier film' : 'Play the atelier film'}
          onClick={toggleFilm}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              toggleFilm()
            }
          }}
          className="relative z-20 min-h-[420px] cursor-pointer overflow-hidden lg:-ml-[10%] lg:-mr-[12%] lg:min-h-0 lg:[clip-path:polygon(12.6%_0,100%_0,100%_100%,0_100%)]">
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(60% 45% at 55% 30%, rgba(255,236,190,0.9), transparent 70%), linear-gradient(165deg, #f0dcb8 0%, #dba86b 48%, #7a4f2b 100%)',
            }}
          />
          <div data-parallax="0.18" className="absolute -inset-y-[10%] inset-x-0">
            {FILM ? (
              <video
                ref={video}
                src={FILM}
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                onEnded={filmEnded}
                className="h-full w-full object-cover"
              />
            ) : (
              <Media slot="atelier-joy" className="h-full w-full object-cover" />
            )}
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-ink/55 via-transparent to-transparent" />

          <p
            data-reveal
            className="absolute left-[24%] top-10 lg:left-[17.8%] -rotate-6 font-script text-6xl leading-[0.85] text-cream drop-shadow-[0_2px_10px_rgba(0,0,0,0.55)]"
          >
            Real Dogs.
            <br />
            Real Joy.
            <PawIcon size={16} className="ml-2 inline" />
          </p>

          <div className="pointer-events-none absolute inset-y-0 left-0 right-0 flex flex-col items-center justify-center gap-5 pl-[10%] lg:right-[25.7%] lg:pl-[7.4%]">
            <span
              ref={playBtn}
              className="relative flex h-20 w-20 items-center justify-center rounded-full bg-cream/90 text-ink shadow-[0_20px_60px_-10px_rgba(0,0,0,0.55)]"
            >
              <span data-pulse className="absolute inset-0 rounded-full border border-cream" />
              <span data-pulse className="absolute inset-0 rounded-full border border-cream" />
              {mode === 'playing' ? <PauseIcon size={22} /> : <PlayIcon size={22} className="ml-1" />}
            </span>
            <span
              ref={playLabel}
              className="text-[11px] uppercase tracking-[0.3em] text-cream drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]"
            >
              {mode === 'preview' ? 'Watch the atelier film' : mode === 'playing' ? 'Pause' : 'Resume'}
            </span>
          </div>

          <svg
            className="pointer-events-none absolute inset-y-0 left-0 h-full w-[17%] lg:w-[12.6%]"
            viewBox="0 0 17 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <line
              x1="17"
              y1="0"
              x2="0"
              y2="100"
              stroke="#d9b26a"
              strokeWidth="1.5"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        </div>

        {/* D — promise */}
        <div className="relative z-30 flex flex-col justify-center overflow-hidden bg-forest px-6 py-16 sm:px-10 lg:-ml-[11%] lg:pl-[16%] lg:pr-10 lg:[clip-path:polygon(15%_0,100%_0,100%_100%,0_100%)]">
          <svg
            className="pointer-events-none absolute -right-6 top-0 h-full w-40 opacity-70"
            viewBox="0 0 160 700"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="ribbon" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#3f5c43" />
                <stop offset="1" stopColor="#142016" />
              </linearGradient>
            </defs>
            <path d="M160 40C90 110 120 230 70 320s10 200 90 260V700H160Z" fill="url(#ribbon)" />
            <path
              d="M160 40C90 110 120 230 70 320s10 200 90 260"
              fill="none"
              stroke="#d9b26a"
              strokeOpacity="0.45"
              strokeWidth="1"
            />
          </svg>

          <div className="absolute right-6 top-6 text-gold/70">
            <PawIcon size={26} data-float />
          </div>
          <Particles count={8} />

          <div className="relative">
            <p data-reveal className="text-[11px] uppercase tracking-[0.34em] text-cream/60">
              Our Promise
            </p>
            <h2
              data-split
              className="mt-5 font-display text-[clamp(1.9rem,2.6vw,2.6rem)] leading-[1.1] text-cream"
            >
              Made with Love.
              <br />
              <span className="italic text-gold-soft">Always.</span>
            </h2>

            <ul data-stagger className="mt-8 flex flex-col gap-5">
              {promises.map((p) => (
                <li key={p.label} className="flex items-center gap-4 text-sm text-cream/85">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gold/40 text-gold">
                    <p.icon size={18} />
                  </span>
                  {p.label}
                </li>
              ))}
            </ul>

            <div data-reveal className="mt-9">
              <Button variant="outline">Learn More</Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
