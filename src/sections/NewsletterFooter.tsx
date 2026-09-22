import { useRef } from 'react'
import { gsap, useGSAP } from '../lib/gsap'
import { Link } from 'react-router-dom'
import Wave from '../components/Wave'
import {
  ArrowRight,
  FacebookIcon,
  InstagramIcon,
  PawIcon,
  PinIcon,
  PinterestIcon,
  PlayIcon,
  XIcon,
  YoutubeIcon,
} from '../components/Icons'
import Logo from '../components/Logo'
import { footerColumns } from '../data/content'

const FOOTER_SLUGS: Record<string, string> = {
  'Couture & Clothing': 'couture-clothing',
  'Walking Essentials': 'walking-essentials',
  'Beds & Lounge': 'beds-lounge',
}

const socials = [
  { label: 'Instagram', icon: InstagramIcon },
  { label: 'Facebook', icon: FacebookIcon },
  { label: 'YouTube', icon: YoutubeIcon },
  { label: 'Pinterest', icon: PinterestIcon },
  { label: 'X', icon: XIcon },
]

export default function NewsletterFooter() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      gsap.to('[data-pulse]', {
        scale: 1.6,
        opacity: 0,
        duration: 2.2,
        stagger: 1.1,
        repeat: -1,
        ease: 'power2.out',
      })
      gsap.to('[data-drift]', {
        y: -10,
        rotation: -8,
        duration: 3.2,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
      })
    },
    { scope: root },
  )


  return (
    <footer ref={root} data-parallax-root className="relative bg-ink text-cream">
      <Wave className="text-ink" />

      {/* Links */}
      <div className="relative mx-auto max-w-7xl px-6 sm:px-10 lg:px-16">
        <div className="flex flex-col gap-6 pb-2 pt-16 sm:flex-row sm:items-center sm:justify-between">
          <a href="#" aria-label="Dogobow home" className="transition-transform duration-500 hover:scale-105">
            <Logo className="h-24" />
          </a>
          <p className="text-[10px] uppercase leading-relaxed tracking-[0.36em] text-cream/50">
            Happier Tails
            <br />
            Brighter Days
          </p>
        </div>
        <div className="grid gap-12 border-t border-gold/25 pb-16 pt-10 sm:grid-cols-3 lg:grid-cols-[1fr_1fr_1fr_1.7fr]">
          {footerColumns.map((col) => (
            <div key={col.heading}>
              <p className="text-[11px] uppercase tracking-[0.34em] text-cream/50">{col.heading}</p>
              <ul className="mt-6 flex flex-col gap-3.5">
                {col.links.map((l) => (
                  <li key={l}>
                    <Link
                      to={FOOTER_SLUGS[l] ? `/collections/${FOOTER_SLUGS[l]}` : '#'}
                      className="group relative inline-block text-[15px] text-cream/80 transition-colors duration-300 hover:text-gold"
                    >
                      {l}
                      <span className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-gold transition-transform duration-500 group-hover:scale-x-100" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="relative border-cream/10 sm:col-span-3 lg:col-span-1 lg:border-l lg:pl-12">
            <p className="text-[11px] uppercase tracking-[0.34em] text-cream/50">Our Mission</p>
            <p className="mt-6 text-[15px] leading-relaxed text-cream/85">
              Thoughtful products.
              <br />
              Happier pets.
              <br />A kinder tomorrow.
            </p>
            <span className="mt-6 block h-px w-8 bg-gold" />
            <button className="group mt-6 flex items-center gap-5" data-magnetic>
              <span className="relative flex h-14 w-14 items-center justify-center rounded-full border border-gold/60 text-gold transition-colors duration-500 group-hover:bg-gold group-hover:text-ink">
                <span data-pulse className="absolute inset-0 rounded-full border border-gold/60" />
                <PlayIcon size={16} className="ml-0.5" />
              </span>
              <span className="text-[11px] uppercase tracking-[0.3em]">Watch our story</span>
            </button>
            <div className="mt-8 flex items-center gap-2 text-sm text-cream/55">
              <PinIcon size={16} className="text-gold" />
              Handcrafted in Hyderabad, India
            </div>
          </div>
        </div>

        <div className="flex flex-col items-start gap-8 border-t border-gold/25 py-10 md:flex-row md:items-center">
          <ul className="flex gap-3">
            {socials.map((s) => (
              <li key={s.label}>
                <a
                  href="#"
                  aria-label={s.label}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-cream/20 text-cream/85 transition-all duration-500 hover:-translate-y-1 hover:border-gold hover:bg-gold hover:text-ink"
                >
                  <s.icon size={18} />
                </a>
              </li>
            ))}
          </ul>
          <span className="hidden h-8 w-px bg-cream/15 md:block" />
          <a href="#" className="group flex items-center gap-3 font-display text-lg">
            Join a kinder community
            <ArrowRight size={18} className="text-gold transition-transform duration-500 group-hover:translate-x-2" />
          </a>
          <p
            data-drift
            className="font-script text-5xl leading-[0.85] text-cream/55 md:ml-auto md:-rotate-6"
          >
            More Wagging, Less Worrying
            <PawIcon size={14} className="ml-2 inline text-gold/80" />
          </p>
        </div>
      </div>

      {/* Giant wordmark */}
      <div className="pointer-events-none relative h-[clamp(5rem,17vw,15rem)] select-none overflow-hidden">
        <p
          data-parallax="-0.25"
          className="text-outline absolute inset-x-0 top-[2%] text-center font-display text-[clamp(7rem,26vw,24rem)] italic leading-none text-cream/15"
        >
          Dogobow
        </p>
      </div>

      <div className="relative border-t border-cream/10">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-4 px-6 py-7 text-xs text-cream/45 sm:px-10 md:flex-row md:items-center lg:px-16">
          <p>© 2026 Dogobow. All rights reserved.</p>
          <ul className="flex gap-6">
            {['Privacy Policy', 'Terms of Service', 'Cookie Preferences'].map((l) => (
              <li key={l}>
                <a href="#" className="transition-colors hover:text-gold">
                  {l}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  )
}
