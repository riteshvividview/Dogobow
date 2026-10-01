import { useEffect, useRef } from 'react'
import { CENTER_URL, FRAME_URLS, TOTAL, hasFrames } from '../lib/heroDogFrames'

export { hasFrames }

const NATIVE_W = 1920
const NATIVE_H = 823
const EASE = 0.16

// The face position was previously a fixed viewport fraction, but that's
// wrong: object-fit: cover with object-position-x: 0% (see Hero.tsx) always
// shows the source image starting from its left edge, scaled so its height
// matches the viewport — so the dog's on-screen X position depends on the
// viewport's aspect ratio, not just a flat fraction of its width. Confirmed
// by measuring the eye at two very different window sizes: a fixed fraction
// gave two different answers (0.75 and ~0.58), while the source-relative
// fraction below stayed consistent (~0.50) at both. object-position-y: 40%
// is irrelevant here since height is never cropped in this regime (the
// image's height always matches the container's exactly).
const SOURCE_FACE_X = 0.5 // fraction of the 1920px-wide source frame
const FACE_Y = 0.215 // fraction of viewport height (height is 1:1 with the source, no aspect-ratio correction needed)

// Angle anchors use atan2(dy, dx) in screen space (y grows downward), so
// 0deg = cursor to the right of the face, 90deg = below, 180deg = left,
// 270deg = above. Each maps to the frame (by index into the frame set, now
// densely sampled near the loop seam — see scripts/extract-dog-frames.mjs —
// so easing into center steps through closely-spaced real frames instead of
// jumping) where the source video's head position best matches that
// direction. The footage's natural temporal order sweeps CENTER -> UP ->
// UPPER-RIGHT -> RIGHT -> LOWER-RIGHT -> DOWN -> LOWER-LEFT -> LEFT ->
// UPPER-LEFT -> CENTER, so the anchors stay in that same monotonic order.
const RING_ANCHORS = [
  60, // 0deg    RIGHT
  71, // 45deg   LOWER-RIGHT
  80, // 90deg   DOWN
  87, // 135deg  LOWER-LEFT
  100, // 180deg  LEFT
  122, // 225deg  UPPER-LEFT
  23, // 270deg  UP
  44, // 315deg  UPPER-RIGHT
]

// Cursor distance from the face, normalized against this fraction of the
// smaller viewport dimension, decides ring-vs-center. Hysteresis (enter <
// exit) stops the two states flickering when the cursor hovers the boundary.
const DEAD_RADIUS_ENTER = 0.16
const DEAD_RADIUS_EXIT = 0.22

/** Shortest signed step from `a` to `b` around a loop of size `total` (e.g. 113 -> 14 out of 128 is +29, not -99). */
function shortestDelta(a: number, b: number, total: number) {
  return (((b - a) % total) + total + total / 2) % total - total / 2
}

function angleToRingIndex(angleDeg: number) {
  let a = angleDeg % 360
  if (a < 0) a += 360
  const sector = a / 45
  const i0 = Math.floor(sector) % RING_ANCHORS.length
  const i1 = (i0 + 1) % RING_ANCHORS.length
  const t = sector - Math.floor(sector)
  const a0 = RING_ANCHORS[i0]
  // The frame sequence is itself a loop (frame TOTAL-1 leads back into frame
  // 0 near the center pose), so anchors should interpolate via whichever
  // direction is actually shorter — otherwise a segment like UPPER-LEFT -> UP
  // scrubs backward through nearly the whole ring instead of the few frames
  // that pass through the loop seam.
  const a1 = a0 + shortestDelta(a0, RING_ANCHORS[i1], TOTAL)
  const raw = a0 + (a1 - a0) * t
  return ((raw % TOTAL) + TOTAL) % TOTAL
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

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = NATIVE_W * dpr
    canvas.height = NATIVE_H * dpr
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
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      lastDrawnKey = key
      canvas.dataset.frame = key
    }

    const drawRing = (rawIndex: number) => {
      let use = Math.round(rawIndex) % TOTAL
      if (use < 0) use += TOTAL
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

    // frame-000.webp is the same source frame center.webp was extracted from,
    // so the ring naturally passes through the identical pose at index 0 —
    // that's what lets the center pose ease in through real frames instead
    // of hard-cutting, then swap to the sharper dedicated asset once arrived.
    const CENTER_RING_INDEX = 0
    const CENTER_SNAP_EPSILON = 1.5

    let targetAngle = 0
    let showCenter = true
    // Starts at the center pose since showCenter is true until the cursor moves.
    let currentRingIndex = 0
    let rafId: number

    const tick = () => {
      const targetRingIndex = showCenter ? CENTER_RING_INDEX : angleToRingIndex(targetAngle)
      // Same shortest-path logic for the eased approach, so it never scrubs
      // backward across the loop seam either.
      currentRingIndex += shortestDelta(currentRingIndex, targetRingIndex, TOTAL) * EASE
      currentRingIndex = ((currentRingIndex % TOTAL) + TOTAL) % TOTAL

      const distToCenter = Math.min(
        Math.abs(currentRingIndex - CENTER_RING_INDEX),
        TOTAL - Math.abs(currentRingIndex - CENTER_RING_INDEX),
      )
      if (showCenter && centerLoaded && distToCenter < CENTER_SNAP_EPSILON) {
        draw('center', centerImage!)
      } else {
        drawRing(currentRingIndex)
      }
      rafId = requestAnimationFrame(tick)
    }

    const loadRingFrame = (i: number) =>
      loadImage(FRAME_URLS[i])
        .then((img) => {
          ringImages[i] = img
          ringLoaded[i] = true
        })
        .catch(() => {})

    void (async () => {
      // The Preloader fetches every one of these same URLs before the site
      // is ever shown (see src/lib/heroDogFrames.ts + Preloader.tsx), so in
      // the normal case this is all resolving from cache, not the network —
      // no need to trickle it in through requestIdleCallback batches anymore.
      // Center and the 8 compass anchors first, so the canvas is immediately
      // correct in every direction the instant it mounts; the remaining
      // in-between frames (for the fine easing motion) follow right after.
      await Promise.all([
        loadImage(CENTER_URL!)
          .then((img) => {
            centerImage = img
            centerLoaded = true
          })
          .catch(() => {}),
        ...RING_ANCHORS.map(loadRingFrame),
      ])
      if (cancelled) return
      rafId = requestAnimationFrame(tick)

      const anchorSet = new Set(RING_ANCHORS)
      await Promise.all(FRAME_URLS.map((_, i) => (anchorSet.has(i) ? null : loadRingFrame(i))))
    })()

    const isTouch = window.matchMedia('(pointer: coarse)').matches
    const onMouseMove = (e: MouseEvent) => {
      // See SOURCE_FACE_X comment above — this is the object-fit: cover /
      // object-position-x: 0% formula, not a flat viewport fraction.
      const faceX = SOURCE_FACE_X * (NATIVE_W / NATIVE_H) * window.innerHeight
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
