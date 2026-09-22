import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useSiteAnimations } from '../hooks/useSiteAnimations'
import { ScrollTrigger } from '../lib/gsap'
import { useWishlist } from '../context/WishlistContext'
import { useCart } from '../context/CartContext'
import { useToast } from '../context/ToastContext'
import NewsletterFooter from '../sections/NewsletterFooter'
import { ProductCard } from './Collection'
import { ArrowLeft, PawIcon } from '../components/Icons'

export default function Wishlist() {
  const main = useRef<HTMLElement>(null)
  useSiteAnimations(main)
  const { resolvedEntries, toggle, remove } = useWishlist()
  const { addToCart } = useCart()
  const { show } = useToast()

  useEffect(() => {
    window.scrollTo(0, 0)
    const t = window.setTimeout(() => ScrollTrigger.refresh(), 60)
    return () => window.clearTimeout(t)
  }, [])

  return (
    <main ref={main}>
      <section className="bg-ink pb-24 pt-32 text-cream sm:pt-36">
        <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-16">
          <nav data-reveal className="mb-6 flex items-center gap-2 text-xs text-cream/55">
            <Link to="/" className="transition-colors hover:text-gold">
              Home
            </Link>
            <span>/</span>
            <span className="text-cream">Wishlist</span>
          </nav>

          <div data-reveal className="mb-12 flex flex-wrap items-end justify-between gap-4 border-b border-cream/10 pb-8">
            <div>
              <p className="text-[11px] uppercase tracking-[0.32em] text-gold">Saved For Later</p>
              <h1 className="mt-3 font-display text-[clamp(2.2rem,4vw,3.2rem)] leading-tight">Your Wishlist</h1>
            </div>
            <p className="text-sm text-cream/55">
              <span className="font-display text-lg text-cream">{resolvedEntries.length}</span> saved
            </p>
          </div>

          {resolvedEntries.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-4 rounded-[2rem] border border-cream/10 py-24 text-center">
              <PawIcon size={36} className="text-gold/50" />
              <h2 className="font-display text-2xl text-cream">Nothing saved yet.</h2>
              <p className="max-w-sm text-cream/60">
                Tap the heart on anything you love and it'll show up here, ready whenever you are.
              </p>
              <Link
                to="/"
                className="mt-2 inline-flex items-center gap-3 rounded-full bg-gold px-6 py-3 text-sm font-medium text-ink transition-transform hover:scale-105"
              >
                <ArrowLeft size={16} />
                Continue Shopping
              </Link>
            </div>
          ) : (
            <ul data-stagger className="grid grid-cols-2 gap-x-5 gap-y-12 sm:gap-x-6 lg:grid-cols-4">
              {resolvedEntries.map((entry, i) => (
                <li key={`${entry.slug}:${entry.productId}`} className="flex flex-col gap-3">
                  <ProductCard
                    p={entry.product}
                    slug={entry.slug}
                    index={i}
                    wished
                    toggleWish={() => toggle(entry.slug, entry.productId)}
                  />
                  <button
                    onClick={() => {
                      addToCart(entry.slug, entry.productId, entry.product.sizes[0] ?? 'One Size', entry.product.colors[0] ?? '')
                      remove(entry.slug, entry.productId)
                      show(`${entry.product.name} moved to your bag`, 'cart')
                    }}
                    className="rounded-full border border-cream/20 py-2.5 text-sm text-cream/85 transition-colors hover:border-gold hover:text-gold"
                  >
                    Move to Cart
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <NewsletterFooter />
    </main>
  )
}
