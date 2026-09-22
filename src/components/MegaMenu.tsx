import { useState } from 'react'
import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion'
import type { ComponentType, SVGProps } from 'react'
import { Link } from 'react-router-dom'
import Media, { hasMedia, type SlotName } from './Media'
import { ArrowRight, ArrowUpRight, ChevronDown, GiftIcon, PawIcon, PercentIcon, SparkleIcon } from './Icons'
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

const offerIcons: Icon[] = [GiftIcon, GiftIcon, SparkleIcon, PercentIcon]

/**
 * Collections: a three-column spotlight, deliberately unlike Shop's two-column
 * list-and-preview — a photo-avatar list on the left, a static spotlight card
 * in the middle, and an icon-led offers list on the right.
 */
function CollectionsSpotlight() {
  const [active, setActive] = useState(0)
  const current = occasions[active]
  const picks = occasions.filter((_, i) => i !== active).slice(0, 3)

  return (
    <div className="grid items-start gap-8 p-6 lg:grid-cols-[220px_1fr_220px] lg:p-9">
      {/* Left: occasion list with photo avatars */}
      <div>
        <p className="mb-4 text-[11px] uppercase tracking-[0.34em] text-gold">Shop by Occasion</p>
        <ul className="flex flex-col gap-1">
          {occasions.map((o, i) => (
            <li key={o.name}>
              <button
                onClick={() => setActive(i)}
                onMouseEnter={() => setActive(i)}
                className={`flex w-full items-center gap-3 rounded-xl px-2.5 py-2 text-left transition-colors duration-300 ${
                  active === i ? 'bg-cream/[0.08]' : 'hover:bg-cream/[0.04]'
                }`}
              >
                <span className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full border border-cream/15">
                  {hasMedia(o.slot) ? (
                    <Media slot={o.slot} className="h-full w-full object-cover" />
                  ) : (
                    <span className="flex h-full w-full items-center justify-center bg-forest">
                      <PawIcon size={14} className="text-gold/50" />
                    </span>
                  )}
                </span>
                <span className={`min-w-0 flex-1 truncate text-sm ${active === i ? 'text-gold-soft' : 'text-cream/80'}`}>
                  {o.name}
                </span>
                <ChevronDown size={13} className={`-rotate-90 shrink-0 ${active === i ? 'text-gold' : 'text-cream/30'}`} />
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Centre: static spotlight for the active occasion */}
      <div>
        <p className="mb-3 text-[11px] uppercase tracking-[0.34em] text-gold">The Occasion Edit</p>
        <div className="overflow-hidden rounded-[1.75rem] border border-cream/10 bg-forest/40 p-5 pb-0">
          <div className="relative mx-auto aspect-square w-full max-w-[220px] overflow-hidden rounded-2xl bg-gradient-to-br from-moss to-forest">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={current.slot}
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.55, ease }}
                className="absolute inset-0"
              >
                {hasMedia(current.slot) ? (
                  <Media eager slot={current.slot} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <PawIcon size={64} className="text-gold/25" />
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/40 via-transparent to-transparent" />
            <AnimatePresence mode="wait" initial={false}>
              <motion.p
                key={current.tag}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
                className="pointer-events-none absolute bottom-3 left-4 font-script text-3xl leading-none text-cream drop-shadow-[0_2px_8px_rgba(0,0,0,0.55)]"
              >
                {current.tag}
              </motion.p>
            </AnimatePresence>
          </div>

          <div className="flex items-center justify-between gap-4 p-5">
            <div className="min-w-0">
              <h3 className="truncate font-display text-xl text-cream">{current.name}</h3>
              <p className="mt-1 truncate text-[13px] text-cream/55">{current.blurb}</p>
            </div>
            <span className="flex shrink-0 items-center gap-2 rounded-full bg-gold px-4 py-2 text-xs font-medium tracking-wide text-ink">
              Explore Now
              <ArrowRight size={13} />
            </span>
          </div>
        </div>

        <p className="mb-3 mt-6 text-[11px] uppercase tracking-[0.3em] text-cream/40">Also in the Edit</p>
        <div className="flex gap-3">
          {picks.map((p) => (
            <button
              key={p.name}
              onClick={() => setActive(occasions.indexOf(p))}
              className="group flex flex-1 items-center gap-2 rounded-xl border border-cream/10 px-3 py-2 text-left transition-colors hover:border-gold/40"
            >
              <span className="relative h-8 w-8 shrink-0 overflow-hidden rounded-lg">
                {hasMedia(p.slot) ? (
                  <Media slot={p.slot} className="h-full w-full object-cover" />
                ) : (
                  <span className="flex h-full w-full items-center justify-center bg-forest">
                    <PawIcon size={12} className="text-gold/40" />
                  </span>
                )}
              </span>
              <span className="min-w-0 flex-1 truncate text-[12.5px] text-cream/70 group-hover:text-cream">{p.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Right: offers list, icon-led rather than photo-led */}
      <div>
        <p className="mb-4 text-[11px] uppercase tracking-[0.34em] text-gold">Shop the Offers</p>
        <ul className="flex flex-col gap-1">
          {collectionQuick.map((q, i) => {
            const Icon = offerIcons[i]
            return (
              <li key={q}>
                <a
                  href="#"
                  className="group flex items-center gap-3 rounded-xl px-2.5 py-2.5 transition-colors duration-300 hover:bg-cream/[0.05]"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gold/30 text-gold transition-colors group-hover:bg-gold group-hover:text-ink">
                    <Icon size={15} />
                  </span>
                  <span className="min-w-0 flex-1 truncate text-sm text-cream/80 group-hover:text-cream">{q}</span>
                  <ArrowRight size={13} className="shrink-0 text-cream/25 transition-transform group-hover:translate-x-0.5 group-hover:text-gold" />
                </a>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

export default function MegaMenu({ kind }: { kind: 'shop' | 'collections' }) {
  return kind === 'collections' ? <CollectionsSpotlight /> : <ListMenu kind="shop" />
}
