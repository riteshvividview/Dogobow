import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useSiteAnimations } from '../hooks/useSiteAnimations'
import { ScrollTrigger } from '../lib/gsap'
import Media, { hasMedia } from '../components/Media'
import NewsletterFooter from '../sections/NewsletterFooter'
import {
  ArrowLeft,
  BagIcon,
  ChevronDown,
  CheckIcon,
  GridIcon,
  HeartIcon,
  ListIcon,
  PawIcon,
  RulerIcon,
  ScissorsIcon,
  ShirtIcon,
  SparkleIcon,
  StarIcon,
} from '../components/Icons'
import { formatINR } from '../data/content'
import { SWATCHES, collectionsBySlug, type CollectionDef, type CollectionProduct } from '../data/collections'
import { useWishlist } from '../context/WishlistContext'

const TRUST_CHIPS = [
  { label: 'Premium Materials', icon: SparkleIcon },
  { label: 'Comfort First', icon: HeartIcon },
  { label: 'Stylish Designs', icon: ShirtIcon },
  { label: 'For Every Adventure', icon: PawIcon },
]

const PRICE_BUCKETS = [
  { id: 'all', label: 'All Prices' },
  { id: 'u500', label: 'Under ₹500' },
  { id: '500-1500', label: '₹500 – ₹1,500' },
  { id: 'o1500', label: 'Above ₹1,500' },
] as const
type PriceBucket = (typeof PRICE_BUCKETS)[number]['id']

const inBucket = (price: number, bucket: PriceBucket) => {
  if (bucket === 'all') return true
  if (bucket === 'u500') return price < 500
  if (bucket === '500-1500') return price >= 500 && price <= 1500
  return price > 1500
}

type Sort = 'featured' | 'price-asc' | 'price-desc' | 'rating'
const SORTS: Array<{ id: Sort; label: string }> = [
  { id: 'featured', label: 'Featured' },
  { id: 'price-asc', label: 'Price: Low to High' },
  { id: 'price-desc', label: 'Price: High to Low' },
  { id: 'rating', label: 'Top Rated' },
]

function toggle<T>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value]
}

