import { useEffect, useRef, useState } from 'react'
import { gsap, useGSAP } from '../lib/gsap'
import { onReady } from '../lib/ready'
import Media, { hasMedia } from '../components/Media'
import Button from '../components/Button'
import Particles from '../components/Particles'
import { Link } from 'react-router-dom'
import { ArrowRight, PawIcon } from '../components/Icons'
import { categories } from '../data/content'

// Swap to 'hero-background-image' to go back to the original background
const HERO_BG = 'hero-background-image-wide' as const

/** Layered mountain silhouettes, shown until a hero-background-image image is dropped in. */
function Scenery() {
  return (
    <>
      <div data-parallax="0.3" data-parallax-top className="absolute inset-x-[-4%] bottom-[24%] h-[38%]">
        <svg viewBox="0 0 1440 400" preserveAspectRatio="none" className="h-full w-full" aria-hidden="true">
          <defs>
            <linearGradient id="ridge-far" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#a4653a" stopOpacity="0.55" />
              <stop offset="1" stopColor="#2a1a12" stopOpacity="0.9" />
            </linearGradient>
          </defs>
          <path
            d="M0 400V250l110-60 90 40 150-130 120 100 110-50 180 120 130-90 140 70 130-110 160 120 120-60V400Z"
            fill="url(#ridge-far)"
          />
        </svg>
      </div>
      <div data-parallax="0.18" data-parallax-top className="absolute inset-x-[-4%] bottom-[12%] h-[34%]">
        <svg viewBox="0 0 1440 360" preserveAspectRatio="none" className="h-full w-full" aria-hidden="true">
          <defs>
            <linearGradient id="ridge-mid" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#3a2418" />
              <stop offset="1" stopColor="#120c09" />
            </linearGradient>
          </defs>
          <path
            d="M0 360V210l140-90 110 70 150-120 140 110 120-40 170 100 150-80 130 60 150-90 180 110V360Z"
            fill="url(#ridge-mid)"
          />
        </svg>
      </div>
      <div data-parallax="0.06" data-parallax-top className="absolute inset-x-[-4%] bottom-0 h-[30%]">
        <svg viewBox="0 0 1440 300" preserveAspectRatio="none" className="h-full w-full" aria-hidden="true">
          <path
            d="M0 300V170l160-40 120 50 140-70 160 60 170-30 140 60 150-50 150 40 100-20 150 30V300Z"
            fill="#0a0c09"
          />
        </svg>
      </div>
    </>
  )
}

