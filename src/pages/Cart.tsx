import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useSiteAnimations } from '../hooks/useSiteAnimations'
import { ScrollTrigger } from '../lib/gsap'
import { useCart } from '../context/CartContext'
import Media, { hasMedia } from '../components/Media'
import NewsletterFooter from '../sections/NewsletterFooter'
import { formatINR } from '../data/content'
import { ArrowLeft, ArrowRight, PawIcon, ShieldCheck, TrashIcon, TruckIcon } from '../components/Icons'

const FREE_SHIPPING_AT = 799
const SHIPPING_FEE = 99

export default function Cart() {
  const main = useRef<HTMLElement>(null)
  useSiteAnimations(main)
  const { resolvedLines, subtotal, updateQty, removeLine } = useCart()

  useEffect(() => {
    window.scrollTo(0, 0)
    const t = window.setTimeout(() => ScrollTrigger.refresh(), 60)
    return () => window.clearTimeout(t)
  }, [])

  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_AT ? 0 : SHIPPING_FEE
  const total = subtotal + shipping

  return (
    <main ref={main}>
      <section className="bg-ink pb-24 pt-32 text-cream sm:pt-36">
        <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-16">
          <nav data-reveal className="mb-6 flex items-center gap-2 text-xs text-cream/55">
            <Link to="/" className="transition-colors hover:text-gold">
              Home
            </Link>
            <span>/</span>
            <span className="text-cream">Your Bag</span>
          </nav>

          <h1 data-reveal className="mb-12 border-b border-cream/10 pb-8 font-display text-[clamp(2.2rem,4vw,3.2rem)] leading-tight">
            Your Bag
          </h1>

          {resolvedLines.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-4 rounded-[2rem] border border-cream/10 py-24 text-center">
              <PawIcon size={36} className="text-gold/50" />
              <h2 className="font-display text-2xl text-cream">Your bag is empty.</h2>
              <p className="max-w-sm text-cream/60">
                Nothing here yet — go find something they'll love wagging in.
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
            <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr] lg:items-start lg:gap-14">
              <ul data-reveal className="flex flex-col">
                {resolvedLines.map((line) => (
                  <li key={line.key} className="flex gap-5 border-b border-cream/10 py-6 first:pt-0">
                    <Link
                      to={`/collections/${line.slug}/product/${line.productId}`}
                      className="h-28 w-24 shrink-0 overflow-hidden rounded-2xl bg-forest/30"
                    >
                      {line.product.slot && hasMedia(line.product.slot) ? (
                        <Media slot={line.product.slot} className="h-full w-full object-cover" />
                      ) : (
                        <span className="flex h-full w-full items-center justify-center">
                          <PawIcon size={26} className="text-gold/30" />
                        </span>
                      )}
                    </Link>
                    <div className="flex min-w-0 flex-1 flex-col justify-between">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <Link
                            to={`/collections/${line.slug}/product/${line.productId}`}
                            className="block truncate font-display text-lg text-cream hover:text-gold-soft"
                          >
                            {line.product.name}
                          </Link>
                          <p className="mt-1 text-sm text-cream/50">
                            Size {line.size}
                            {line.color ? ` · ${line.color}` : ''}
                          </p>
                        </div>
                        <button
                          aria-label="Remove item"
                          onClick={() => removeLine(line.key)}
                          className="shrink-0 text-cream/40 transition-colors hover:text-red-400"
                        >
                          <TrashIcon size={16} />
                        </button>
                      </div>
                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center rounded-full border border-cream/20">
                          <button
                            aria-label="Decrease quantity"
                            onClick={() => updateQty(line.key, line.qty - 1)}
                            className="px-4 py-2 text-cream/70 transition-colors hover:text-gold"
                          >
                            –
                          </button>
                          <span className="w-6 text-center text-sm text-cream">{line.qty}</span>
                          <button
                            aria-label="Increase quantity"
                            onClick={() => updateQty(line.key, line.qty + 1)}
                            className="px-4 py-2 text-cream/70 transition-colors hover:text-gold"
                          >
                            +
                          </button>
                        </div>
                        <span className="font-display text-lg text-cream">{formatINR(line.product.price * line.qty)}</span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              <aside data-reveal data-reveal-delay={0.1} className="rounded-[2rem] border border-cream/10 bg-ink-soft/40 p-7 lg:sticky lg:top-28">
                <h2 className="font-display text-xl text-cream">Order Summary</h2>
                <div className="mt-6 flex flex-col gap-3 text-sm">
                  <div className="flex items-center justify-between text-cream/70">
                    <span>Subtotal</span>
                    <span className="text-cream">{formatINR(subtotal)}</span>
                  </div>
                  <div className="flex items-center justify-between text-cream/70">
                    <span>Shipping</span>
                    <span className="text-cream">{shipping === 0 ? 'Free' : formatINR(shipping)}</span>
                  </div>
                  {shipping > 0 ? (
                    <p className="flex items-center gap-2 text-xs text-gold-soft">
                      <TruckIcon size={13} />
                      Add {formatINR(FREE_SHIPPING_AT - subtotal)} more for free shipping.
                    </p>
                  ) : null}
                </div>
                <div className="mt-5 flex items-center justify-between border-t border-cream/10 pt-5">
                  <span className="font-display text-lg text-cream">Total</span>
                  <span className="font-display text-2xl text-cream">{formatINR(total)}</span>
                </div>
                <Link
                  to="/checkout"
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-gold px-6 py-3.5 text-sm font-medium text-ink transition-transform hover:scale-[1.02]"
                >
                  Proceed to Checkout
                  <ArrowRight size={15} />
                </Link>
                <p className="mt-4 flex items-center justify-center gap-2 text-xs text-cream/45">
                  <ShieldCheck size={13} />
                  Secure checkout · 5-day easy returns
                </p>
              </aside>
            </div>
          )}
        </div>
      </section>

      <NewsletterFooter />
    </main>
  )
}
