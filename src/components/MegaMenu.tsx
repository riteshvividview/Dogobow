import { useState } from 'react'
import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion'
import type { ComponentType, SVGProps } from 'react'
import { Link } from 'react-router-dom'
import Media, { hasMedia, type SlotName } from './Media'
import { ArrowRight, ArrowUpRight, PawIcon } from './Icons'
import { categories, occasions } from '../data/content'

type Icon = ComponentType<SVGProps<SVGSVGElement> & { size?: number }>

interface Entry {
  title: string
  blurb: string
  slot: SlotName
  tag: string
  icon?: Icon
  slug?: string
}

const shopEntries: Entry[] = categories.map((c, i) => ({
  title: c.title,
  blurb: c.blurb,
  slot: c.heroSlot,
  icon: c.icon,
  slug: c.slug,
  tag: ['Dressed to Impress', 'Made for Walks', 'The Finishing Flourish', 'Sleep Like Royalty', 'Bowl of Joy', 'Made Just for Them'][i],
}))

const collectionEntries: Entry[] = occasions.map((o) => ({
  title: o.name,
  blurb: o.blurb,
  slot: o.slot,
  tag: o.tag,
}))

const shopQuick = ['Best Sellers', 'New Arrivals', 'Personalize Me', 'Under ₹500']
const collectionQuick = ['Buy 2 Get 1', 'Buy 3 Get 2', 'Festive Edit', 'Up to 50% Off']

const ease = [0.22, 1, 0.36, 1] as const

function ListMenu({ kind }: { kind: 'shop' | 'collections' }) {
  const entries = kind === 'shop' ? shopEntries : collectionEntries
  const quick = kind === 'shop' ? shopQuick : collectionQuick
  const [active, setActive] = useState(0)
  const current = entries[active]

  const mx = useSpring(useMotionValue(0), { stiffness: 90, damping: 18 })
  const my = useSpring(useMotionValue(0), { stiffness: 90, damping: 18 })

  return (
    <div className="grid gap-8 p-6 lg:grid-cols-[1.05fr_0.95fr] lg:p-9">
      <div className="flex flex-col">
        <div className="mb-4 flex items-center gap-4">
          <span className="text-[11px] uppercase tracking-[0.34em] text-gold">
            {kind === 'shop' ? 'Shop by Category' : 'The Occasion Edit'}
          </span>
          <span className="h-px flex-1 bg-cream/10" />
        </div>

        <ul className="flex flex-col">
          {entries.map((e, i) => (
            <motion.li
              key={e.title}
              initial={{ opacity: 0, x: -18 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.04 * i + 0.05, ease }}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
            >
              <Link
                to={e.slug ? `/collections/${e.slug}` : '#'}
                className="group relative flex items-center gap-4 border-b border-cream/10 py-3.5"
              >
                <span
                  className={`w-7 text-[11px] tracking-[0.3em] transition-colors duration-300 ${
                    active === i ? 'text-gold' : 'text-cream/35'
                  }`}
                >
                  0{i + 1}
                </span>
                <span className="min-w-0 flex-1">
                  <span
                    className={`block font-display text-[1.45rem] leading-tight transition-all duration-500 ease-out ${
                      active === i ? 'translate-x-2 italic text-gold-soft' : 'text-cream/85'
                    }`}
                  >
                    {e.title}
                  </span>
                  <span
                    className={`block overflow-hidden text-[13px] leading-snug text-cream/55 transition-all duration-500 ease-out ${
                      active === i ? 'mt-1 max-h-10 translate-x-2 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    {e.blurb}
                  </span>
                </span>
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-all duration-500 ${
                    active === i
                      ? 'border-gold bg-gold text-ink'
                      : 'border-cream/20 text-cream/50'
                  }`}
                >
                  <ArrowUpRight size={16} className={active === i ? 'rotate-45 transition-transform duration-500' : 'transition-transform duration-500'} />
                </span>
              </Link>
            </motion.li>
          ))}
        </ul>

        <div className="mt-5 flex flex-wrap gap-2">
          {quick.map((q, i) => (
            <motion.a
              key={q}
              href="#"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 + i * 0.05, duration: 0.4 }}
              className="rounded-full border border-cream/15 px-4 py-1.5 text-xs tracking-wide text-cream/75 transition-colors hover:border-gold hover:text-gold"
            >
              {q}
            </motion.a>
          ))}
        </div>
      </div>

      {/* Live preview that trails the cursor */}
      <div
        className="relative hidden lg:block"
        onMouseMove={(ev) => {
          const r = ev.currentTarget.getBoundingClientRect()
          mx.set(-((ev.clientX - r.left) / r.width - 0.5) * 28)
          my.set(-((ev.clientY - r.top) / r.height - 0.5) * 22)
        }}
        onMouseLeave={() => {
          mx.set(0)
          my.set(0)
        }}
      >
        <div className="relative h-full min-h-[380px] overflow-hidden rounded-[2rem] bg-gradient-to-br from-moss to-forest shadow-[0_30px_70px_-30px_rgba(0,0,0,0.9)]">
          <AnimatePresence initial={false}>
            <motion.div
              key={current.slot}
              initial={{ opacity: 0, scale: 1.12 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.65, ease }}
              className="absolute inset-0"
            >
              <motion.div style={{ x: mx, y: my }} className="absolute -inset-5">
                {hasMedia(current.slot) ? (
                  <Media eager slot={current.slot} className="h-full w-full object-cover" />
                ) : current.icon ? (
                  <current.icon size={110} strokeWidth={0.8} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-gold/30" />
                ) : (
                  <PawIcon size={110} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-gold/25" />
                )}
              </motion.div>
            </motion.div>
          </AnimatePresence>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/85 via-transparent to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-ink/60 to-transparent" />

          <AnimatePresence mode="wait" initial={false}>
            <motion.p
              key={current.tag}
              initial={{ opacity: 0, y: 12, rotate: -4 }}
              animate={{ opacity: 1, y: 0, rotate: -4 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease }}
              className="pointer-events-none absolute left-6 top-5 font-script text-5xl leading-[0.85] text-cream drop-shadow-[0_2px_10px_rgba(0,0,0,0.55)]"
            >
              {current.tag}
            </motion.p>
          </AnimatePresence>

          <Link
            to={current.slug ? `/collections/${current.slug}` : '#'}
            className="group absolute bottom-5 left-5 right-5 flex items-center justify-between rounded-full border border-cream/20 bg-ink/50 px-5 py-3 text-sm text-cream backdrop-blur-md transition-colors duration-300 hover:border-gold hover:bg-gold hover:text-ink"
          >
            <span className="truncate">Explore {current.title}</span>
            <ArrowRight size={16} className="ml-3 shrink-0 transition-transform duration-500 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </div>
  )
}

