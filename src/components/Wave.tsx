interface WaveProps {
  /** Tailwind text-* colour class; the wave fills with currentColor. */
  className?: string
  flip?: boolean
}

/** Organic section edge. Sits at the top of a section and bleeds up over the one above. */
export default function Wave({ className = '', flip = false }: WaveProps) {
  return (
    <svg
      viewBox="0 0 1440 120"
      preserveAspectRatio="none"
      aria-hidden="true"
      className={`pointer-events-none absolute inset-x-0 top-0 z-10 h-[56px] w-full -translate-y-[calc(100%-1px)] md:h-[104px] ${
        flip ? '-scale-y-100' : ''
      } ${className}`}
      fill="currentColor"
    >
      <path d="M0 78C180 18 360 6 560 46s380 74 560 30c120-29 230-58 320-40v86H0Z" />
    </svg>
  )
}
