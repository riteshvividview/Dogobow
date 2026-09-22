import { AnimatePresence, motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import Media, { hasMedia } from './Media'
import { ArrowRight, BagIcon, CloseIcon, PawIcon, TrashIcon } from './Icons'
import { formatINR } from '../data/content'

const ease = [0.22, 1, 0.36, 1] as const

export default function CartDrawer() {
  const { resolvedLines, count, subtotal, updateQty, removeLine, isDrawerOpen, closeDrawer } = useCart()

  return (
    <AnimatePresence>
      {isDrawerOpen ? (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={closeDrawer}
            className="fixed inset-0 z-[90] bg-ink/70 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.45, ease }}
            className="fixed inset-y-0 right-0 z-[95] flex w-full max-w-md flex-col border-l border-cream/10 bg-ink text-cream shadow-[-40px_0_80px_-30px_rgba(0,0,0,0.8)]"
          >
            <div className="flex items-center justify-between border-b border-cream/10 px-6 py-5">
              <h2 className="font-display text-xl">
                Your Bag <span className="text-sm text-cream/50">({count})</span>
              </h2>
              <button
                aria-label="Close cart"
                onClick={closeDrawer}
                className="flex h-9 w-9 items-center justify-center rounded-full text-cream/70 transition-colors hover:bg-cream/10 hover:text-cream"
              >
                <CloseIcon size={18} />
              </button>
            </div>

            {resolvedLines.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
                <PawIcon size={36} className="text-gold/40" />
                <p className="text-cream/60">Your bag is empty.</p>
                <button
                  onClick={closeDrawer}
                  className="rounded-full bg-gold px-6 py-2.5 text-sm font-medium text-ink transition-transform hover:scale-105"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <>
                <ul className="flex-1 overflow-y-auto px-6 py-5">
                  {resolvedLines.map((line) => (
                    <li key={line.key} className="flex gap-4 border-b border-cream/10 py-5 first:pt-0">
                      <Link
                        to={`/collections/${line.slug}/product/${line.productId}`}
                        onClick={closeDrawer}
                        className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-forest/30"
                      >
                        {line.product.slot && hasMedia(line.product.slot) ? (
                          <Media slot={line.product.slot} className="h-full w-full object-cover" />
                        ) : (
                          <span className="flex h-full w-full items-center justify-center">
                            <PawIcon size={22} className="text-gold/30" />
                          </span>
                        )}
                      </Link>
                      <div className="min-w-0 flex-1">
                        <Link
                          to={`/collections/${line.slug}/product/${line.productId}`}
                          onClick={closeDrawer}
                          className="block truncate text-sm text-cream hover:text-gold-soft"
                        >
                          {line.product.name}
                        </Link>
                        <p className="mt-1 text-xs text-cream/50">
                          {line.size} {line.color ? `· ${line.color}` : ''}
                        </p>
                        <div className="mt-3 flex items-center justify-between">
                          <div className="flex items-center rounded-full border border-cream/20">
                            <button
                              aria-label="Decrease quantity"
                              onClick={() => updateQty(line.key, line.qty - 1)}
                              className="px-3 py-1.5 text-cream/70 transition-colors hover:text-gold"
                            >
                              –
                            </button>
                            <span className="w-5 text-center text-xs text-cream">{line.qty}</span>
                            <button
                              aria-label="Increase quantity"
                              onClick={() => updateQty(line.key, line.qty + 1)}
                              className="px-3 py-1.5 text-cream/70 transition-colors hover:text-gold"
                            >
                              +
                            </button>
                          </div>
                          <span className="text-sm font-medium text-cream">
                            {formatINR(line.product.price * line.qty)}
                          </span>
                        </div>
                      </div>
                      <button
                        aria-label="Remove item"
                        onClick={() => removeLine(line.key)}
                        className="h-fit text-cream/40 transition-colors hover:text-red-400"
                      >
                        <TrashIcon size={16} />
                      </button>
                    </li>
                  ))}
                </ul>

                <div className="border-t border-cream/10 px-6 py-6">
                  <div className="mb-4 flex items-center justify-between text-sm">
                    <span className="text-cream/60">Subtotal</span>
                    <span className="font-display text-lg text-cream">{formatINR(subtotal)}</span>
                  </div>
                  <Link
                    to="/checkout"
                    onClick={closeDrawer}
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-gold px-6 py-3.5 text-sm font-medium text-ink transition-transform hover:scale-[1.02]"
                  >
                    <BagIcon size={16} />
                    Checkout
                  </Link>
                  <Link
                    to="/cart"
                    onClick={closeDrawer}
                    className="mt-3 flex w-full items-center justify-center gap-2 rounded-full border border-cream/20 px-6 py-3 text-sm text-cream/85 transition-colors hover:border-gold/50 hover:text-gold"
                  >
                    View Full Bag
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </>
            )}
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  )
}
