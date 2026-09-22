import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { collectionsBySlug, type CollectionProduct } from '../data/collections'

interface WishlistEntry {
  slug: string
  productId: string
}

export interface ResolvedWishlistEntry extends WishlistEntry {
  product: CollectionProduct
}

interface WishlistContextValue {
  entries: WishlistEntry[]
  resolvedEntries: ResolvedWishlistEntry[]
  count: number
  isWished: (slug: string, productId: string) => boolean
  toggle: (slug: string, productId: string) => void
  remove: (slug: string, productId: string) => void
}

const STORAGE_KEY = 'dogobow-wishlist'
const entryKey = (slug: string, productId: string) => `${slug}::${productId}`

const WishlistContext = createContext<WishlistContextValue | null>(null)

function loadEntries(): WishlistEntry[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<WishlistEntry[]>(loadEntries)

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
    } catch {
      // storage unavailable — wishlist just won't persist
    }
  }, [entries])

  const isWished = (slug: string, productId: string) =>
    entries.some((e) => e.slug === slug && e.productId === productId)

  const toggle = (slug: string, productId: string) => {
    setEntries((prev) =>
      prev.some((e) => e.slug === slug && e.productId === productId)
        ? prev.filter((e) => !(e.slug === slug && e.productId === productId))
        : [...prev, { slug, productId }],
    )
  }

  const remove = (slug: string, productId: string) => {
    setEntries((prev) => prev.filter((e) => !(e.slug === slug && e.productId === productId)))
  }

  const resolvedEntries = useMemo<ResolvedWishlistEntry[]>(() => {
    return entries
      .map((e) => {
        const product = collectionsBySlug[e.slug]?.products.find((p) => p.id === e.productId)
        return product ? { ...e, product } : null
      })
      .filter((e): e is ResolvedWishlistEntry => e !== null)
  }, [entries])

  const value: WishlistContextValue = {
    entries,
    resolvedEntries,
    count: resolvedEntries.length,
    isWished,
    toggle,
    remove,
  }

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
}

export function useWishlist() {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider')
  return ctx
}

export { entryKey }
