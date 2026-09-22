import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckIcon, HeartIcon } from '../components/Icons'

interface Toast {
  id: number
  message: string
  kind: 'cart' | 'wishlist' | 'info'
}

interface ToastContextValue {
  show: (message: string, kind?: Toast['kind']) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)
let nextId = 1

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const show = useCallback((message: string, kind: Toast['kind'] = 'info') => {
    const id = nextId++
    setToasts((prev) => [...prev, { id, message, kind }])
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 2600)
  }, [])

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 top-24 z-[200] flex flex-col items-center gap-2 px-4">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: -16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.96 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center gap-3 rounded-full border border-cream/10 bg-ink/95 px-5 py-3 text-sm text-cream shadow-[0_20px_50px_-15px_rgba(0,0,0,0.8)] backdrop-blur-xl"
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold text-ink">
                {t.kind === 'wishlist' ? <HeartIcon size={12} fill="currentColor" /> : <CheckIcon size={12} strokeWidth={3} />}
              </span>
              {t.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