export default function Hero() {
  const root = useRef<HTMLElement>(null)
  const content = useRef<HTMLDivElement>(null)

  // Deliberately no entrance animation: the background photo shows alone
  // first, then the copy and category cards snap in as soon as the loader
  // hands off — no fade, no slide.
  const [ready, setReady] = useState(false)
  useEffect(() => {
    onReady(() => setReady(true))
  }, [])

  useGSAP(
    () => {
      gsap.to('[data-hero-rays]', {
        rotation: 7,
        opacity: 0.6,
        duration: 8,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
      })
      gsap.to('[data-hero-sun]', {
        scale: 1.12,
        opacity: 0.9,
        duration: 5,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
      })

      gsap.to(content.current, {
        y: -90,
        opacity: 0.15,
        ease: 'none',
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: 'bottom 30%',
          scrub: true,
        },
      })

      const layers = gsap.utils.toArray<HTMLElement>('[data-depth]', root.current).map((el) => ({
        x: gsap.quickTo(el, 'x', { duration: 1.4, ease: 'power3.out' }),
        y: gsap.quickTo(el, 'y', { duration: 1.4, ease: 'power3.out' }),
        depth: parseFloat(el.dataset.depth ?? '0.3'),
      }))
      const onMove = (e: MouseEvent) => {
        const nx = e.clientX / window.innerWidth - 0.5
        const ny = e.clientY / window.innerHeight - 0.5
        layers.forEach((l) => {
          l.x(-nx * l.depth * 70)
          l.y(-ny * l.depth * 44)
        })
      }
      window.addEventListener('mousemove', onMove)
      return () => window.removeEventListener('mousemove', onMove)
    },
    { scope: root },
  )

  return (
    <section
      ref={root}
      data-parallax-root
      className="relative flex min-h-[100svh] w-full flex-col overflow-hidden bg-ink"
    >
      {/* Sky */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(70% 60% at 78% 24%, rgba(255,168,84,0.5) 0%, rgba(224,138,69,0.2) 38%, transparent 72%), linear-gradient(180deg, #171310 0%, #2a1a10 46%, #0a0c09 100%)',
        }}
      />
      <div
        data-hero-sun
        className="absolute right-[4%] top-[6%] h-[46vw] w-[46vw] max-h-[620px] max-w-[620px] rounded-full opacity-70 blur-2xl"
        style={{ background: 'radial-gradient(circle, rgba(255,196,120,0.55), transparent 65%)' }}
      />
      <div
        data-hero-rays
        className="absolute -right-[10%] -top-[30%] h-[160%] w-[90%] origin-[70%_20%] opacity-40"
        style={{
          background:
            'conic-gradient(from 195deg at 70% 20%, transparent 0deg, rgba(255,200,130,0.22) 12deg, transparent 26deg, rgba(255,200,130,0.14) 40deg, transparent 58deg)',
        }}
      />

      {!hasMedia(HERO_BG) ? <Scenery /> : null}

      {/* PSD layers: drop hero-background-image / hero-mid / hero-dog / hero-fg into src/assets/images */}
      <div data-parallax="0.32" data-parallax-top className="absolute inset-[-6%]">
        <div data-depth="0.25" className="h-full w-full">
          <Media eager slot={HERO_BG} className="h-full w-full object-cover object-[58%_40%]" />
        </div>
      </div>
      <div data-parallax="0.2" data-parallax-top className="absolute inset-[-6%]">
        <div data-depth="0.5" className="h-full w-full">
          <Media slot="hero-mid" className="h-full w-full object-cover" />
        </div>
      </div>
      <div data-parallax="0.1" data-parallax-top className="absolute inset-[-6%]">
        <div data-depth="0.8" className="h-full w-full">
          <Media slot="hero-dog" className="h-full w-full object-cover" />
        </div>
      </div>
      <div data-parallax="-0.14" data-parallax-top className="absolute inset-[-6%]">
        <div data-depth="1.3" className="h-full w-full">
          <Media slot="hero-fg" className="h-full w-full object-cover" />
        </div>
      </div>

      <Particles count={22} />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ink/80 via-ink/25 to-transparent max-sm:from-ink/75 max-sm:via-ink/60 max-sm:to-ink/50" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/85 via-transparent to-ink/40" />

      {/* Signature ring */}
      <div
        data-hero-ring
        className="pointer-events-none absolute -left-44 top-[44%] hidden h-[560px] w-[560px] -translate-y-1/2 rounded-full border border-cream/15 lg:block"
      />

      {/* Copy — the outer node is GSAP's scroll-fade target; the inner one is the
          instant reveal gate. Kept on separate elements so GSAP's inline opacity
          (from the scroll tween) can never fight the React-driven reveal class. */}
      <div
        ref={content}
        className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-6 pb-4 pt-28 sm:px-10 lg:px-16 lg:pt-[max(5.5rem,13vh)]"
      >
        <div className={`max-w-3xl lg:w-[72%] lg:max-w-none ${ready ? 'opacity-100' : 'opacity-0'}`}>
          <p className="flex items-center gap-4 text-[11px] uppercase tracking-[0.34em] text-cream/75">
            <span className="h-px w-10 bg-gold" />
            Handcrafted in Hyderabad
          </p>

          <h1 className="mt-[max(0.75rem,2vh)] font-display text-[clamp(2.2rem,min(4.3vw,7.6vh),4.2rem)] font-medium leading-[1.04] tracking-tight text-cream">
            <span className="block">Designed for Dogs.</span>
            <span className="block">Obsessed Over</span>
            <span className="block italic text-gold-soft">by Their Humans.</span>
          </h1>

          <p className="mt-[max(1rem,2.4vh)] max-w-md text-[15px] leading-relaxed text-cream/70 [@media(max-height:640px)]:hidden">
            Couture that wags, collars that turn heads and beds worth the nap — handcrafted for
            dogs who never do ordinary.
          </p>

          <div className="mt-[max(1.25rem,3.2vh)]">
            <Button variant="circle">Shop the Collection</Button>
          </div>
        </div>
      </div>

      {/* Handwritten note */}
      <div
        className={`pointer-events-none absolute right-[10%] top-[24%] z-10 hidden -rotate-6 font-script text-6xl leading-[0.85] text-cream/90 lg:block ${ready ? 'opacity-100' : 'opacity-0'}`}
      >
        Good Dogs
        <br />
        Deserve
        <br />
        Great Style
        <PawIcon size={18} className="ml-2 inline text-gold" />
      </div>

      {/* Category strip, floating over the same photograph. Card size follows window height so the row always fits. */}
      <div
        className={`relative z-10 w-full px-6 pb-6 sm:px-10 lg:px-8 lg:pb-[max(1.5rem,4.5vh)] ${ready ? 'opacity-100' : 'opacity-0'}`}
      >
        <div className="mx-auto w-full lg:max-w-[min(1275px,calc(173vh_+_5rem))]">
          <div className="mb-3 flex items-center gap-4">
            <span className="text-[11px] uppercase tracking-[0.34em] text-cream/70">
              Shop by Category
            </span>
            <span className="h-px w-20 bg-cream/30" />
          </div>

          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6 lg:gap-4">
          {categories.map((c) => (
            <li key={c.title}>
              <Link
                to={`/collections/${c.slug}`}
                className="glass group relative flex aspect-[11/8] flex-col justify-between overflow-hidden rounded-2xl p-4 transition-all duration-500 hover:-translate-y-2 hover:border-gold/50 hover:shadow-[0_24px_60px_-20px] hover:shadow-gold/40 lg:p-5"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${c.tint} to-transparent opacity-80`} />
                <Media
                  eager
                  slot={c.heroSlot}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/40 via-40% to-transparent" />

                {!hasMedia(c.heroSlot) ? (
                  <span className="relative flex h-10 w-10 items-center justify-center rounded-full border border-gold/40 bg-ink/40 text-gold transition-colors duration-500 group-hover:bg-gold group-hover:text-ink">
                    <c.icon size={18} />
                  </span>
                ) : null}

                <span className="relative mt-auto flex items-end justify-between gap-2">
                  <span className="font-display text-[15px] leading-tight text-cream drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)] lg:text-base">
                    {c.lines[0]}
                    {c.lines[1] ? (
                      <>
                        <br />
                        {c.lines[1]}
                      </>
                    ) : null}
                  </span>
                  <ArrowRight
                    size={15}
                    className="mb-0.5 shrink-0 text-gold transition-transform duration-500 group-hover:translate-x-1.5"
                  />
                </span>
              </Link>
            </li>
          ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
