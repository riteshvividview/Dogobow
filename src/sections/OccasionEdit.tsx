import { useRef } from 'react'
import { gsap, useGSAP } from '../lib/gsap'
import Media, { hasMedia } from '../components/Media'
import Marquee from '../components/Marquee'
import Wave from '../components/Wave'
import { ArrowUpRight, PawIcon, SparkleIcon } from '../components/Icons'
import { occasions } from '../data/content'

const BLOBS = [
  "M0.5,0.02 C0.74,0 0.96,0.14 0.98,0.4 C1,0.66 0.86,0.7 0.9,0.86 C0.93,0.99 0.7,1 0.5,0.98 C0.3,0.96 0.08,0.99 0.04,0.82 C0,0.62 0.15,0.56 0.08,0.36 C0.03,0.16 0.28,0.04 0.5,0.02 Z",
  "M0.42,0.01 C0.66,-0.02 0.9,0.08 0.97,0.3 C1.03,0.52 0.9,0.6 0.95,0.78 C1,0.96 0.76,1.01 0.52,0.99 C0.28,0.97 0.05,0.94 0.02,0.72 C-0.01,0.5 0.14,0.42 0.06,0.24 C0.01,0.1 0.22,0.03 0.42,0.01 Z",
  "M0.56,0.01 C0.8,0.03 0.98,0.2 0.97,0.44 C0.96,0.66 0.82,0.8 0.84,0.92 C0.85,1.01 0.62,1 0.42,0.99 C0.2,0.98 0.02,0.9 0.03,0.68 C0.04,0.46 0.2,0.4 0.12,0.22 C0.07,0.09 0.32,-0.01 0.56,0.01 Z",
  "M0.5,0 C0.78,0 1,0.2 0.97,0.48 C0.94,0.7 0.78,0.72 0.8,0.88 C0.82,1 0.6,1.01 0.4,0.98 C0.16,0.95 0,0.82 0.05,0.58 C0.09,0.38 0.24,0.36 0.16,0.2 C0.1,0.08 0.3,0 0.5,0 Z",
  "M0.46,0.02 C0.7,-0.02 0.94,0.1 0.99,0.36 C1.03,0.58 0.88,0.66 0.92,0.82 C0.96,0.98 0.72,1.01 0.5,1 C0.26,0.99 0.04,0.96 0.02,0.76 C0,0.56 0.16,0.5 0.1,0.3 C0.05,0.12 0.24,0.05 0.46,0.02 Z",
  "M0.54,0.01 C0.78,0.01 0.99,0.16 0.97,0.4 C0.95,0.6 0.84,0.74 0.88,0.88 C0.91,1 0.66,1 0.46,0.98 C0.22,0.96 0.03,0.88 0.03,0.66 C0.03,0.44 0.18,0.38 0.1,0.2 C0.04,0.08 0.3,0 0.54,0.01 Z",
]