export default function Collection() {
  const { slug } = useParams<{ slug: string }>()
  const main = useRef<HTMLElement>(null)
  useSiteAnimations(main)

  const def = slug ? collectionsBySlug[slug] : undefined

  const [sizes, setSizes] = useState<string[]>([])
  const [materials, setMaterials] = useState<string[]>([])
  const [colors, setColors] = useState<string[]>([])
  const [bucket, setBucket] = useState<PriceBucket>('all')
  const [sort, setSort] = useState<Sort>('featured')
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [sortOpen, setSortOpen] = useState(false)
  const { isWished, toggle: toggleWishlist } = useWishlist()

  useEffect(() => {
    window.scrollTo(0, 0)
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 60)
    return () => window.clearTimeout(id)
  }, [slug])

  const facets = useMemo(() => {
    if (!def) return null
    const sizeSet = new Map<string, number>()
    const materialSet = new Map<string, number>()
    const colorSet = new Map<string, number>()
    for (const p of def.products) {
      p.sizes.forEach((s) => sizeSet.set(s, (sizeSet.get(s) ?? 0) + 1))
      p.materials.forEach((m) => materialSet.set(m, (materialSet.get(m) ?? 0) + 1))
      p.colors.forEach((c) => colorSet.set(c, (colorSet.get(c) ?? 0) + 1))
    }
    const orderedSizes = def.sizeOrder.filter((s) => sizeSet.has(s))
    return {
      sizes: orderedSizes.map((s) => [s, sizeSet.get(s)!] as const),
      materials: [...materialSet.entries()],
      colors: [...colorSet.entries()],
    }
  }, [def])

  const filtered = useMemo(() => {
    if (!def) return []
    let list = def.products.filter(
      (p) =>
        (sizes.length === 0 || p.sizes.some((s) => sizes.includes(s))) &&
        (materials.length === 0 || p.materials.some((m) => materials.includes(m))) &&
        (colors.length === 0 || p.colors.some((c) => colors.includes(c))) &&
        inBucket(p.price, bucket),
    )
    list = [...list]
    if (sort === 'price-asc') list.sort((a, b) => a.price - b.price)
    else if (sort === 'price-desc') list.sort((a, b) => b.price - a.price)
    else if (sort === 'rating') list.sort((a, b) => b.rating - a.rating)
    return list
  }, [def, sizes, materials, colors, bucket, sort])

  const clearAll = () => {
    setSizes([])
    setMaterials([])
    setColors([])
    setBucket('all')
  }

  const anyFilter = sizes.length + materials.length + colors.length > 0 || bucket !== 'all'

  if (!def) {
    return (
      <main ref={main} className="flex min-h-screen flex-col">
        <section className="flex flex-1 flex-col items-center justify-center bg-ink px-6 py-40 text-center">
          <PawIcon size={40} className="text-gold/60" />
          <h1 data-reveal className="mt-6 font-display text-4xl text-cream">
            This collection is coming soon.
          </h1>
          <p data-reveal className="mt-4 max-w-md text-cream/60">
            We're still stitching this one together. Check back shortly, or explore what's already
            live.
          </p>
          <Link
            to="/"
            className="mt-8 inline-flex items-center gap-3 rounded-full bg-gold px-6 py-3 text-sm font-medium text-ink transition-transform hover:scale-105"
          >
            <ArrowLeft size={16} />
            Back to Home
          </Link>
        </section>
        <NewsletterFooter />
      </main>
    )
  }

  return (
    <main ref={main}>
      <CollectionHero def={def} />

      <section id="shop" className="bg-ink pb-24 pt-10 text-cream sm:pt-14">
        <div className="mx-auto max-w-[100rem] px-4 sm:px-6 lg:px-10">
          <div className="grid gap-10 lg:grid-cols-[260px_1fr]">
            <FilterSidebar
              def={def}
              facets={facets!}
              sizes={sizes}
              setSizes={(s) => setSizes((v) => toggle(v, s))}
              materials={materials}
              setMaterials={(m) => setMaterials((v) => toggle(v, m))}
              colors={colors}
              setColors={(c) => setColors((v) => toggle(v, c))}
              bucket={bucket}
              setBucket={setBucket}
              anyFilter={anyFilter}
              clearAll={clearAll}
            />

            <div>
              <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-cream/10 pb-6">
                <p data-reveal className="text-sm text-cream/60">
                  <span className="font-display text-xl text-cream">{filtered.length}</span> Products
                </p>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <button
                      onClick={() => setSortOpen((v) => !v)}
                      className="flex items-center gap-3 rounded-full border border-cream/15 px-4 py-2.5 text-sm text-cream/85 transition-colors hover:border-gold/50"
                    >
                      Sort by: <span className="text-cream">{SORTS.find((s) => s.id === sort)!.label}</span>
                      <ChevronDown size={14} className={`transition-transform duration-300 ${sortOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {sortOpen ? (
                      <ul className="absolute right-0 top-full z-20 mt-2 w-56 overflow-hidden rounded-2xl border border-cream/10 bg-ink-soft shadow-[0_30px_60px_-20px_rgba(0,0,0,0.7)]">
                        {SORTS.map((s) => (
                          <li key={s.id}>
                            <button
                              onClick={() => {
                                setSort(s.id)
                                setSortOpen(false)
                              }}
                              className={`flex w-full items-center justify-between px-4 py-3 text-left text-sm transition-colors hover:bg-cream/5 ${
                                sort === s.id ? 'text-gold' : 'text-cream/80'
                              }`}
                            >
                              {s.label}
                              {sort === s.id ? <CheckIcon size={14} /> : null}
                            </button>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                  <div className="hidden items-center gap-1 rounded-full border border-cream/15 p-1 sm:flex">
                    <button
                      aria-label="Grid view"
                      onClick={() => setView('grid')}
                      className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors ${
                        view === 'grid' ? 'bg-gold text-ink' : 'text-cream/60 hover:text-cream'
                      }`}
                    >
                      <GridIcon size={16} />
                    </button>
                    <button
                      aria-label="List view"
                      onClick={() => setView('list')}
                      className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors ${
                        view === 'list' ? 'bg-gold text-ink' : 'text-cream/60 hover:text-cream'
                      }`}
                    >
                      <ListIcon size={16} />
                    </button>
                  </div>
                </div>
              </div>

              {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-4 rounded-[2rem] border border-cream/10 py-24 text-center">
                  <PawIcon size={32} className="text-gold/50" />
                  <p className="text-cream/70">No products match those filters yet.</p>
                  <button onClick={clearAll} className="text-sm text-gold underline underline-offset-4">
                    Clear filters
                  </button>
                </div>
              ) : (
                <ul
                  className={`grid grid-cols-2 gap-x-5 gap-y-12 sm:gap-x-6 ${
                    view === 'grid' ? 'lg:grid-cols-4' : 'lg:grid-cols-2'
                  }`}
                >
                  {filtered.map((p, i) => (
                    <li key={p.id}>
                      <ProductCard
                        p={p}
                        slug={def.slug}
                        index={i}
                        wished={isWished(def.slug, p.id)}
                        toggleWish={() => toggleWishlist(def.slug, p.id)}
                      />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </section>

      <NewsletterFooter />
    </main>
  )
}

function CollectionHero({ def }: { def: CollectionDef }) {
  return (
    <section className="relative flex min-h-[74vh] w-full flex-col justify-end overflow-hidden bg-ink pt-28 sm:min-h-[78vh]">
      <Media eager slot={def.heroSlot} className="absolute inset-0 h-full w-full object-cover" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ink/92 via-ink/55 to-ink/10" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-ink/10 to-ink/50" />

      <p
        data-reveal
        className="pointer-events-none absolute left-6 top-28 hidden -rotate-6 whitespace-pre-line font-script text-3xl leading-[0.95] text-cream/85 sm:block lg:left-10"
      >
        {def.leftNote}
      </p>
      <p
        data-reveal
        className="pointer-events-none absolute right-6 top-28 hidden -rotate-3 whitespace-pre-line text-right font-script text-3xl leading-[0.95] text-cream/85 sm:block lg:right-12"
      >
        {def.rightNote}
        <PawIcon size={14} className="ml-1 inline text-gold" />
      </p>

      <div className="relative mx-auto w-full max-w-7xl px-6 pb-14 sm:px-10 lg:px-16">
        <nav data-reveal className="mb-5 flex items-center gap-2 text-xs text-cream/55">
          <Link to="/" className="transition-colors hover:text-gold">
            Home
          </Link>
          <span>/</span>
          <span>Shop</span>
          <span>/</span>
          <span className="text-cream">{def.breadcrumb}</span>
        </nav>

        <p data-reveal className="flex items-center gap-4 text-[11px] uppercase tracking-[0.34em] text-gold">
          {def.eyebrow}
          <span className="h-px w-14 bg-gold/50" />
        </p>

        <h1 data-split className="mt-4 font-display text-[clamp(2.6rem,6vw,5rem)] leading-[1.02] text-cream">
          {def.title[0]}
          {def.title[1] ? <span className="block italic text-gold-soft">{def.title[1]}</span> : null}
        </h1>

        <p data-reveal className="mt-5 max-w-lg text-[15px] leading-relaxed text-cream/70">
          {def.blurb}
        </p>

        <div data-stagger className="mt-8 flex flex-wrap gap-x-8 gap-y-4">
          {TRUST_CHIPS.map((t) => (
            <div key={t.label} className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/40 text-gold">
                <t.icon size={17} />
              </span>
              <span className="text-sm text-cream/75">{t.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function FilterGroup({ title, children }: { title: string; children: ReactNode }) {
  const [open, setOpen] = useState(true)
  return (
    <div className="border-b border-cream/10 py-5 first:pt-0">
      <button onClick={() => setOpen((v) => !v)} className="flex w-full items-center justify-between text-left">
        <span className="text-sm font-medium uppercase tracking-[0.18em] text-cream">{title}</span>
        <ChevronDown size={14} className={`text-cream/50 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open ? <div className="mt-4 flex flex-col gap-3">{children}</div> : null}
    </div>
  )
}

