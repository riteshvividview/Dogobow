import { useRef } from 'react'
import { gsap, useGSAP } from '../lib/gsap'
import Media, { hasMedia } from '../components/Media'
import Button from '../components/Button'
import Wave from '../components/Wave'
import { PawIcon, StarIcon } from '../components/Icons'
import { reviews, stats, trust } from '../data/content'

const placement = [
  'lg:absolute lg:left-0 lg:top-[24%] lg:w-[350px] lg:-rotate-3',
  'lg:absolute lg:left-[5%] lg:top-[60%] lg:w-[350px] lg:rotate-[3deg]',
  'lg:absolute lg:right-0 lg:top-[14%] lg:w-[350px] lg:rotate-[4deg]',
  'lg:absolute lg:right-[4%] lg:top-[52%] lg:w-[350px] lg:-rotate-[3deg]',
]
const speeds = ['0.16', '-0.1', '-0.14', '0.12']

export default function Stories() {
  const root = useRef<HTMLElement>(null)
  const bgMouse = useRef<HTMLDivElement>(null)
  const orbMouse = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const bx = gsap.quickTo(bgMouse.current, 'x', { duration: 1.3, ease: 'power3.out' })
      const by = gsap.quickTo(bgMouse.current, 'y', { duration: 1.3, ease: 'power3.out' })
      const ox = gsap.quickTo(orbMouse.current, 'x', { duration: 1.1, ease: 'power3.out' })
      const oy = gsap.quickTo(orbMouse.current, 'y', { duration: 1.1, ease: 'power3.out' })
      const onMove = (e: MouseEvent) => {
        const nx = e.clientX / window.innerWidth - 0.5
        const ny = e.clientY / window.innerHeight - 0.5
        bx(-nx * 30)
        by(-ny * 14)
        ox(nx * 18)
        oy(ny * 12)
      }
      window.addEventListener('mousemove', onMove)

      gsap.utils.toArray<HTMLElement>('[data-float-card]', root.current).forEach((card, i) => {
        gsap.to(card, {
          y: i % 2 ? 12 : -12,
          duration: 3.4 + i * 0.5,
          yoyo: true,
          repeat: -1,
          ease: 'sine.inOut',
        })
      })

      gsap.to('[data-orbit]', { rotation: 360, duration: 48, repeat: -1, ease: 'none' })
      gsap.to('[data-orb]', {
        scale: 1.06,
        duration: 4.5,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
      })

      gsap.utils.toArray<HTMLElement>('[data-count]', root.current).forEach((el) => {
        const target = Number(el.dataset.count)
        const counter = { v: 0 }
        el.textContent = '0'
        gsap.to(counter, {
          v: target,
          duration: 2.4,
          ease: 'power2.out',
          onUpdate: () => {
            el.textContent = String(Math.round(counter.v))
          },
          scrollTrigger: { trigger: el, start: 'top 92%', once: true },
        })
      })
      return () => window.removeEventListener('mousemove', onMove)
    },
    { scope: root },
  )

  return (
    <section ref={root} data-parallax-root className="relative bg-cream-soft text-ink">
      <Wave className="text-cream-soft" />

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div ref={bgMouse} className="absolute -inset-y-[6%] inset-x-0 will-change-transform">
          <div data-parallax="0.22" className="h-full w-full scale-[1.06]">
            <Media slot="section-bg" className="h-full w-full object-cover" />
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-cream-soft from-30% to-transparent" />

      <div className="relative mx-auto max-w-7xl px-6 pb-24 pt-16 sm:px-10 lg:px-16 lg:pb-32 lg:pt-24">
        <div className="flex items-start justify-between gap-10">
          <div>
            <p data-reveal className="flex items-center gap-4 text-[11px] uppercase tracking-[0.34em] text-ink/70">
              Real Stories
              <span className="h-px w-16 bg-ink/30" />
            </p>
            <h2
              data-split
              className="mt-5 font-display text-[clamp(2.4rem,5.2vw,4.6rem)] leading-[1.05] text-ink"
            >
              Loved by Dogs.
              <br />
              <span className="italic text-gold-deep">Trusted by Humans.</span>
            </h2>
            <p data-reveal className="mt-6 text-[15px] text-ink/65">
              Thousands of happy tails, endless love.
            </p>
            <div data-reveal className="mt-8">
              <Button variant="circle" labelClassName="text-ink">See More Stories</Button>
            </div>
          </div>

          <p
            data-reveal
            className="hidden text-right text-[11px] uppercase leading-7 tracking-[0.34em] text-ink/50 lg:block"
          >
            Good
            <br />
            Dogs
            <br />
            Brighter
            <br />
            Days
            <span className="ml-auto mt-3 block h-px w-10 bg-gold" />
          </p>
        </div>

        {/* Stage */}
        <div className="relative mt-12 flex flex-col gap-5 lg:mt-0 lg:block lg:h-[700px]">
          <div className="pointer-events-none absolute left-1/2 top-4 hidden h-[560px] w-[560px] -translate-x-1/2 lg:block">
            <div
              data-orbit
              className="absolute inset-0 rounded-full border border-gold/25"
            >
              <span className="absolute left-1/2 top-0 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold shadow-[0_0_18px_4px] shadow-gold/70" />
            </div>
            <div
              data-orb
              className="absolute inset-9 overflow-hidden rounded-full border border-white/60 shadow-[0_40px_80px_-30px_rgba(90,60,20,0.45)]"
              style={{
                background:
                  'radial-gradient(65% 65% at 50% 38%, rgba(255,214,150,0.55), rgba(224,138,69,0.25) 55%, rgba(230,220,200,0.9) 100%)',
              }}
            >
              <div ref={orbMouse} className="h-full w-full will-change-transform">
                <div data-parallax="0.12" className="h-full w-full scale-[1.14]">
                  <Media slot="middle-circle-img" className="h-full w-full object-cover" />
                </div>
              </div>
            </div>
            <p className="absolute left-1/2 top-full mt-1 -translate-x-1/2 -rotate-2 whitespace-nowrap text-center font-script text-6xl leading-[0.85] text-ink">
              Happiness Looks
              <br />
              Good On You
              <PawIcon size={16} className="ml-2 inline text-gold-deep" />
            </p>
            <div className="absolute bottom-6 left-1/2 flex h-24 w-24 -translate-x-1/2 flex-col items-center justify-center gap-1 rounded-full border border-gold/60 bg-gradient-to-br from-gold-soft to-gold text-ink shadow-[0_20px_50px_-10px] shadow-gold-deep/70">
              <PawIcon size={22} />
              <span className="font-display text-[11px] italic">Dogobow</span>
            </div>
          </div>

          {reviews.map((r, i) => (
            <div key={r.name} data-parallax={speeds[i]} className={placement[i]}>
              <div data-reveal data-reveal-delay={i * 0.12}>
              <article
                data-float-card
                className="flex gap-4 rounded-3xl border border-white/70 bg-cream/85 p-5 shadow-[0_30px_70px_-30px_rgba(90,60,20,0.55)] backdrop-blur-sm"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/50 bg-cream-soft font-display text-lg text-gold-deep">
                      {r.name[0]}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-ink">{r.name}</p>
                      <p className="flex gap-0.5 text-gold">
                        {Array.from({ length: 5 }, (_, s) => (
                          <StarIcon key={s} size={12} />
                        ))}
                      </p>
                    </div>
                  </div>
                  <p className="mt-3 text-[13px] leading-relaxed text-ink/75">“{r.text}”</p>
                  <p className="mt-2 text-[11px] uppercase tracking-[0.2em] text-gold-deep">{r.dog}</p>
                </div>
                {hasMedia(r.slot) ? (
                  <div className="relative hidden h-28 w-24 shrink-0 overflow-hidden rounded-2xl sm:block">
                    <Media slot={r.slot} className="absolute inset-0 h-full w-full object-cover" />
                  </div>
                ) : null}
              </article>
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div
          data-stagger
          className="mt-16 grid grid-cols-2 gap-y-10 border-t border-ink/15 pt-12 lg:grid-cols-4"
        >
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col items-center gap-2 text-center lg:items-start lg:pl-8 lg:first:pl-0 lg:[&:not(:first-child)]:border-l lg:[&:not(:first-child)]:border-ink/15">
              <p className="font-display text-[clamp(2.6rem,5vw,4rem)] leading-none text-gold-deep">
                <span data-count={s.value}>{s.value}</span>
                {s.suffix}
              </p>
              <p className="text-xs uppercase tracking-[0.24em] text-ink/60">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Trust bar */}
        <div data-reveal className="mt-14 rounded-[2rem] border border-white/70 bg-cream/80 p-8 shadow-[0_30px_70px_-40px_rgba(90,60,20,0.5)] backdrop-blur-sm lg:p-10">
          <p className="font-script text-7xl leading-[0.85] text-ink">
            Why Shop with Dogobow?
            <PawIcon size={18} className="ml-2 inline text-gold" />
          </p>
          <div className="mt-11 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0">
            {trust.map((t) => (
              <div
                key={t.title}
                className="flex items-start gap-4 lg:border-l lg:border-ink/15 lg:px-7 lg:first:border-l-0 lg:first:pl-0"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-gold/40 text-gold">
                  <t.icon size={22} />
                </span>
                <div>
                  <p className="text-sm font-medium text-ink">{t.title}</p>
                  <p className="mt-1 text-[13px] leading-relaxed text-ink/60">{t.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