const BLOB_RADII = ["58% 42% 55% 45% / 48% 56% 44% 52%","44% 56% 40% 60% / 55% 45% 55% 45%","52% 48% 60% 40% / 42% 58% 42% 58%","46% 54% 44% 56% / 58% 42% 58% 42%","60% 40% 50% 50% / 46% 54% 46% 54%","42% 58% 52% 48% / 54% 46% 54% 46%"]

/** Collections: a grid of occasion cards. Each photo shows in full inside its own organic frame; text sits on solid dark. */
function CollectionsGallery() {
  const [hover, setHover] = useState<number | null>(null)

  return (
    <div className="p-6 lg:p-9">
      <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-4">
            <span className="text-[11px] uppercase tracking-[0.34em] text-gold">The Occasion Edit</span>
            <span className="h-px w-16 bg-cream/15" />
          </div>
          <h3 className="mt-3 font-display text-[2rem] leading-none text-cream">
            Dress every celebration, <span className="italic text-gold-soft">beautifully.</span>
          </h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {collectionQuick.map((q) => (
            <a
              key={q}
              href="#"
              className="rounded-full border border-cream/15 px-4 py-1.5 text-xs tracking-wide text-cream/75 transition-colors hover:border-gold hover:text-gold"
            >
              {q}
            </a>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4" onMouseLeave={() => setHover(null)}>
        {occasions.map((o, i) => {
          const on = hover === i
          return (
            <motion.a
              key={o.name}
              href="#"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: hover !== null && !on ? 0.55 : 1, y: 0 }}
              transition={{ duration: 0.5, delay: hover === null ? 0.05 * i + 0.05 : 0, ease }}
              onMouseEnter={() => setHover(i)}
              onFocus={() => setHover(i)}
              className={`group relative flex items-center gap-5 rounded-[1.75rem] border p-4 pr-6 transition-[border-color,background-color,transform] duration-500 ${
                on ? "-translate-y-1 border-gold/60 bg-cream/[0.07]" : "border-cream/10 bg-cream/[0.03]"
              }`}
            >
              <span
                className={`relative block h-[132px] w-[132px] shrink-0 overflow-hidden bg-gradient-to-br from-moss to-forest transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)] ${
                  on ? "scale-[1.06] -rotate-3" : ""
                }`}
                style={{ borderRadius: BLOB_RADII[i] }}
              >
                {hasMedia(o.slot) ? (
                  <Media
                    eager
                    slot={o.slot}
                    className={`h-full w-full object-cover transition-transform duration-1000 ease-[cubic-bezier(.22,1,.36,1)] ${on ? "scale-110" : "scale-100"}`}
                  />
                ) : (
                  <PawIcon size={48} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-gold/30" />
                )}
              </span>

              <span className="min-w-0 flex-1">
                <span className={`block text-[11px] tracking-[0.3em] transition-colors duration-500 ${on ? "text-gold" : "text-cream/40"}`}>
                  0{i + 1}
                </span>
                <span className={`mt-1 block font-display text-[1.35rem] leading-tight transition-colors duration-500 ${on ? "text-gold-soft" : "text-cream"}`}>
                  {o.name}
                </span>
                <span className="mt-1 block font-script text-[1.7rem] leading-[0.9] text-gold/80">{o.tag}</span>
                <span className="mt-2 block text-[12.5px] leading-snug text-cream/60">{o.blurb}</span>
              </span>

              <span
                className={`absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full border transition-all duration-500 ${
                  on ? "border-gold bg-gold text-ink" : "border-cream/20 text-cream/50"
                }`}
              >
                <ArrowUpRight size={14} className={`transition-transform duration-500 ${on ? "rotate-45" : ""}`} />
              </span>
            </motion.a>
          )
        })}
      </div>
    </div>
  )
}

export default function MegaMenu({ kind }: { kind: 'shop' | 'collections' }) {
  return kind === 'collections' ? <CollectionsGallery /> : <ListMenu kind="shop" />
}
