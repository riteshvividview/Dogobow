import { useEffect, useRef, useState } from 'react'
import { gsap, useGSAP } from '../lib/gsap'
import Media, { hasMedia, mediaUrl } from '../components/Media'
import Button from '../components/Button'
import Particles from '../components/Particles'
import { ArrowRight, PawIcon } from '../components/Icons'
import { showcaseCategories } from '../data/content'

const BG_URL = mediaUrl('dog-on-sofa-background')
const FALLBACK_STOPS: Array<[number, string]> = [
  [0, '#606346'],
  [0.48, '#414932'],
  [1, '#2f3a24'],
]

/** Colours along the photo's top edge, mapped through object-cover / 72% x-position so the band above it matches exactly. */
function useTopEdgeStops(): Array<[number, string]> {
  const [stops, setStops] = useState(FALLBACK_STOPS)
  useEffect(() => {
    if (!BG_URL) return
    let alive = true
    const img = new Image()
    img.src = BG_URL
    const run = () => {
      if (!alive || !img.naturalWidth) return
      const c = document.createElement('canvas')
      c.width = img.naturalWidth
      c.height = 8
      const ctx = c.getContext('2d')
      if (!ctx) return
      ctx.drawImage(img, 0, 0)
      const W = window.innerWidth
      const H = Math.max(window.innerHeight - 56, 1)
      const k = Math.max(W / img.naturalWidth, H / img.naturalHeight)
      const drawnW = img.naturalWidth * k
      const offset = (drawnW - W) * 0.72
      const N = 24
      const out: Array<[number, string]> = []
      for (let i = 0; i <= N; i++) {
        const x = (i / N) * W
        const sx = Math.min(img.naturalWidth - 1, Math.max(0, Math.round((x + offset) / k)))
        const d = ctx.getImageData(Math.max(0, sx - 3), 0, 6, 3).data
        let r = 0, g = 0, b = 0
        const n = d.length / 4
        for (let j = 0; j < d.length; j += 4) { r += d[j]; g += d[j + 1]; b += d[j + 2] }
        out.push([i / N, `rgb(${Math.round(r / n)},${Math.round(g / n)},${Math.round(b / n)})`])
      }
      setStops(out)
    }
    if (img.complete) run()
    else img.onload = run
    window.addEventListener('resize', run)
    return () => {
      alive = false
      window.removeEventListener('resize', run)
    }
  }, [])
  return stops
}

const SHORT = '[@media(max-height:780px)]:hidden'

