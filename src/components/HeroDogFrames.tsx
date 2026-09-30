import { useEffect, useRef } from 'react'

/**
 * 64 evenly-spaced frames extracted from the directional dog video
 * (src/assets/images/home-page/01-hero/dog-bg-video.mp4), plus a dedicated
 * center.webp for the direct-eye-contact "happy" pose. All pre-upscaled
 * (lanczos3, ~2560px source -> 1920px) and sharpened via a one-off sharp
 * script — see src/assets/hero-dog-frames-v2. Sorted alphabetically, which
 * matches temporal frame order since filenames are zero-padded.
 */
const frameModules = import.meta.glob('../assets/hero-dog-frames-v2/frames/frame-*.webp', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>
const FRAME_URLS = Object.keys(frameModules)
  .sort()
  .map((k) => frameModules[k])

const centerModule = import.meta.glob('../assets/hero-dog-frames-v2/frames/center.webp', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>
const CENTER_URL = Object.values(centerModule)[0] as string | undefined

const TOTAL = FRAME_URLS.length
export const hasFrames = TOTAL > 0 && !!CENTER_URL

const NATIVE_W = 1920
const NATIVE_H = 836
const EASE = 0.16

// The hero photo is object-position ~58% 44%, so the dog's face sits there
// rather than at the viewport's geometric center — measured the same way as
// the previous cursor-tracking hero (screenshot + guideline overlay).
const FACE_X = 0.44
const FACE_Y = 0.42

// Angle anchors use atan2(dy, dx) in screen space (y grows downward), so
// 0deg = cursor to the right of the face, 90deg = below, 180deg = left,
// 270deg = above. Each maps to the frame (by index into the 64-frame set)
// where the source video's head position best matches that direction —
// identified by reviewing the extracted frames; the footage's natural
// temporal order already sweeps UP -> UPPER-RIGHT -> RIGHT -> LOWER-RIGHT ->
// DOWN -> LOWER-LEFT -> LEFT -> UPPER-LEFT, so the 8 anchors below are evenly
// spaced at 45deg and stay in that same monotonic order.
const RING_ANCHORS = [
  21, // 0deg    RIGHT
  28, // 45deg   LOWER-RIGHT
  32, // 90deg   DOWN
  36, // 135deg  LOWER-LEFT
  43, // 180deg  LEFT
  50, // 225deg  UPPER-LEFT
  7, // 270deg  UP
  14, // 315deg  UPPER-RIGHT
]

// Cursor distance from the face, normalized against this fraction of the
// smaller viewport dimension, decides ring-vs-center. Hysteresis (enter <
// exit) stops the two states flickering when the cursor hovers the boundary.
const DEAD_RADIUS_ENTER = 0.16
const DEAD_RADIUS_EXIT = 0.22

function angleToRingIndex(angleDeg: number) {
  let a = angleDeg % 360
  if (a < 0) a += 360
  const sector = a / 45
  const i0 = Math.floor(sector) % RING_ANCHORS.length
  const i1 = (i0 + 1) % RING_ANCHORS.length
  const t = sector - Math.floor(sector)
  return RING_ANCHORS[i0] + (RING_ANCHORS[i1] - RING_ANCHORS[i0]) * t
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

    const ringImages: (HTMLImageElement | null)[] = new Array(TOTAL).fill(null)
    const ringLoaded = new Array(TOTAL).fill(false)
    let centerImage: HTMLImageElement | null = null
    let centerLoaded = false
    let cancelled = false

    const loadImage = (url: string) =>
      new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image()
        img.decoding = 'async'
        img.onload = () => resolve(img)
        img.onerror = reject
        img.src = url
      })

    let lastDrawnKey = ''
    const draw = (key: string, img: HTMLImageElement) => {
      if (key === lastDrawnKey) return
      ctx.clearRect(0, 0, NATIVE_W, NATIVE_H)
      ctx.drawImage(img, 0, 0, NATIVE_W, NATIVE_H)
      lastDrawnKey = key
    }

    const drawRing = (rawIndex: number) => {
      let use = Math.round(rawIndex)
      if (!ringLoaded[use]) {
        for (let offset = 1; offset < TOTAL; offset++) {
          if (ringLoaded[use - offset]) {
            use -= offset
            break
          }
          if (ringLoaded[use + offset]) {
            use += offset
            break
          }
        }
      }
      const img = ringImages[use]
      if (img) draw(`ring-${use}`, img)
    }

    const drawCenter = () => {
      if (centerImage) draw('center', centerImage)
    }

    let targetAngle = 0
    let showCenter = true
    let currentRingIndex = RING_ANCHORS[0]
    let rafId: number

    const tick = () => {
      const targetRingIndex = angleToRingIndex(targetAngle)
      currentRingIndex += (targetRingIndex - currentRingIndex) * EASE
      if (showCenter) {
        if (centerLoaded) drawCenter()
        else drawRing(currentRingIndex)
      } else {
        drawRing(currentRingIndex)
      }
      rafId = requestAnimationFrame(tick)
    }

    void (async () => {
      try {
        centerImage = await loadImage(CENTER_URL!)
        centerLoaded = true
        if (!cancelled) drawCenter()
      } catch {
        // fall through — ring frames still load below
      }
      if (cancelled) return
      rafId = requestAnimationFrame(tick)

      // Warm the ring frames in small background batches so panning never stalls.
      const order = [...RING_ANCHORS, ...FRAME_URLS.map((_, i) => i)]
      const seen = new Set<number>()
      const queue = order.filter((i) => (seen.has(i) ? false : (seen.add(i), true)))
      const step = () => {
        if (cancelled || queue.length === 0) return
        const batch = queue.splice(0, 4)
        Promise.all(
          batch.map((i) =>
            loadImage(FRAME_URLS[i])
              .then((img) => {
                ringImages[i] = img
                ringLoaded[i] = true
              })
              .catch(() => {}),
          ),
        ).then(() => {
          if (cancelled) return
          if ('requestIdleCallback' in window) window.requestIdleCallback(step)
          else setTimeout(step, 60)
        })
      }
      step()
    })()

    const isTouch = window.matchMedia('(pointer: coarse)').matches
    const onMouseMove = (e: MouseEvent) => {
      const faceX = window.innerWidth * FACE_X
      const faceY = window.innerHeight * FACE_Y
      const dx = e.clientX - faceX
      const dy = e.clientY - faceY
      const dist = Math.hypot(dx, dy)
      const scale = Math.min(window.innerWidth, window.innerHeight) * 0.5
      const radiusFraction = scale > 0 ? dist / scale : 1
      if (showCenter && radiusFraction > DEAD_RADIUS_EXIT) showCenter = false
      else if (!showCenter && radiusFraction < DEAD_RADIUS_ENTER) showCenter = true
      targetAngle = (Math.atan2(dy, dx) * 180) / Math.PI
    }
    const onMouseLeave = () => {
      showCenter = true
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
