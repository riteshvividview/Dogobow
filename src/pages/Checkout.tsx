import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useSiteAnimations } from '../hooks/useSiteAnimations'
import { ScrollTrigger } from '../lib/gsap'
import { useCart } from '../context/CartContext'
import NewsletterFooter from '../sections/NewsletterFooter'
import { formatINR } from '../data/content'
import { ArrowLeft, CheckIcon, LockIcon, PawIcon, ShieldCheck } from '../components/Icons'

const FREE_SHIPPING_AT = 799
const SHIPPING_FEE = 99

const PAYMENT_METHODS = [
  { id: 'card', label: 'Credit / Debit Card' },
  { id: 'upi', label: 'UPI' },
  { id: 'cod', label: 'Cash on Delivery' },
] as const

interface FormState {
  name: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  pincode: string
}

const EMPTY_FORM: FormState = { name: '', email: '', phone: '', address: '', city: '', state: '', pincode: '' }

function generateOrderNumber() {
  return `DGB-${Math.floor(100000 + Math.random() * 900000)}`
}

export default function Checkout() {
  const main = useRef<HTMLElement>(null)
  useSiteAnimations(main)
  const { resolvedLines, subtotal, clearCart } = useCart()

  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [payment, setPayment] = useState<(typeof PAYMENT_METHODS)[number]['id']>('card')
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, boolean>>>({})
  const [order, setOrder] = useState<{ number: string; total: number } | null>(null)

  useEffect(() => {
    window.scrollTo(0, 0)
    const t = window.setTimeout(() => ScrollTrigger.refresh(), 60)
    return () => window.clearTimeout(t)
  }, [])

  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_AT ? 0 : SHIPPING_FEE
  const total = subtotal + shipping

  const set = (key: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }))

  const requiredFields = useMemo(() => Object.keys(EMPTY_FORM) as (keyof FormState)[], [])

  const placeOrder = (e: React.FormEvent) => {
    e.preventDefault()
    const nextErrors: Partial<Record<keyof FormState, boolean>> = {}
    requiredFields.forEach((key) => {
      if (!form[key].trim()) nextErrors[key] = true
    })
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setOrder({ number: generateOrderNumber(), total })
    clearCart()
  }

  if (order) {
    return (
      <main ref={main}>
        <section className="flex min-h-screen flex-col items-center justify-center bg-ink px-6 py-32 text-center text-cream">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="flex h-20 w-20 items-center justify-center rounded-full bg-gold text-ink"
          >
            <CheckIcon size={34} strokeWidth={2.5} />
          </motion.div>
          <h1 className="mt-8 font-display text-[clamp(2.2rem,4vw,3rem)] leading-tight">Order Confirmed</h1>
          <p className="mt-4 max-w-md text-cream/65">
            Thank you — order <span className="text-gold-soft">{order.number}</span> for {formatINR(order.total)} has
            been placed. A confirmation would normally land in your inbox here.
          </p>
          <p className="mt-3 max-w-md text-xs text-cream/40">
            This is a demo store — no payment was actually processed and no email was sent.
          </p>
          <Link
            to="/"
            className="mt-9 inline-flex items-center gap-3 rounded-full bg-gold px-7 py-3.5 text-sm font-medium text-ink transition-transform hover:scale-105"
          >
            <ArrowLeft size={16} />
            Back to Shop
          </Link>
        </section>
      </main>
    )
  }

  if (resolvedLines.length === 0) {
    return (
      <main ref={main}>
        <section className="flex min-h-screen flex-col items-center justify-center gap-4 bg-ink px-6 text-center text-cream">
          <PawIcon size={36} className="text-gold/50" />
          <h1 className="font-display text-2xl">Your bag is empty.</h1>
          <p className="max-w-sm text-cream/60">Add something to your bag before checking out.</p>
          <Link
            to="/"
            className="mt-2 inline-flex items-center gap-3 rounded-full bg-gold px-6 py-3 text-sm font-medium text-ink transition-transform hover:scale-105"
          >
            <ArrowLeft size={16} />
            Continue Shopping
          </Link>
        </section>
      </main>
    )
  }

  return (
    <main ref={main}>
      <section className="bg-ink pb-24 pt-32 text-cream sm:pt-36">
        <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-16">
          <nav data-reveal className="mb-6 flex items-center gap-2 text-xs text-cream/55">
            <Link to="/cart" className="transition-colors hover:text-gold">
              Your Bag
            </Link>
            <span>/</span>
            <span className="text-cream">Checkout</span>
          </nav>

          <h1 data-reveal className="mb-3 font-display text-[clamp(2.2rem,4vw,3.2rem)] leading-tight">
            Checkout
          </h1>
          <p data-reveal className="mb-10 max-w-lg text-sm text-cream/50">
            This is a demo checkout for review purposes — no real payment is processed.
          </p>

          <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr] lg:items-start lg:gap-14">
            <form data-reveal onSubmit={placeOrder} noValidate className="flex flex-col gap-8">
              <div>
                <h2 className="mb-5 font-display text-lg text-cream">Shipping Details</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Full Name" value={form.name} onChange={set('name')} error={errors.name} full />
                  <Field label="Email" type="email" value={form.email} onChange={set('email')} error={errors.email} />
                  <Field label="Phone" type="tel" value={form.phone} onChange={set('phone')} error={errors.phone} />
                  <Field label="Address" value={form.address} onChange={set('address')} error={errors.address} full />
                  <Field label="City" value={form.city} onChange={set('city')} error={errors.city} />
                  <Field label="State" value={form.state} onChange={set('state')} error={errors.state} />
                  <Field label="Pincode" value={form.pincode} onChange={set('pincode')} error={errors.pincode} />
                </div>
              </div>

              <div>
                <h2 className="mb-5 font-display text-lg text-cream">Payment Method</h2>
                <div className="flex flex-col gap-3">
                  {PAYMENT_METHODS.map((m) => (
                    <label
                      key={m.id}
                      className={`flex cursor-pointer items-center gap-3 rounded-2xl border px-5 py-4 text-sm transition-colors ${
                        payment === m.id ? 'border-gold bg-gold/5 text-cream' : 'border-cream/15 text-cream/75 hover:border-cream/30'
                      }`}
                    >
                      <span
                        className={`flex h-4 w-4 items-center justify-center rounded-full border transition-colors ${
                          payment === m.id ? 'border-gold' : 'border-cream/30'
                        }`}
                      >
                        {payment === m.id ? <span className="h-2 w-2 rounded-full bg-gold" /> : null}
                      </span>
                      <input
                        type="radio"
                        className="hidden"
                        checked={payment === m.id}
                        onChange={() => setPayment(m.id)}
                      />
                      {m.label}
                    </label>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="flex items-center justify-center gap-2 rounded-full bg-gold px-7 py-4 text-sm font-medium text-ink transition-transform hover:scale-[1.01]"
              >
                <LockIcon size={15} />
                Place Order · {formatINR(total)}
              </button>
            </form>

            <aside data-reveal data-reveal-delay={0.1} className="rounded-[2rem] border border-cream/10 bg-ink-soft/40 p-7 lg:sticky lg:top-28">
              <h2 className="font-display text-xl text-cream">Order Summary</h2>
              <ul className="mt-6 flex flex-col gap-4">
                {resolvedLines.map((line) => (
                  <li key={line.key} className="flex items-center justify-between gap-3 text-sm">
                    <span className="min-w-0 truncate text-cream/75">
                      {line.product.name} <span className="text-cream/40">× {line.qty}</span>
                    </span>
                    <span className="shrink-0 text-cream">{formatINR(line.product.price * line.qty)}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex flex-col gap-3 border-t border-cream/10 pt-5 text-sm">
                <div className="flex items-center justify-between text-cream/70">
                  <span>Subtotal</span>
                  <span className="text-cream">{formatINR(subtotal)}</span>
                </div>
                <div className="flex items-center justify-between text-cream/70">
                  <span>Shipping</span>
                  <span className="text-cream">{shipping === 0 ? 'Free' : formatINR(shipping)}</span>
                </div>
              </div>
              <div className="mt-5 flex items-center justify-between border-t border-cream/10 pt-5">
                <span className="font-display text-lg text-cream">Total</span>
                <span className="font-display text-2xl text-cream">{formatINR(total)}</span>
              </div>
              <p className="mt-4 flex items-center justify-center gap-2 text-xs text-cream/45">
                <ShieldCheck size={13} />
                Secure checkout · 5-day easy returns
              </p>
            </aside>
          </div>
        </div>
      </section>

      <NewsletterFooter />
    </main>
  )
}

function Field({
  label,
  value,
  onChange,
  type = 'text',
  error,
  full,
}: {
  label: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  type?: string
  error?: boolean
  full?: boolean
}) {
  return (
    <label className={`flex flex-col gap-2 ${full ? 'sm:col-span-2' : ''}`}>
      <span className="text-xs uppercase tracking-[0.14em] text-cream/50">{label}</span>
      <input
        type={type}
        value={value}
        onChange={onChange}
        className={`rounded-xl border bg-transparent px-4 py-3 text-sm text-cream placeholder:text-cream/30 focus:outline-none ${
          error ? 'border-red-400/70' : 'border-cream/15 focus:border-gold/60'
        }`}
      />
      {error ? <span className="text-xs text-red-400">This field is required.</span> : null}
    </label>
  )
}
