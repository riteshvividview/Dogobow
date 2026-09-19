import { useEffect, useState } from 'react'
import logo from '../assets/dogobow-logo.webp'

let cached: string | null = null

/** Recolours only the dark lettering below the dog to cream so the transparent logo reads on dark backgrounds. */
function lightVersion(): Promise<string> {
  if (cached) return Promise.resolve(cached)
  return new Promise((resolve) => {
    const img = new Image()
    img.src = logo
    img.onload = () => {
      const c = document.createElement('canvas')
      c.width = img.naturalWidth
      c.height = img.naturalHeight
      const ctx = c.getContext('2d')
      if (!ctx) return resolve(logo)
      ctx.drawImage(img, 0, 0)
      const data = ctx.getImageData(0, 0, c.width, c.height)
      const px = data.data
      const fromY = Math.floor(c.height * 0.6)
      for (let y = fromY; y < c.height; y++) {
        for (let x = 0; x < c.width; x++) {
          const o = (y * c.width + x) * 4
          const dark = px[o] < 110 && px[o + 1] < 110 && px[o + 2] < 110
          if (dark && px[o + 3] > 0) {
            px[o] = 247
            px[o + 1] = 243
            px[o + 2] = 234
          }
        }
      }
      ctx.putImageData(data, 0, 0)
      cached = c.toDataURL('image/png')
      resolve(cached)
    }
    img.onerror = () => resolve(logo)
  })
}

/** Transparent Dogobow logo, cropped to its artwork (441x336 inside the 500px canvas). */
export default function Logo({ className = 'h-12' }: { className?: string }) {
  const [src, setSrc] = useState(logo)
  useEffect(() => {
    let alive = true
    lightVersion().then((u) => alive && setSrc(u))
    return () => {
      alive = false
    }
  }, [])

  return (
    <span className={`inline-block ${className}`} style={{ aspectRatio: '441 / 336' }}>
      <span className="relative block h-full w-full overflow-hidden">
        <img
          src={src}
          alt="Dogobow — pet clothing & accessories"
          draggable={false}
          className="absolute max-w-none"
          style={{ width: '113.4%', height: '148.8%', left: '-6.12%', top: '-25%' }}
        />
      </span>
    </span>
  )
}
