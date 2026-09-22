import { useEffect, useRef, useState, type ImgHTMLAttributes } from 'react'

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
  // Collections — Couture & Clothing
  'Red-Aztec-Knit-Sweater-product',
  'Red-Aztec-Knit-Sweater-product-with-dog',
  'Sun-kissed-Yellow-Knit-Sweater-product',
  'Sun-kissed-Yellow-Knit-Sweater-product-with-dog',
  'Blue-Panda-Knit-Sweater-product',
  'Blue-Panda-Knit-Sweater-product-with-dog',
  'Red-Reindeer-Knit-Sweater-product',
  'Red-Reindeer-Knit-Sweater-product-with-dog',
  'Pom-Pom-Winter-Hoodie',
  'Pom-Pom-Winter-Hoodie-with-dog',
  'The-Good-Dino-Hoodie',
  'The-Good-Dino-Hoodie-with-dog',
  'Red-Black-Hoodies-product',
  'Red-Black-Hoodies-product-with-dog',
  'Rainbow-Fur Jacket-product',
  'Rainbow-Fur Jacket-product-with-dog',
  'Navy-Blue-Denim-Jacket-product',
  'Navy-Blue-Denim-Jacket-product-with-dog',
  'Orange Denim Jacket-product',
  'Orange Denim Jacket-product-with-dog',
  'Red-Denim-Jacket-product',
  'Red-Denim-Jacket-product-with-dog',
] as const

export type SlotName = (typeof SLOTS)[number]

// Photos are re-encoded to WebP at build time (originals stay untouched in the folders).
// Backgrounds keep more width; everything else is capped at 1000px, which covers 2x cards.
const bgFiles = import.meta.glob(
  ['/src/assets/images/**/*background*.{png,jpg,jpeg}', '/src/assets/images/**/*-bg*.{png,jpg,jpeg}'],
  {
    eager: true,
    query: { format: 'webp', w: 1920, quality: 76 },
    import: 'default',
  },
) as Record<string, string>
const photoFiles = import.meta.glob(
  [
    '/src/assets/images/**/*.{png,jpg,jpeg}',
    '!/src/assets/images/**/*background*.{png,jpg,jpeg}',
    '!/src/assets/images/**/*-bg*.{png,jpg,jpeg}',
  ],
  {
    eager: true,
    query: { format: 'webp', w: 1000, quality: 76 },
    import: 'default',
  },
) as Record<string, string>
const rawFiles = import.meta.glob("/src/assets/images/**/*.{webp,avif,svg,mp4,webm}", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>

const bySlot: Record<string, string> = {}
for (const files of [rawFiles, photoFiles, bgFiles]) {
  for (const [path, url] of Object.entries(files)) {
    const name = path.split("/").pop()!.replace(/.[^.]+$/, "")
    bySlot[name] = url
  }
}

export function hasMedia(slot: SlotName) {
  return slot in bySlot
}

/** Every image URL (no video), used to warm the cache after the page is open. */
export function allImageUrls(): string[] {
  return Object.values(bySlot).filter((u) => !/\.(mp4|webm)$/i.test(u))
}

/** URL of any file under src/assets/images/ (images or video) by its base file name. */
export function mediaUrl(name: string): string | undefined {
  return bySlot[name]
}

interface MediaProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> {
  slot: SlotName
  /** Load immediately (above the fold). Everything else is lazy-loaded. */
  eager?: boolean
}

export default function Media({ slot, alt = "", className = "", eager = false, style, ...rest }: MediaProps) {
  const src = bySlot[slot]
  const ref = useRef<HTMLImageElement>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (ref.current?.complete && ref.current.naturalWidth) setLoaded(true)
  }, [src])

  if (!src) return null
  return (
    <img
      ref={ref}
      src={src}
      alt={alt}
      draggable={false}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      data-slot={slot}
      onLoad={() => setLoaded(true)}
      className={`${className} ${loaded ? "media-in" : ""}`}
      style={loaded ? style : { ...style, opacity: 0 }}
      {...rest}
    />
  )
}
