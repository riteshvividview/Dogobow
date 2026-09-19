import { useRef } from 'react'
import { gsap, ScrollTrigger, useGSAP } from '../lib/gsap'
import Media from '../components/Media'
import Button from '../components/Button'
import Wave from '../components/Wave'
import { PawIcon } from '../components/Icons'
import { chapters } from '../data/content'

export default function BrandStory() {
  const root = useRef<HTMLElement>(null)
  const timeline = useRef<HTMLDivElement>(null)
  const line = useRef<HTMLDivElement>(null)
  const bg = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const mx = gsap.quickTo(bg.current, 'x', { duration: 1.3, ease: 'power3.out' })
      const my = gsap.quickTo(bg.current, 'y', { duration: 1.3, ease: 'power3.out' })
      const onMove = (e: MouseEvent) => {
        mx(-(e.clientX / window.innerWidth - 0.5) * 36)
        my(-(e.clientY / window.innerHeight - 0.5) * 16)
      }
      window.addEventListener('mousemove', onMove)

      gsap.fromTo(
        line.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: timeline.current,
            start: 'top 60%',
            end: 'bottom 60%',
            scrub: true,
          },
        },
      )

      gsap.utils.toArray<HTMLElement>('[data-chapter]', root.current).forEach((chapter) => {
        const card = chapter.querySelector<HTMLElement>('[data-chapter-card]')
        const dot = chapter.querySelector<HTMLElement>('[data-dot]')

        gsap.fromTo(
          card,
          { opacity: 0.2, y: 60, scale: 0.96 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: chapter,
              start: 'top 85%',
              end: 'top 45%',
              scrub: true,
            },
          },
        )

        ScrollTrigger.create({
          trigger: chapter,
          start: 'top 60%',
          end: 'bottom 60%',
          onToggle: (self) =>
            gsap.to(dot, {
              backgroundColor: self.isActive ? '#d9b26a' : '#0a0c09',
              scale: self.isActive ? 1.35 : 1,
              boxShadow: self.isActive ? '0 0 24px 4px rgba(217,178,106,0.55)' : '0 0 0 0 rgba(0,0,0,0)',
              duration: 0.5,
            }),
        })
      })

      return () => window.removeEventListener('mousemove', onMove)
    },
    { scope: root },
  )

  return (
    <section ref={root} data-parallax-root className="relative bg-ink">
      <Wave className="text-ink" />

      <div className="pointer-events-none absolute inset-0 [overflow:clip]">
        <div className="sticky top-0 h-screen w-full">
          <div ref={bg} className="h-full w-full origin-right scale-[1.08] will-change-transform">
            <Media slot="background-img" className="h-full w-full object-cover object-right" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-ink/85 via-ink/35 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-ink/20 via-transparent to-ink/40" />
        </div>
      </div>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[min(24vh,190px)] bg-gradient-to-b from-ink from-[12%] via-ink/40 via-55% to-transparent" />

      <div className="relative mx-auto grid max-w-7xl gap-14 px-6 pb-24 pt-20 sm:px-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20 lg:px-16 lg:pb-36 lg:pt-32">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <p data-reveal className="flex items-center gap-4 text-[11px] uppercase tracking-[0.34em] text-cream/70">
            Our Story
            <span className="h-px w-14 bg-cream/30" />
          </p>
          <h2
            data-split
            className="mt-5 font-display text-[clamp(2.4rem,5vw,4.4rem)] leading-[1.05] text-cream"
          >
            A Kinder World
            <br />
            for <span className="italic text-gold-soft">Brighter Days.</span>
          </h2>
          <p data-reveal className="mt-7 max-w-md text-[15px] leading-relaxed text-cream/65">
            It began with one obsession — dressing dogs the way they deserve. Today Dogobow is a
            Hyderabad-born pet lifestyle brand, proudly made in India, with 10,000+ happy customers
            who wouldn’t have it any other way.
          </p>
          <div data-reveal className="mt-9">
            <Button variant="outline">Read Our Story</Button>
          </div>
          <p
            data-reveal
            className="mt-12 hidden -rotate-3 font-script text-6xl leading-[0.85] text-cream/80 lg:block"
          >
            Same Love,
            <br />
            Bigger Adventures
            <PawIcon size={18} className="ml-2 inline text-gold" />
          </p>
        </div>

        <div ref={timeline} className="relative">
          <div className="absolute bottom-0 left-[11px] top-0 w-px bg-cream/10">
            <div ref={line} className="h-full w-full origin-top bg-gradient-to-b from-gold to-gold-soft" />
          </div>

          {chapters.map((c) => (
            <article
              key={c.no}
              data-chapter
              className="relative flex min-h-[64vh] items-center pl-10 md:pl-16"
            >
              <span
                data-dot
                className="absolute left-0 top-1/2 h-[23px] w-[23px] -translate-y-1/2 rounded-full border border-gold/60 bg-ink"
              />

              <div
                data-chapter-card
                className="glass relative w-full overflow-hidden rounded-[2rem] p-8 md:p-12"
              >
                <Media
                  slot={c.slot}
                  className="absolute inset-0 h-full w-full object-cover [mask-image:linear-gradient(to_right,transparent_0%,transparent_22%,rgba(0,0,0,0.55)_50%,black_82%)]"
                />

                <span
                  data-parallax="-0.16"
                  className="text-outline pointer-events-none absolute -right-4 -top-6 select-none font-display text-[clamp(5rem,12vw,10rem)] italic leading-none text-gold/45"
                >
                  {c.no}
                </span>

                <div className="relative">
                  <p className="text-[11px] uppercase tracking-[0.34em] text-gold">{c.word}</p>
                  <h3 className="mt-4 max-w-md font-display text-[clamp(1.8rem,3vw,2.7rem)] leading-tight text-cream">
                    {c.title}
                  </h3>
                  <p className="mt-5 max-w-md text-[15px] leading-relaxed text-cream/65">{c.body}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