export default function OccasionEdit() {
  const root = useRef<HTMLElement>(null)
  const list = useRef<HTMLUListElement>(null)
  const follower = useRef<HTMLDivElement>(null)
  const play = useRef<(i: number) => void>(() => {})

  useGSAP(
    () => {
      const el = follower.current
      if (!el || !list.current) return
      gsap.set(el, { xPercent: 0, yPercent: -50, autoAlpha: 0 })
      const x = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3.out' })
      const y = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3.out' })
      const rot = gsap.quickTo(el, 'rotation', { duration: 0.8, ease: 'power3.out' })
      let lastX = 0
      let current = -1

      gsap.set(el.querySelectorAll('[data-occ-layer]'), { autoAlpha: 0 })
      play.current = (i: number) => {
        if (i === current) return
        const layers = gsap.utils.toArray<HTMLElement>('[data-occ-layer]', el)
        current = i
        layers.forEach((l, k) => {
          gsap.killTweensOf(l)
          gsap.set(l, { autoAlpha: k === i ? 1 : 0 })
        })
      }

      const move = (e: MouseEvent) => {
        x(e.clientX + 70)
        y(e.clientY)
        rot(gsap.utils.clamp(-8, 8, (e.clientX - lastX) * 0.4))
        lastX = e.clientX
      }
      const enter = () => gsap.set(el, { scale: 1, autoAlpha: 1 })
      const leave = () => gsap.set(el, { autoAlpha: 0 })

      const ul = list.current
      ul.addEventListener('mousemove', move)
      ul.addEventListener('mouseenter', enter)
      ul.addEventListener('mouseleave', leave)
      return () => {
        ul.removeEventListener('mousemove', move)
        ul.removeEventListener('mouseenter', enter)
        ul.removeEventListener('mouseleave', leave)
      }
    },
    { scope: root },
  )

  return (
    <section ref={root} className="relative bg-cream-soft text-ink">
      <Wave className="text-cream-soft" />

      <div className="mx-auto max-w-7xl px-6 pb-16 pt-16 sm:px-10 lg:px-16 lg:pb-24 lg:pt-24">
        <div className="mb-14 grid gap-8 lg:mb-20 lg:grid-cols-[1.4fr_0.6fr] lg:items-end">
          <div>
            <p data-reveal className="text-[11px] uppercase tracking-[0.34em] text-gold-deep">
              The Occasion Edit
            </p>
            <h2
              data-split
              className="mt-4 font-display text-[clamp(2.2rem,5vw,4.4rem)] leading-[1.06]"
            >
              Every Celebration Deserves
              <br />
              a <span className="italic text-gold-deep">Dress Code.</span>
            </h2>
          </div>
          <p data-reveal className="max-w-sm text-[15px] leading-relaxed text-ink/65">
            Festivals, birthdays, match nights — six wardrobes designed so your dog is always the
            best-dressed guest.
          </p>
        </div>

        <ul ref={list} data-stagger className="dim-siblings border-b border-ink/15">
          {occasions.map((o, i) => (
            <li
              key={o.name}
              onMouseEnter={() => play.current(i)}
              className="border-t border-ink/15"
            >
              <a
                href="#"
                className="group grid grid-cols-[auto_1fr_auto] items-center gap-4 py-6 md:gap-10 md:py-9"
              >
                <span className="w-8 text-xs tracking-[0.3em] text-stone transition-colors duration-500 group-hover:text-gold-deep md:w-12">
                  0{i + 1}
                </span>
                <span className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between md:gap-10">
                  <span className="font-display text-[clamp(1.9rem,5.4vw,4.8rem)] leading-none transition-all duration-700 ease-out group-hover:translate-x-4 group-hover:italic group-hover:text-gold-deep">
                    {o.name}
                  </span>
                  <span className="max-w-[17rem] text-sm leading-relaxed text-ink/55 transition-colors duration-500 group-hover:text-ink md:text-right">
                    {o.blurb}
                  </span>
                </span>
                <span className="flex h-11 w-11 items-center justify-center rounded-full border border-ink/25 transition-all duration-500 group-hover:-rotate-45 group-hover:border-gold-deep group-hover:bg-gold-deep group-hover:text-cream md:h-14 md:w-14">
                  <ArrowUpRight size={20} />
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>

      <Marquee
        items={['Designed for Dogs', 'Obsessed Over by Humans']}
        duration={60}
        className="pb-16 lg:pb-24"
        itemClassName="px-8 font-display text-[clamp(3.5rem,10vw,9rem)] italic leading-none text-outline text-ink/70"
        separator={<PawIcon size={44} className="text-gold-deep" />}
      />

      {/* Curvy clip-path shapes, one per occasion (objectBoundingBox units) */}
      <svg width="0" height="0" className="absolute" aria-hidden="true">
        <defs>
          {BLOBS.map((d, i) => (
            <clipPath key={i} id={`occasion-blob-${i}`} clipPathUnits="objectBoundingBox">
              <path d={d} />
            </clipPath>
          ))}
        </defs>
      </svg>

      {/* Cursor-following preview: 1:1 frame, curvy per-occasion cut */}
      <div
        ref={follower}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-40 hidden lg:block"
      >
        <div className="relative h-[300px] w-[300px]">
          {occasions.map((o, i) => (
            <div key={o.name} data-occ-layer className="absolute inset-0 opacity-0">
              <div data-occ-frame className="absolute inset-0">
                <div className="absolute inset-0 drop-shadow-[0_30px_40px_rgba(90,60,20,0.35)]">
                  <div
                    className="absolute inset-0 bg-gradient-to-br from-gold-soft via-cream to-gold"
                    style={{ clipPath: `url(#occasion-blob-${i})` }}
                  >
                    <div data-occ-reveal className="absolute inset-0 overflow-hidden">
                      {!hasMedia(o.slot) ? (
                        <PawIcon
                          size={90}
                          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-gold-deep/25"
                        />
                      ) : null}
                      <div data-occ-img className="h-full w-full">
                        <Media slot={o.slot} className="h-full w-full object-cover" />
                      </div>
                    </div>
                  </div>
                </div>
                <svg
                  viewBox="0 0 1 1"
                  preserveAspectRatio="none"
                  className="absolute -inset-3 h-[calc(100%+24px)] w-[calc(100%+24px)] overflow-visible"
                >
                  <path
                    data-occ-stroke
                    d={BLOBS[i]}
                                        fill="none"
                    stroke="#d9b26a"
                    strokeOpacity="0.8"
                    strokeWidth="0.0045"
                  />
                </svg>
              </div>
              <p
                data-occ-tag
                className="absolute -right-24 top-[30%] -rotate-6 whitespace-nowrap font-script text-5xl leading-[0.85] text-gold-deep"
              >
                {o.tag}
              </p>
            </div>
          ))}
          <SparkleIcon size={26} className="absolute -left-8 top-[28%] text-gold" />
          <SparkleIcon size={18} className="absolute -right-3 bottom-[12%] text-gold" />
          <span className="absolute -bottom-3 -left-8 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-gold-soft to-gold text-center text-[10px] font-medium uppercase leading-tight tracking-[0.2em] text-ink shadow-[0_16px_40px_-10px] shadow-gold-deep/60">
            Shop
            <br />
            Edit
          </span>
        </div>
      </div>
    </section>
  )
}
