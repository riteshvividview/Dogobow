import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { navLinks } from '../data/content'
import MegaMenu from './MegaMenu'
import Logo from './Logo'
import {
  BagIcon,
  ChevronDown,
  CloseIcon,
  HeartIcon,
  MenuIcon,
  SearchIcon,
  UserIcon,
} from './Icons'

function Badge({ n }: { n: number }) {
  return (
    <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-gold text-[9px] font-semibold text-ink">
      {n}
    </span>
  )
}

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [menu, setMenu] = useState<'shop' | 'collections' | null>(null)

  useEffect(() => {
    let last = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 40)
      setHidden(y > last && y > 240)
      last = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: hidden && !open ? -120 : 0, opacity: 1 }}
      onMouseLeave={() => setMenu(null)}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-6 sm:pt-4"
    >
      <nav
        className={`mx-auto flex max-w-7xl items-center justify-between gap-4 rounded-full px-5 py-3 transition-all duration-500 sm:px-7 ${
          scrolled || open || menu
            ? 'border border-cream/10 bg-ink/55 shadow-[0_10px_50px_-10px_rgba(0,0,0,0.7)] backdrop-blur-xl'
            : 'border border-transparent bg-transparent'
        }`}
      >
        <a href="#" aria-label="Dogobow home" className="group -my-3 flex shrink-0 items-center transition-transform duration-500 hover:scale-105">
          <Logo className="h-[52px]" />
        </a>

        <ul className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <li key={link.label} onMouseEnter={() => setMenu('menu' in link && link.menu ? link.menu : null)}>
              <a
                href="#"
                className={`group relative flex items-center gap-1 text-sm tracking-wide transition-colors duration-300 ${
                  link.active ? 'text-gold' : 'text-cream/85 hover:text-gold'
                }`}
              >
                {link.label}
                {link.chevron ? <ChevronDown size={12} className={`transition-transform duration-300 ${menu === ('menu' in link ? link.menu : null) ? 'rotate-180' : ''}`} /> : null}
                <span
                  className={`absolute -bottom-2 left-1/2 h-[3px] w-[3px] -translate-x-1/2 rounded-full bg-gold transition-opacity duration-300 ${
                    link.active ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                  }`}
                />
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-4 sm:gap-5">
          <label className="hidden items-center gap-2 rounded-full border border-cream/10 bg-white/5 px-4 py-2 transition-colors focus-within:border-gold/60 xl:flex">
            <SearchIcon size={16} className="text-cream/60" />
            <input
              type="text"
              placeholder="Search for joy..."
              className="w-40 bg-transparent text-sm text-cream placeholder:text-cream/45 focus:outline-none"
            />
          </label>
          <button aria-label="Account" className="hidden text-cream/85 transition-colors hover:text-gold sm:block">
            <UserIcon size={20} />
          </button>
          <button aria-label="Wishlist" className="relative hidden text-cream/85 transition-colors hover:text-gold sm:block">
            <HeartIcon size={20} />
            <Badge n={3} />
          </button>
          <button aria-label="Cart" className="relative text-cream/85 transition-colors hover:text-gold">
            <BagIcon size={20} />
            <Badge n={0} />
          </button>
          <button
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="text-cream lg:hidden"
          >
            {open ? <CloseIcon size={22} /> : <MenuIcon size={22} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {menu ? (
          <motion.div
            key={menu}
            initial={{ opacity: 0, y: -14, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto mt-3 hidden max-w-7xl overflow-hidden rounded-[2rem] border border-cream/10 bg-ink/90 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.9)] backdrop-blur-2xl lg:block"
          >
            <MegaMenu key={menu} kind={menu} />
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="glass mx-auto mt-3 max-w-7xl rounded-3xl bg-ink/80 p-6 lg:hidden"
          >
            <ul className="flex flex-col gap-1">
              {navLinks.map((link, i) => (
                <motion.li
                  key={link.label}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.06 * i + 0.1 }}
                >
                  <a
                    href="#"
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between border-b border-cream/10 py-3.5 font-display text-2xl text-cream"
                  >
                    {link.label}
                    <span className="text-sm text-gold">0{i + 1}</span>
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.header>
  )
}