export default function CategoryShowcase() {
  const root = useRef<HTMLElement>(null)
  const pin = useRef<HTMLDivElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const bar = useRef<HTMLSpanElement>(null)
  const bgMouse = useRef<HTMLDivElement>(null)
  const bgScroll = useRef<HTMLDivElement>(null)
  const edge = useTopEdgeStops()
  const edgeGradient = `linear-gradient(to right, ${edge.map(([o, c]) => `${c} ${(o * 100).toFixed(1)}%`).join(', ')})`

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add('(min-width: 1024px)', () => {
        gsap.set(bgScroll.current, { y: -36 })
        const scrollY = gsap.quickTo(bgScroll.current, 'y', { duration: 0.9, ease: 'power3.out' })
        const mx = gsap.quickTo(bgMouse.current, 'x', { duration: 1.2, ease: 'power3.out' })
        const my = gsap.quickTo(bgMouse.current, 'y', { duration: 1.2, ease: 'power3.out' })
        const onMove = (e: MouseEvent) => {
          mx(-(e.clientX / window.innerWidth - 0.5) * 30)
          my(-(e.clientY / window.innerHeight - 0.5) * 12)
        }
        window.addEventListener('mousemove', onMove)

        const distance = () => Math.max(0, (track.current?.scrollWidth ?? 0) - window.innerWidth)

        gsap.to(track.current, {
          x: () => -distance(),
          ease: 'none',
          force3D: true,
          scrollTrigger: {
            trigger: pin.current,
            start: 'top top',
            end: () => `+=${Math.max(distance() * 1.35, window.innerHeight)}`,
            pin: true,
            scrub: true,
            invalidateOnRefresh: true,
            anticipatePin: 1,
            onUpdate: (self) => {
              gsap.set(bar.current, { scaleX: self.progress })
              scrollY(-36 + 30 * self.progress)
            },
          },
        })

        gsap.from('[data-arch]', {
          y: 70,
          autoAlpha: 0,
          duration: 1,
          stagger: 0.07,
          ease: 'power3.out',
          scrollTrigger: { trigger: pin.current, start: 'top 70%', once: true },
        })

        return () => window.removeEventListener('mousemove', onMove)
      })

      mm.add('(max-width: 1023px)', () => {
        gsap.from('[data-arch]', {
          y: 50,
          autoAlpha: 0,
          duration: 0.9,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: { trigger: track.current, start: 'top 85%', once: true },
        })
      })
    },
    { scope: root },
  )

  return (
    <section ref={root} className="relative bg-forest">
      <svg
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 z-10 h-[56px] w-full -translate-y-[calc(100%-1px)] md:h-[104px]"
      >
        <defs>
          <linearGradient id="showcase-wave" x1="0" x2="1" y1="0" y2="0">
            {edge.map(([o, c]) => (
              <stop key={o} offset={o} stopColor={c} />
            ))}
          </linearGradient>
        </defs>
        <path d="M0 78C180 18 360 6 560 46s380 74 560 30c120-29 230-58 320-40v86H0Z" fill="url(#showcase-wave)" />
      </svg>

      <div
        ref={pin}
        className="relative flex flex-col overflow-hidden bg-forest py-24 lg:h-screen lg:py-0 lg:pb-[max(7rem,12vh)] lg:pt-[max(5.5rem,11vh)]"
      >
        {/* Atmosphere */}
        <div
          className="absolute inset-0"
          style={{ background: edgeGradient }}
        />
        <div className="absolute inset-x-0 bottom-0 top-[56px] overflow-hidden">
          <div ref={bgMouse} className="h-full w-full will-change-transform">
            <div ref={bgScroll} className="h-full w-full origin-top scale-[1.08] will-change-transform">
              <Media slot="dog-on-sofa-background" className="h-full w-full object-cover object-[72%_top]" />
            </div>
          </div>
        </div>
        <Particles count={8} />

        {/* Heading */}
        <div className="relative mx-auto grid w-full max-w-7xl shrink-0 items-end gap-8 px-6 sm:px-10 lg:grid-cols-[1.6fr_0.4fr] lg:px-16">
          <div>
            <p
              data-reveal
              className="flex items-center gap-4 text-[11px] uppercase tracking-[0.34em] text-cream/70"
            >
              Shop by Category
              <span className="h-px w-16 bg-cream/30" />
            </p>
            <h2
              data-split
              className="mt-4 font-display text-[clamp(2rem,min(3.3vw,6.2vh),3.1rem)] leading-[1.06] text-cream"
            >
              Everything Your Dog Needs,
              <br />
              <span className="italic text-gold-soft">All in One Place.</span>
            </h2>
            <p
              data-reveal
              className={`mt-5 max-w-lg text-[15px] leading-relaxed text-cream/65 ${SHORT}`}
            >
              From festive sherwanis to everyday walking gear and beds worth the nap — wander every
              corner of the Dogobow universe.
            </p>
            <div data-reveal className="mt-6">
              <Button variant="gold">Explore All Categories</Button>
            </div>
          </div>

          <div className="hidden flex-col items-end gap-8 self-stretch justify-between lg:flex">
            <p
              data-reveal
              className={`-rotate-6 font-script text-7xl leading-[0.85] text-cream/85 ${SHORT}`}
            >
              Happy
              <br />
              Healthy
              <br />
              Dogs
              <PawIcon size={20} className="ml-2 inline text-gold" />
            </p>
            <div className="flex w-full max-w-[220px] items-center gap-3">
              <span className="text-[10px] uppercase tracking-[0.3em] text-cream/50">01</span>
              <span className="relative h-px flex-1 bg-cream/15">
                <span ref={bar} className="absolute inset-0 origin-left scale-x-0 bg-gold" />
              </span>
              <span className="text-[10px] tracking-[0.3em] text-cream/50">
                0{showcaseCategories.length}
              </span>
            </div>
          </div>
        </div>

        {/* Arches: height follows whatever room the viewport leaves */}
        <div className="relative mt-[clamp(1rem,3.5vh,2.5rem)] overflow-x-auto no-scrollbar lg:min-h-0 lg:flex-1 lg:overflow-visible">
          <div
            ref={track}
            className="flex w-max gap-5 px-6 pb-4 will-change-transform sm:px-10 lg:h-full lg:gap-7 lg:px-[max(4rem,calc((100vw-80rem)/2+4rem))] lg:pb-0 lg:pr-24"
          >
            {showcaseCategories.map((c, i) => (
              <a
                key={c.title}
                data-arch
                href="#"
                className="arch group relative flex h-[400px] w-[250px] shrink-0 flex-col overflow-hidden rounded-t-[120px] rounded-b-[3rem] border border-cream/12 transition-[transform,border-color] duration-300 ease-out hover:-translate-y-2 hover:border-gold/60 lg:h-full lg:max-h-[440px] lg:w-[240px]"
              >
                <span className="arch-glow pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                <div className={`overflow-hidden rounded-t-[120px] ${hasMedia(c.slot) ? 'absolute inset-0 rounded-b-[3rem]' : 'relative h-[44%] shrink-0'}`}>
                  <div className="absolute inset-0 bg-gradient-to-b from-gold/15 via-moss/40 to-transparent" />
                  <Media
                    slot={c.slot}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {!hasMedia(c.slot) ? <c.icon
                    size={56}
                    strokeWidth={1}
                    className="absolute left-1/2 top-[52%] -translate-x-1/2 -translate-y-1/2 text-gold/40 transition-colors duration-300 group-hover:text-gold/75"
                  /> : null}
                </div>

                {hasMedia(c.slot) ? <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/30 via-45% to-transparent" /> : null}

                <div className="relative flex min-h-0 flex-1 flex-col justify-end px-6 pb-5 pt-5">
                  <span className={`absolute left-6 h-10 w-10 items-center justify-center rounded-full border border-gold/50 bg-forest text-gold ${hasMedia(c.slot) ? 'hidden' : '-top-5 flex'}`}>
                    <c.icon size={18} />
                  </span>
                  <span className={`mb-2 text-[10px] tracking-[0.3em] text-gold/80 ${SHORT}`}>
                    0{i + 1}
                  </span>
                  <h3 className="font-display text-[clamp(1rem,2.7vh,1.25rem)] leading-snug text-cream">
                    {c.title}
                  </h3>
                  <p
                    className={`mt-2 line-clamp-2 text-[13px] leading-relaxed text-cream/60 ${SHORT}`}
                  >
                    {c.blurb}
                  </p>
                  <span className="mt-4 flex h-9 w-9 shrink-0 items-center justify-center self-center rounded-full border border-cream/30 text-cream transition-colors duration-300 group-hover:border-gold group-hover:bg-gold group-hover:text-ink">
                    <ArrowRight size={15} />
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
