import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { collectionsBySlug, type CollectionProduct } from '../data/collections'

export interface CartLine {
  key: string
  slug: string
  productId: string
  size: string
  color: string
  qty: number
}

export interface ResolvedCartLine extends CartLine {
  product: CollectionProduct
}

interface CartContextValue {
  lines: CartLine[]
  resolvedLines: ResolvedCartLine[]
  count: number
  subtotal: number
  addToCart: (slug: string, productId: string, size: string, color: string, qty?: number) => void
  updateQty: (key: string, qty: number) => void
  removeLine: (key: string) => void
  clearCart: () => void
  isDrawerOpen: boolean
  openDrawer: () => void
  closeDrawer: () => void
}

const STORAGE_KEY = 'dogobow-cart'
const lineKey = (slug: string, productId: string, size: string, color: string) =>
  `${slug}::${productId}::${size}::${color}`

const CartContext = createContext<CartContextValue | null>(null)

function loadLines(): CartLine[] {
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

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>(loadLines)
  const [isDrawerOpen, setDrawerOpen] = useState(false)

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines))
    } catch {
      // storage unavailable (private browsing, quota) — cart just won't persist
    }
  }, [lines])

  const addToCart = (slug: string, productId: string, size: string, color: string, qty = 1) => {
    const key = lineKey(slug, productId, size, color)
    setLines((prev) => {
      const existing = prev.find((l) => l.key === key)
      if (existing) {
        return prev.map((l) => (l.key === key ? { ...l, qty: Math.min(9, l.qty + qty) } : l))
      }
      return [...prev, { key, slug, productId, size, color, qty: Math.min(9, qty) }]
    })
  }

  const updateQty = (key: string, qty: number) => {
    setLines((prev) =>
      qty <= 0 ? prev.filter((l) => l.key !== key) : prev.map((l) => (l.key === key ? { ...l, qty: Math.min(9, qty) } : l)),
    )
  }

  const removeLine = (key: string) => setLines((prev) => prev.filter((l) => l.key !== key))
  const clearCart = () => setLines([])

  const resolvedLines = useMemo<ResolvedCartLine[]>(() => {
    return lines
      .map((line) => {
        const product = collectionsBySlug[line.slug]?.products.find((p) => p.id === line.productId)
        return product ? { ...line, product } : null
      })
      .filter((l): l is ResolvedCartLine => l !== null)
  }, [lines])

  const count = resolvedLines.reduce((sum, l) => sum + l.qty, 0)
  const subtotal = resolvedLines.reduce((sum, l) => sum + l.product.price * l.qty, 0)

  const value: CartContextValue = {
    lines,
    resolvedLines,
    count,
    subtotal,
    addToCart,
    updateQty,
    removeLine,
    clearCart,
    isDrawerOpen,
    openDrawer: () => setDrawerOpen(true),
    closeDrawer: () => setDrawerOpen(false),
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
