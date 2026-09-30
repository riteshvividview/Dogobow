import { useEffect, useRef } from 'react'

/**
 * 121 sequential frames of the hero dog turning its head. Pre-upscaled
 * (lanczos3, 992px -> 1920px wide) and sharpened via a one-off sharp script
 * so they hold up at full hero width instead of the source export's native
 * resolution — see the frames-hd folder. Sorted alphabetically, which
 * matches frame order since the filenames are zero-padded (…-001 … -121).
 */
const frameModules = import.meta.glob('../assets/hero-dog-frames/frames-hd/*.webp', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>

const FRAME_URLS = Object.keys(frameModules)
  .sort()
  .map((k) => frameModules[k])

const TOTAL = FRAME_URLS.length
// Frame ~65 is where the head is turned toward camera with the mouth open —
// the "happy/hungry" pose the cursor should rest on at the center of the screen.
const CENTER_INDEX = Math.min(64, TOTAL - 1)
const NATIVE_W = 1920
const NATIVE_H = 836
const EASE = 0.12

export const hasFrames = TOTAL > 0

/** Maps a horizontal cursor fraction (0 = left edge, 1 = right edge) to a frame index, with the center pinned to CENTER_INDEX. */
function indexForFraction(fraction: number) {
  const f = Math.min(1, Math.max(0, fraction))
  if (f <= 0.5) return (f / 0.5) * CENTER_INDEX
  return CENTER_INDEX + ((f - 0.5) / 0.5) * (TOTAL - 1 - CENTER_INDEX)
}

interface HeroDogFramesProps {
  className?: string
}

export default function HeroDogFrames({ className = '' }: HeroDogFramesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!hasFrames) return
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    canvas.width = NATIVE_W
    canvas.height = NATIVE_H
    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = 'high'

    const images: (HTMLImageElement | null)[] = new Array(TOTAL).fill(null)
    const loaded = new Array(TOTAL).fill(false)
    let lastDrawn = -1
    let cancelled = false

    const drawFrame = (rawIndex: number) => {
      const target = Math.round(rawIndex)
      let use = target
      if (!loaded[use]) {
        // Nothing decoded for this exact frame yet — hold the nearest frame
        // that has, so the head never blanks out while frames stream in.
        for (let offset = 1; offset < TOTAL; offset++) {
          if (loaded[use - offset]) {
            use = use - offset
            break
          }
          if (loaded[use + offset]) {
            use = use + offset
            break
          }
        }
      }
      if (!loaded[use] || use === lastDrawn) return
      const img = images[use]
      if (!img) return
      ctx.clearRect(0, 0, NATIVE_W, NATIVE_H)
      ctx.drawImage(img, 0, 0, NATIVE_W, NATIVE_H)
      lastDrawn = use
    }

    const loadFrame = (i: number) =>
      new Promise<void>((resolve) => {
        const img = new Image()
        img.decoding = 'async'
        img.onload = () => {
          images[i] = img
          loaded[i] = true
          resolve()
        }
        img.onerror = () => resolve()
        img.src = FRAME_URLS[i]
      })

    let targetIndex = CENTER_INDEX
    let currentIndex = CENTER_INDEX
    let rafId: number

    const tick = () => {
      currentIndex += (targetIndex - currentIndex) * EASE
      drawFrame(currentIndex)
      rafId = requestAnimationFrame(tick)
    }

    // Paint the center/happy pose the instant it's ready, then quietly warm
    // the rest of the sequence in the background so later moves never stall.
    void (async () => {
      await loadFrame(CENTER_INDEX)
      if (cancelled) return
      drawFrame(CENTER_INDEX)
      rafId = requestAnimationFrame(tick)

      const rest = FRAME_URLS.map((_, i) => i).filter((i) => i !== CENTER_INDEX)
      const step = () => {
        if (cancelled || rest.length === 0) return
        const batch = rest.splice(0, 4)
        Promise.all(batch.map(loadFrame)).then(() => {
          if (cancelled) return
          if ('requestIdleCallback' in window) window.requestIdleCallback(step)
          else setTimeout(step, 60)
        })
      }
      step()
    })()

    const isTouch = window.matchMedia('(pointer: coarse)').matches
    const onMouseMove = (e: MouseEvent) => {
      targetIndex = indexForFraction(e.clientX / window.innerWidth)
    }
    const onMouseLeave = () => {
      targetIndex = CENTER_INDEX
    }
    if (!isTouch) {
      window.addEventListener('mousemove', onMouseMove)
      window.addEventListener('mouseleave', onMouseLeave)
    }

    return () => {
      cancelled = true
      cancelAnimationFrame(rafId)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseleave', onMouseLeave)
    }
  }, [])

  if (!hasFrames) return null

  return <canvas ref={canvasRef} aria-hidden="true" className={className} />
}