function FilterSidebar({
  def,
  facets,
  sizes,
  setSizes,
  materials,
  setMaterials,
  colors,
  setColors,
  bucket,
  setBucket,
  anyFilter,
  clearAll,
}: {
  def: CollectionDef
  facets: { sizes: readonly (readonly [string, number])[]; materials: readonly (readonly [string, number])[]; colors: readonly (readonly [string, number])[] }
  sizes: string[]
  setSizes: (s: string) => void
  materials: string[]
  setMaterials: (m: string) => void
  colors: string[]
  setColors: (c: string) => void
  bucket: PriceBucket
  setBucket: (b: PriceBucket) => void
  anyFilter: boolean
  clearAll: () => void
}) {
  return (
    <aside data-reveal className="lg:sticky lg:top-28 lg:self-start">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="font-display text-xl text-cream">Filters</h2>
        {anyFilter ? (
          <button onClick={clearAll} className="text-xs uppercase tracking-wide text-gold underline underline-offset-4">
            Clear All
          </button>
        ) : null}
      </div>

      <FilterGroup title="Size">
        {facets.sizes.map(([s, count]) => (
          <label key={s} className="flex cursor-pointer items-center justify-between gap-2 text-sm text-cream/75">
            <span className="flex items-center gap-2.5">
              <span
                className={`flex h-4 w-4 items-center justify-center rounded border transition-colors ${
                  sizes.includes(s) ? 'border-gold bg-gold text-ink' : 'border-cream/25'
                }`}
              >
                {sizes.includes(s) ? <CheckIcon size={10} strokeWidth={3} /> : null}
              </span>
              <input type="checkbox" className="hidden" checked={sizes.includes(s)} onChange={() => setSizes(s)} />
              {s}
            </span>
            <span className="text-cream/40">({count})</span>
          </label>
        ))}
      </FilterGroup>

      <FilterGroup title="Material">
        {facets.materials.map(([m, count]) => (
          <label key={m} className="flex cursor-pointer items-center justify-between gap-2 text-sm text-cream/75">
            <span className="flex items-center gap-2.5">
              <span
                className={`flex h-4 w-4 items-center justify-center rounded border transition-colors ${
                  materials.includes(m) ? 'border-gold bg-gold text-ink' : 'border-cream/25'
                }`}
              >
                {materials.includes(m) ? <CheckIcon size={10} strokeWidth={3} /> : null}
              </span>
              <input type="checkbox" className="hidden" checked={materials.includes(m)} onChange={() => setMaterials(m)} />
              {m}
            </span>
            <span className="text-cream/40">({count})</span>
          </label>
        ))}
      </FilterGroup>

      <FilterGroup title="Color">
        <div className="flex flex-wrap gap-2.5">
          {facets.colors.map(([c]) => (
            <button
              key={c}
              aria-label={c}
              title={c}
              onClick={() => setColors(c)}
              className={`relative h-8 w-8 rounded-full border-2 transition-transform hover:scale-110 ${
                colors.includes(c) ? 'border-gold' : 'border-cream/20'
              }`}
              style={{ backgroundColor: SWATCHES[c] ?? '#999' }}
            >
              {colors.includes(c) ? (
                <CheckIcon
                  size={13}
                  strokeWidth={3}
                  className="absolute inset-0 m-auto text-cream drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
                />
              ) : null}
            </button>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title="Price">
        {PRICE_BUCKETS.map((b) => (
          <label key={b.id} className="flex cursor-pointer items-center gap-2.5 text-sm text-cream/75">
            <span
              className={`flex h-4 w-4 items-center justify-center rounded-full border transition-colors ${
                bucket === b.id ? 'border-gold' : 'border-cream/25'
              }`}
            >
              {bucket === b.id ? <span className="h-2 w-2 rounded-full bg-gold" /> : null}
            </span>
            <input type="radio" className="hidden" checked={bucket === b.id} onChange={() => setBucket(b.id)} />
            {b.label}
          </label>
        ))}
      </FilterGroup>

      <p className="mt-6 flex items-center gap-2 text-xs text-cream/45">
        <RulerIcon size={14} />
        Need a size chart? See {def.breadcrumb} sizing guide.
      </p>
      <p className="mt-2 flex items-center gap-2 text-xs text-cream/45">
        <ScissorsIcon size={14} />
        Handcrafted in Hyderabad, made to order.
      </p>
    </aside>
  )
}

export function ProductCard({
  p,
  slug,
  index,
  wished,
  toggleWish,
}: {
  p: CollectionProduct
  slug: string
  index: number
  wished: boolean
  toggleWish: () => void
}) {
  return (
    <article data-reveal data-reveal-delay={Math.min(index, 6) * 0.06} className="group">
      <Link
        to={`/collections/${slug}/product/${p.id}`}
        className="relative block aspect-[3/4] overflow-hidden rounded-[1.5rem] bg-gradient-to-b from-ink-soft to-forest/40 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.7)] transition-shadow duration-500 group-hover:shadow-[0_44px_80px_-30px_rgba(0,0,0,0.85)]">
        {!p.slot || !hasMedia(p.slot) ? (
          <>
            <div
              className="absolute inset-0"
              style={{ background: 'radial-gradient(70% 55% at 50% 38%, rgba(255,255,255,0.06), transparent 70%)' }}
            />
            <PawIcon size={80} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-gold/10" />
          </>
        ) : null}

        {p.slot ? (
          <>
            <div className="absolute inset-0 overflow-hidden">
              <Media slot={p.slot} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
            </div>
            {p.hoverSlot ? (
              <div className="absolute inset-0 overflow-hidden opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                <Media slot={p.hoverSlot} className="h-full w-full object-cover" />
              </div>
            ) : null}
          </>
        ) : null}

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-ink/60 to-transparent" />

        {p.badge ? (
          <span className="absolute left-3.5 top-3.5 rounded-full bg-gold px-3 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-ink">
            {p.badge}
          </span>
        ) : null}

        <button
          aria-label={`Add ${p.name} to wishlist`}
          onClick={(e) => {
            e.preventDefault()
            toggleWish()
          }}
          className={`absolute right-3.5 top-3.5 flex h-9 w-9 items-center justify-center rounded-full backdrop-blur transition-colors duration-300 ${
            wished ? 'bg-gold text-ink' : 'bg-ink/40 text-cream hover:bg-ink/60'
          }`}
        >
          <HeartIcon size={16} fill={wished ? 'currentColor' : 'none'} />
        </button>

        <span className="absolute inset-x-3.5 bottom-3.5 flex translate-y-[220%] items-center justify-center gap-2 rounded-full bg-cream py-2.5 text-sm font-medium text-ink transition-transform duration-500 group-hover:translate-y-0">
          <BagIcon size={15} />
          View Product
        </span>
      </Link>

      <Link to={`/collections/${slug}/product/${p.id}`} className="mt-4 block">
        <h3 className="font-display text-[1.05rem] leading-snug text-cream transition-colors group-hover:text-gold-soft">{p.name}</h3>
        <p className="mt-1 text-[13px] text-cream/55">{p.blurb}</p>

        <div className="mt-2 flex items-center gap-1.5">
          <span className="flex items-center gap-0.5 text-gold">
            {Array.from({ length: 5 }, (_, s) => (
              <StarIcon key={s} size={12} className={s < Math.round(p.rating) ? '' : 'text-cream/15'} />
            ))}
          </span>
          <span className="text-xs text-cream/45">({p.reviews.toLocaleString('en-IN')})</span>
        </div>

        <div className="mt-2.5 flex items-baseline gap-2">
          <span className="text-[15px] font-semibold text-cream">{formatINR(p.price)}</span>
          {p.was ? <span className="text-sm text-cream/40 line-through">{formatINR(p.was)}</span> : null}
          {p.was ? (
            <span className="text-xs font-medium text-gold">{Math.round((1 - p.price / p.was) * 100)}% OFF</span>
          ) : null}
        </div>

        <div className="mt-2.5 flex items-center gap-1.5">
          {p.colors.slice(0, 5).map((c) => (
            <span
              key={c}
              title={c}
              className="h-3.5 w-3.5 rounded-full border border-cream/20"
              style={{ backgroundColor: SWATCHES[c] ?? '#999' }}
            />
          ))}
        </div>
      </Link>
    </article>
  )
}
