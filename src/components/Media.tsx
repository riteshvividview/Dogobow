import type { ImgHTMLAttributes } from 'react'

/**
 * Drop-in imagery. Put a file named after a slot anywhere under src/assets/images/ (one folder per section)
 * (e.g. home-page/01-hero/hero-dog.png) and it appears in that spot with
 * no code changes. Slots without a file render nothing.
 *
 * Give layered PSD exports their own slot (hero-background-image, hero-mid, hero-dog,
 * hero-fg) — each carries data-parallax / data-depth so it drifts at its
 * own speed.
 */
export const SLOTS = [
  // Hero (layered parallax)
  'hero-background-image',
  'hero-background-image-wide',
  'hero-mid',
  'hero-dog',
  'hero-fg',
  // Hero category cards
  'Couture-and-Clothing',
  'Walking-Essentials',
  'Bandanas-and-Bows',
  'Beds-and-Lounge',
  'Pet-food',
  'Personalize-me-image',
  // Atelier
  'atelier-portrait',
  'atelier-fabrics',
  'atelier-joy',
  'atelier-ribbon',
  // Featured products (cut-outs on transparent background work best)
  'collar-product',
  'collar-product-onhover',
  'Aqua Strip Tuxedo Vest Bandana',
  'Aqua Strip Tuxedo Vest Bandana onhover',
  'Army Green Body Suit Raincoat',
  'Army Green Body Suit Raincoat onhover',
  'Aztec Print H-Harness',
  'Aztec Print H-Harness onhover',
  // Category showcase arches
  'dog-on-sofa-background',
  'couture-clothing',
  'Walking-ess',
  'bandanas-bows',
  'Beds-Lounge',
  'food-pet',
  'personalize',
  'festive-edit',
  // Occasion edit hover images
  'Diwali-essentials',
  'rakhi-collection',
  'christmas-collection',
  'halloween-collection',
  'Birthday-essentials',
  'IPL-collection',
  // Brand story chapters
  'background-img',
  '1st-card',
  '2nd-card',
  '3rd-card',
  // Stories / reviews
  'section-bg',
  'middle-circle-img',
  'testinomial',
  'testinomial (1)',
  'testinomial (2)',
  'review-4',
  // Newsletter / footer
  'footer-bg',
] as const

export type SlotName = (typeof SLOTS)[number]

const files = import.meta.glob('/src/assets/images/**/*.{png,jpg,jpeg,webp,avif,svg,mp4,webm}', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>

const bySlot: Record<string, string> = {}
for (const [path, url] of Object.entries(files)) {
  const name = path.split('/').pop()!.replace(/\.[^.]+$/, '')
  bySlot[name] = url
}

export function hasMedia(slot: SlotName) {
  return slot in bySlot
}

interface MediaProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  slot: SlotName
}

export default function Media({ slot, alt = '', className = '', ...rest }: MediaProps) {
  const src = bySlot[slot]
  if (!src) return null
  return (
    <img
      src={src}
      alt={alt}
      draggable={false}
      data-slot={slot}
      className={className}
      {...rest}
    />
  )
}

/** URL of any file under src/assets/images/ (images or video) by its base file name. */
export function mediaUrl(name: string): string | undefined {
  return bySlot[name]
}
