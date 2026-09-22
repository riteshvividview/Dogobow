import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useSiteAnimations } from '../hooks/useSiteAnimations'
import { ScrollTrigger } from '../lib/gsap'
import Media, { hasMedia } from '../components/Media'
import NewsletterFooter from '../sections/NewsletterFooter'
import {
  ArrowLeft,
  ArrowRight,
  BagIcon,
  CheckIcon,
  HeartIcon,
  PawIcon,
  RulerIcon,
  ScissorsIcon,
  ShieldCheck,
  StarIcon,
  TruckIcon,
} from '../components/Icons'
import { formatINR } from '../data/content'
import { SWATCHES, collectionsBySlug } from '../data/collections'

const ease = [0.22, 1, 0.36, 1] as const
const featureIcons = [ScissorsIcon, ShieldCheck, RulerIcon, CheckIcon]

export default function Product() {
  const { slug, id } = useParams<{ slug: string; id: string }>()
  const main = useRef<HTMLElement>(null)
  useSiteAnimations(main)

  const def = slug ? collectionsBySlug[slug] : undefined
  const product = def?.products.find((p) => p.id === id)
  const siblings = def ? def.products.filter((p) => p.id !== id) : []
  const nextUp = siblings[0]

  const images = useMemo(() => {
    if (!product) return []
    return [product.slot, product.hoverSlot].filter(
      (s): s is NonNullable<typeof s> => Boolean(s && hasMedia(s)),
    )
  }, [product])

  const [active, setActive] = useState(0)
  const [size, setSize] = useState(product?.sizes[0] ?? '')
  const [qty, setQty] = useState(1)
  const [wished, setWished] = useState(false)
  const [tab, setTab] = useState<'overview' | 'care' | 'reviews'>('overview')

  useEffect(() => {
    setActive(0)
    setSize(product?.sizes[0] ?? '')
    setQty(1)
    setTab('overview')
    const t = window.setTimeout(() => ScrollTrigger.refresh(), 60)
    return () => window.clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, id])

  if (!def || !product) {
    return (
      <main ref={main} className="flex min-h-screen flex-col">
        <section className="flex flex-1 flex-col items-center justify-center bg-ink px-6 py-40 text-center">
          <PawIcon size={40} className="text-gold/60" />
          <h1 data-reveal className="mt-6 font-display text-4xl text-cream">
            We couldn’t find that product.
          </h1>
          <p data-reveal className="mt-4 max-w-md text-cream/60">
            It may have sold out of the edit, or the link is off. Explore the rest of the
            collection instead.
          </p>
          <Link
            to={slug && collectionsBySlug[slug] ? `/collections/${slug}` : '/'}
            className="mt-8 inline-flex items-center gap-3 rounded-full bg-gold px-6 py-3 text-sm font-medium text-ink transition-transform hover:scale-105"
          >
            <ArrowLeft size={16} />
            Back to Shop
          </Link>
        </section>
        <NewsletterFooter />
      </main>
    )
  }

  const discount = product.was ? Math.round((1 - product.price / product.was) * 100) : 0
  const currentImg = images[active]
  const otherImg = images[active === 0 ? images.length - 1 : 0]

  return (
    <main ref={main}>
      {/* Product hero */}
      <section className="bg-ink pb-20 pt-28 text-cream sm:pt-32">
        <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-16">
          <nav data-reveal className="mb-8 flex flex-wrap items-center gap-2 text-xs text-cream/55">
            <Link to="/" className="transition-colors hover:text-gold">
              Home
            </Link>
            <span>/</span>
            <Link to={`/collections/${def.slug}`} className="transition-colors hover:text-gold">
              {def.breadcrumb}
            </Link>
            <span>/</span>
            <span className="text-cream">{product.name}</span>
          </nav>

          <div className="grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:items-start lg:gap-14">
            {/* Gallery */}
            <div data-reveal className="flex items-start gap-4">
              {images.length > 1 ? (
                <div className="hidden w-20 shrink-0 flex-col gap-3 sm:flex">
                  {images.map((img, i) => (
                    <button
                      key={img}
                      onClick={() => setActive(i)}
                      className={`aspect-[2/3] w-20 shrink-0 overflow-hidden rounded-xl border-2 transition-colors ${
                        active === i ? 'border-gold' : 'border-cream/15 hover:border-cream/40'
                      }`}
                    >
                      <Media slot={img} className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              ) : null}

              <div className="relative flex-1 overflow-hidden rounded-[2rem] bg-gradient-to-br from-forest/50 to-ink-soft">
                <div className="relative aspect-[2/3] w-full">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                      key={currentImg ?? 'placeholder'}
                      initial={{ opacity: 0, scale: 1.04 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5, ease }}
                      className="absolute inset-0"
                    >
                      {currentImg ? (
                        <Media eager slot={currentImg} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <PawIcon size={90} className="text-gold/15" />
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>

                  <p className="pointer-events-none absolute left-6 top-6 -rotate-3 font-script text-3xl leading-none text-cream/90 drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
                    {product.blurb}
                    <PawIcon size={14} className="ml-2 inline text-gold" />
                  </p>

                  {images.length > 1 ? (
                    <>
                      <span className="absolute bottom-5 right-6 text-xs tracking-widest text-cream/60">
                        0{active + 1} / 0{images.length}
                      </span>
                      <div className="absolute bottom-5 left-6 flex gap-2">
                        <button
                          aria-label="Previous image"
                          onClick={() => setActive((a) => (a === 0 ? images.length - 1 : a - 1))}
                          className="flex h-9 w-9 items-center justify-center rounded-full bg-ink/50 text-cream backdrop-blur transition-colors hover:bg-gold hover:text-ink"
                        >
                          <ArrowLeft size={15} />
                        </button>
                        <button
                          aria-label="Next image"
                          onClick={() => setActive((a) => (a + 1) % images.length)}
                          className="flex h-9 w-9 items-center justify-center rounded-full bg-ink/50 text-cream backdrop-blur transition-colors hover:bg-gold hover:text-ink"
                        >
                          <ArrowRight size={15} />
                        </button>
                      </div>
                    </>
                  ) : null}
                </div>
              </div>
            </div>

            {/* Info */}
            <div data-reveal data-reveal-delay={0.08}>
              {product.badge ? (
                <span className="mb-4 inline-block rounded-full bg-gold px-3 py-1 text-[10px] font-medium uppercase tracking-[0.16em] text-ink">
                  {product.badge}
                </span>
              ) : null}
              <p className="text-[11px] uppercase tracking-[0.32em] text-gold">
                {product.materials.join(' · ')}
              </p>
              <h1 className="mt-3 font-display text-[clamp(2rem,3.6vw,2.8rem)] leading-tight text-cream">
                {product.name}
              </h1>
              <p className="mt-4 max-w-md text-[15px] leading-relaxed text-cream/65">
                {product.description ?? product.blurb}
              </p>

              <div className="mt-4 flex items-center gap-2">
                <span className="flex items-center gap-0.5 text-gold">
                  {Array.from({ length: 5 }, (_, s) => (
                    <StarIcon key={s} size={14} className={s < Math.round(product.rating) ? '' : 'text-cream/15'} />
                  ))}
                </span>
                <span className="text-sm text-cream/55">
                  {product.rating.toFixed(1)} ({product.reviews.toLocaleString('en-IN')} reviews)
                </span>
              </div>

              <div className="mt-5 flex items-baseline gap-3">
                <span className="font-display text-3xl text-cream">{formatINR(product.price)}</span>
                {product.was ? (
                  <span className="text-lg text-cream/40 line-through">{formatINR(product.was)}</span>
                ) : null}
                {discount ? (
                  <span className="rounded-full bg-forest px-2.5 py-1 text-xs font-medium text-gold-soft">
                    {discount}% OFF
                  </span>
                ) : null}
              </div>

              <div className="mt-7">
                <p className="mb-2.5 text-sm text-cream/70">
                  Size <span className="text-cream">— {size}</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSize(s)}
                      className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                        size === s
                          ? 'border-gold bg-gold text-ink'
                          : 'border-cream/20 text-cream/75 hover:border-cream/50'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-5 flex items-center gap-2">
                {product.colors.map((c) => (
                  <span
                    key={c}
                    title={c}
                    className="h-6 w-6 rounded-full border border-cream/25"
                    style={{ backgroundColor: SWATCHES[c] ?? '#999' }}
                  />
                ))}
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <div className="flex items-center rounded-full border border-cream/20">
                  <button
                    aria-label="Decrease quantity"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="px-4 py-3 text-cream/70 transition-colors hover:text-gold"
                  >
                    –
                  </button>
                  <span className="w-6 text-center text-sm text-cream">{qty}</span>
                  <button
                    aria-label="Increase quantity"
                    onClick={() => setQty((q) => Math.min(9, q + 1))}
                    className="px-4 py-3 text-cream/70 transition-colors hover:text-gold"
                  >
                    +
                  </button>
                </div>
                <button className="flex flex-1 min-w-[10rem] items-center justify-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-medium text-ink transition-transform hover:scale-[1.02]">
                  <BagIcon size={16} />
                  Add to Cart
                </button>
                <button
                  aria-label="Add to wishlist"
                  onClick={() => setWished((w) => !w)}
                  className={`flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-full border transition-colors ${
                    wished ? 'border-gold bg-gold text-ink' : 'border-cream/20 text-cream/70 hover:border-gold/50'
                  }`}
                >
                  <HeartIcon size={17} fill={wished ? 'currentColor' : 'none'} />
                </button>
              </div>
              <button className="mt-3 w-full rounded-full border border-cream/25 py-3 text-sm font-medium text-cream transition-colors hover:border-gold hover:text-gold">
                Buy Now
              </button>

              {product.features?.length ? (
                <ul className="mt-9 grid gap-4 border-t border-cream/10 pt-7 sm:grid-cols-2">
                  {product.features.map((f, i) => {
                    const Icon = featureIcons[i % featureIcons.length]
                    return (
                      <li key={f} className="flex items-center gap-3">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gold/30 text-gold">
                          <Icon size={16} />
                        </span>
                        <span className="text-sm text-cream/80">{f}</span>
                      </li>
                    )
                  })}
                </ul>
              ) : null}

              <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-xs text-cream/45">
                <span className="flex items-center gap-1.5">
                  <TruckIcon size={14} />
                  Free shipping over ₹799
                </span>
                <span className="flex items-center gap-1.5">
                  <ShieldCheck size={14} />
                  5-day easy returns
                </span>
              </div>

              {nextUp ? (
                <Link
                  to={`/collections/${def.slug}/product/${nextUp.id}`}
                  className="group mt-7 flex items-center gap-4 rounded-2xl border border-cream/10 p-3 transition-colors hover:border-gold/40"
                >
                  <span className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-forest/40">
                    {nextUp.slot && hasMedia(nextUp.slot) ? (
                      <Media slot={nextUp.slot} className="h-full w-full object-cover" />
                    ) : (
                      <span className="flex h-full w-full items-center justify-center">
                        <PawIcon size={20} className="text-gold/30" />
                      </span>
                    )}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[11px] uppercase tracking-[0.2em] text-cream/40">
                      Also in the edit
                    </span>
                    <span className="block truncate text-sm text-cream group-hover:text-gold-soft">
                      {nextUp.name}
                    </span>
                  </span>
                  <ArrowRight size={16} className="shrink-0 text-cream/40 transition-transform group-hover:translate-x-1 group-hover:text-gold" />
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      {/* Tabs + detail */}
      <section className="bg-cream-soft text-ink">
        <div className="mx-auto max-w-7xl px-6 py-16 sm:px-10 lg:px-16 lg:py-24">
          <div data-reveal className="mb-10 flex gap-8 border-b border-ink/10">
            {(['overview', 'care', 'reviews'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`relative pb-4 text-sm font-medium capitalize tracking-wide transition-colors ${
                  tab === t ? 'text-ink' : 'text-ink/40 hover:text-ink/70'
                }`}
              >
                {t === 'care' ? 'Materials & Care' : t}
                {tab === t ? (
                  <motion.span layoutId="tab-underline" className="absolute inset-x-0 -bottom-px h-[2px] bg-gold-deep" />
                ) : null}
              </button>
            ))}
          </div>

          {tab === 'overview' ? (
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
              <div data-reveal>
                <p className="text-[11px] uppercase tracking-[0.32em] text-gold-deep">The Craftsmanship</p>
                <h2 className="mt-4 font-display text-[clamp(1.9rem,3.2vw,2.6rem)] leading-tight">
                  Made for Comfort, <span className="italic text-gold-deep">Built to Last.</span>
                </h2>
                <p className="mt-5 max-w-md text-[15px] leading-relaxed text-ink/65">
                  {product.description ?? product.blurb}
                </p>
                {product.features?.length ? (
                  <ul className="mt-7 flex flex-col gap-3">
                    {product.features.map((f) => (
                      <li key={f} className="flex items-center gap-3 text-sm text-ink/75">
                        <CheckIcon size={15} className="text-gold-deep" />
                        {f}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>

              <div data-reveal className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-gradient-to-br from-sand to-cream-soft shadow-[0_30px_70px_-30px_rgba(60,40,10,0.4)]">
                {otherImg ? (
                  <Media slot={otherImg} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <PawIcon size={80} className="text-gold-deep/15" />
                  </div>
                )}
                <p className="pointer-events-none absolute bottom-6 left-6 -rotate-2 font-script text-4xl leading-none text-ink/85">
                  Happy Dogs.
                  <br />
                  Better Style.
                </p>
              </div>
            </div>
          ) : null}

          {tab === 'care' ? (
            <div data-reveal className="grid gap-10 lg:grid-cols-2">
              <div>
                <p className="text-[11px] uppercase tracking-[0.32em] text-gold-deep">Materials</p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {product.materials.map((m) => (
                    <li key={m} className="rounded-full border border-ink/15 px-4 py-1.5 text-sm text-ink/75">
                      {m}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.32em] text-gold-deep">Care Instructions</p>
                <p className="mt-4 max-w-md text-[15px] leading-relaxed text-ink/70">
                  {product.careNote ?? 'Spot clean as needed and air dry away from direct heat.'}
                </p>
              </div>
            </div>
          ) : null}

          {tab === 'reviews' ? (
            <div data-stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {siblings.slice(0, 3).map((s, i) => (
                <div key={s.id} className="rounded-2xl border border-ink/10 bg-white/50 p-5">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-forest/10 font-display text-sm text-gold-deep">
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span className="flex gap-0.5 text-gold-deep">
                      {Array.from({ length: 5 }, (_, st) => (
                        <StarIcon key={st} size={12} />
                      ))}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-ink/75">
                    “{product.name} fits perfectly and the {product.materials[0].toLowerCase()} feels
                    every bit as good as it looks. Ordering another one.”
                  </p>
                  <p className="mt-2 text-xs uppercase tracking-wide text-gold-deep">Verified Buyer</p>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </section>

      <NewsletterFooter />
    </main>
  )
}
