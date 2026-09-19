import { useRef, type SVGProps } from 'react'
import { gsap, useGSAP } from '../lib/gsap'
import Media, { hasMedia } from '../components/Media'
import Wave from '../components/Wave'
import { ArrowRight, BagIcon, HeartIcon, PawIcon } from '../components/Icons'
import { formatINR, products } from '../data/content'

function Leaf(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 100 70" aria-hidden="true" {...props}>
      <path d="M0 62C8 24 46 2 100 0c-2 46-32 84-100 62Z" fill="currentColor" />
      <path d="M4 60C30 40 58 22 96 4" stroke="#f7f3ea" strokeOpacity="0.35" strokeWidth="1.2" fill="none" />
    </svg>
  )
}

export default function FeaturedProducts() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const cleanups: Array<() => void> = []

      gsap.utils.toArray<HTMLElement>('[data-tilt]', root.current).forEach((card) => {
        const stage = card.querySelector<HTMLElement>('[data-tilt-stage]')
        if (!stage) return
        gsap.set(stage, { transformPerspective: 900 })
        const rx = gsap.quickTo(stage, 'rotationX', { duration: 0.7, ease: 'power3.out' })
        const ry = gsap.quickTo(stage, 'rotationY', { duration: 0.7, ease: 'power3.out' })

        const baseImg = stage.querySelector<HTMLElement>('[data-layer=base] img')
        const hoverLayer = stage.querySelector<HTMLElement>('[data-layer=hover]')
        const hoverImg = hoverLayer?.querySelector<HTMLElement>('img')
        const retLayer = stage.querySelector<HTMLElement>('[data-layer=return]')
        const retImg = retLayer?.querySelector<HTMLElement>('img')
        const sheen = stage.querySelector<HTMLElement>('[data-sheen]')
        const canReveal = Boolean(hoverLayer && hoverImg && retLayer && retImg)
        let state: 'idle' | 'hover' | 'leaving' = 'idle'

        const hide = 'circle(0% at 50% 50%)'
        if (canReveal) {
          gsap.set([hoverLayer!, retLayer!], { clipPath: hide })
          gsap.set(hoverImg!, { scale: 1.22 })
        }

        const origin = (e: MouseEvent) => {
          const r = stage.getBoundingClientRect()
          const x = gsap.utils.clamp(0, 100, ((e.clientX - r.left) / r.width) * 100)
          const y = gsap.utils.clamp(0, 100, ((e.clientY - r.top) / r.height) * 100)
          return `${x.toFixed(1)}% ${y.toFixed(1)}%`
        }

        const sweep = (from: number, to: number) =>
          gsap.fromTo(
            sheen!,
            { xPercent: from, autoAlpha: 1 },
            { xPercent: to, duration: 1.2, ease: 'power2.inOut', onComplete: () => gsap.set(sheen!, { autoAlpha: 0 }) },
          )

        const enter = (e: MouseEvent) => {
          if (!canReveal) return
          const at = origin(e)
          if (state === 'leaving') {
            // Changed our mind mid-exit: fold the return circle back and finish the reveal.
            gsap.to(retLayer!, { clipPath: `circle(0% at ${at})`, duration: 0.5, ease: 'power2.out', overwrite: true })
            gsap.to(hoverLayer!, { clipPath: `circle(150% at ${at})`, duration: 0.8, ease: 'power3.out', overwrite: true })
            gsap.to(hoverImg!, { scale: 1, duration: 1.2, ease: 'expo.out', overwrite: true })
            state = 'hover'
            return
          }
          state = 'hover'
          gsap.fromTo(
            hoverLayer!,
            { clipPath: `circle(0% at ${at})` },
            { clipPath: `circle(150% at ${at})`, duration: 1.1, ease: 'power3.inOut', overwrite: true },
          )
          gsap.to(hoverImg!, { scale: 1, duration: 1.6, ease: 'expo.out', overwrite: true })
          gsap.to(baseImg!, { scale: 1.12, duration: 1.4, ease: 'power2.out', overwrite: true })
          sweep(-60, 460)
        }

        const move = (e: MouseEvent) => {
          const r = card.getBoundingClientRect()
          ry(((e.clientX - r.left) / r.width - 0.5) * 12)
          rx(-((e.clientY - r.top) / r.height - 0.5) * 12)
        }

        const leave = (e: MouseEvent) => {
          rx(0)
          ry(0)
          if (!canReveal) return
          const at = origin(e)
          state = 'leaving'
          // Mirror of the entrance: the original photo blooms back from where the cursor exits.
          gsap.fromTo(retImg!, { scale: 1.22 }, { scale: 1, duration: 1.6, ease: 'expo.out', overwrite: true })
          gsap.to(hoverImg!, { scale: 1.1, duration: 1.1, ease: 'power2.inOut', overwrite: true })
          gsap.fromTo(
            retLayer!,
            { clipPath: `circle(0% at ${at})` },
            {
              clipPath: `circle(150% at ${at})`,
              duration: 1.1,
              ease: 'power3.inOut',
              overwrite: true,
              onComplete: () => {
                gsap.set([hoverLayer!, retLayer!], { clipPath: hide })
                gsap.set(hoverImg!, { scale: 1.22 })
                gsap.set(baseImg!, { scale: 1 })
                state = 'idle'
              },
            },
          )
          sweep(460, -60)
        }

        card.addEventListener('mouseenter', enter)
        card.addEventListener('mousemove', move)
        card.addEventListener('mouseleave', leave)
        cleanups.push(() => {
          card.removeEventListener('mouseenter', enter)
          card.removeEventListener('mousemove', move)
          card.removeEventListener('mouseleave', leave)
        })
      })

      return () => cleanups.forEach((fn) => fn())
    },
    { scope: root },
  )

  return (
    <section ref={root} data-parallax-root className="relative bg-cream text-ink">
      <Wave className="text-cream" />

      <Leaf data-parallax="-0.25" className="pointer-events-none absolute -left-6 top-24 hidden w-40 rotate-[18deg] text-moss/25 lg:block" />
      <Leaf data-parallax="0.3" className="pointer-events-none absolute right-[6%] top-10 hidden w-24 -rotate-[24deg] text-gold/40 lg:block" />

      <div className="relative mx-auto max-w-7xl px-6 pb-28 pt-16 sm:px-10 lg:px-16 lg:pb-40 lg:pt-24">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6 lg:mb-16">
          <div>
            <p data-reveal className="text-[11px] uppercase tracking-[0.34em] text-gold-deep">
              Best Sellers
            </p>
            <h2
              data-split
              className="mt-4 font-display text-[clamp(2.1rem,4.4vw,3.6rem)] leading-[1.08]"
            >
              Fan Favourites,
              <br />
              <span className="italic text-gold-deep">Fur-Approved.</span>
            </h2>
          </div>

          <a
            data-reveal
            href="#"
            className="group relative flex items-center gap-2 pb-1 text-sm tracking-wide"
          >
            View All Products
            <ArrowRight size={16} className="transition-transform duration-500 group-hover:translate-x-1.5" />
            <span className="absolute inset-x-0 bottom-0 h-px origin-left bg-ink/30" />
            <span className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-gold-deep transition-transform duration-500 group-hover:scale-x-100" />
          </a>
        </div>

        <ul className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p, i) => (
            <li key={p.name} data-parallax={i % 2 ? '0.1' : '-0.06'}>
              <article
                data-tilt
                data-reveal
                data-reveal-delay={i * 0.1}
                className="group"
              >
                <div
                  data-tilt-stage
                  className="relative aspect-[3/4] overflow-hidden rounded-[1.75rem] bg-gradient-to-b from-cream-soft to-sand shadow-[0_30px_60px_-30px_rgba(60,40,10,0.45)] transition-shadow duration-500 group-hover:shadow-[0_44px_80px_-30px_rgba(60,40,10,0.6)]"
                >
                  {!hasMedia(p.slot) ? (
                    <>
                      <div
                        className="absolute inset-0"
                        style={{
                          background:
                            'radial-gradient(70% 55% at 50% 38%, rgba(255,255,255,0.85), transparent 70%)',
                        }}
                      />
                      <PawIcon
                        size={96}
                        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-gold-deep/10"
                      />
                    </>
                  ) : null}

                  <div data-layer="base" className="absolute inset-0 overflow-hidden">
                    <Media slot={p.slot} className="h-full w-full object-cover will-change-transform" />
                  </div>
                  <div data-layer="hover" className="absolute inset-0 overflow-hidden">
                    <Media slot={p.hoverSlot} className="h-full w-full object-cover will-change-transform" />
                  </div>
                  <div data-layer="return" className="absolute inset-0 overflow-hidden">
                    <Media slot={p.slot} className="h-full w-full object-cover will-change-transform" />
                  </div>
                  <div
                    data-sheen
                    className="pointer-events-none absolute inset-y-[-10%] -left-1/2 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0"
                  />
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-ink/50 to-transparent" />

                  {p.badge ? (
                    <span className="absolute left-4 top-4 rounded-full bg-ink px-3 py-1 text-[10px] font-medium uppercase tracking-[0.16em] text-gold-soft">
                      {p.badge}
                    </span>
                  ) : null}
                  <button
                    aria-label={`Add ${p.name} to wishlist`}
                    className="absolute right-4 top-4 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-cream/90 text-ink shadow transition-colors duration-300 hover:bg-gold"
                  >
                    <HeartIcon size={16} />
                  </button>

                  <button className="absolute inset-x-4 bottom-4 flex translate-y-[260%] cursor-pointer items-center justify-center gap-2 rounded-full bg-ink py-3 text-sm font-medium text-cream transition-transform duration-500 group-hover:translate-y-0">
                    <BagIcon size={16} />
                    Quick Add
                  </button>
                </div>

                <div className="px-1 pt-5">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-stone">{p.category}</p>
                  <h3 className="mt-2 font-display text-lg leading-snug">{p.name}</h3>
                  <div className="mt-3 flex items-center justify-between gap-3">
                    <p className="flex items-baseline gap-2">
                      <span className="text-base font-semibold">{formatINR(p.price)}</span>
                      {p.was ? (
                        <span className="text-sm text-stone line-through">{formatINR(p.was)}</span>
                      ) : null}
                    </p>
                    <span className="text-[11px] tracking-wider text-stone">{p.sizes}</span>
                  </div>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
