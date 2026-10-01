#!/usr/bin/env node
/**
 * Reproducible extraction pipeline for the hero dog's cursor-tracking frames.
 *
 * Source: src/assets/new-hero-bg-video-24fps.mp4 (never played/seeked at
 * runtime — this script is the only thing that ever decodes it).
 *
 * 1. Probes the video (ffprobe) so the frame count below always matches
 *    the actual source, even if it's swapped out later.
 * 2. Extracts FRAME_COUNT evenly-spaced frames with ffmpeg (one pass, in
 *    temporal order) plus a dedicated center frame.
 * 3. Upscales (lanczos3) + lightly sharpens + re-encodes each to WebP
 *    with sharp, writing the final set the app actually loads.
 *
 * Usage: node scripts/extract-dog-frames.mjs
 */
import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import sharp from 'sharp'

const SOURCE = 'src/assets/new-hero-bg-video-24fps.mp4'
const OUT_DIR = 'src/assets/hero-dog-frames'
const RAW_DIR = `${OUT_DIR}/.raw`
const FRAMES_DIR = `${OUT_DIR}/frames`
const FRAME_COUNT = 128
const DENSE_SEAM_RADIUS = 18 // every source frame within this many frames of the loop seam (0 / last), on both sides
const CENTER_SOURCE_FRAME = 0 // direct-gaze, mouth-closed, calm — confirmed by visual review
const TARGET_WIDTH = 1920
const WEBP_QUALITY = 87

function probe() {
  const out = execFileSync('ffprobe', [
    '-v', 'error',
    '-select_streams', 'v:0',
    '-show_entries', 'stream=nb_frames,width,height,r_frame_rate,duration',
    '-of', 'default=noprint_wrappers=1',
    SOURCE,
  ]).toString()
  const get = (key) => out.match(new RegExp(`${key}=(.+)`))?.[1]?.trim()
  return {
    nbFrames: Number(get('nb_frames')),
    width: Number(get('width')),
    height: Number(get('height')),
    fps: get('r_frame_rate'),
    duration: Number(get('duration')),
  }
}

function evenlySpacedIndices(total, count) {
  const idx = []
  for (let i = 0; i < count; i++) idx.push(Math.round((i * (total - 1)) / (count - 1)))
  return [...new Set(idx)]
}

/**
 * The center pose sits at the loop seam (source frame 0, which is also right
 * where the clip ends before looping). Evenly-spaced sampling leaves that
 * region as sparse as everywhere else, so easing into center still steps
 * between visually-distinct keyframes instead of a smooth blend. Densifies
 * just the seam (every source frame within DENSE_RADIUS of 0, both sides)
 * while keeping the rest at the original coarse spacing.
 */
function denseNearSeamIndices(total, coarseCount, denseRadius) {
  const coarse = evenlySpacedIndices(total, coarseCount)
  const dense = []
  for (let f = 0; f <= denseRadius; f++) dense.push(f)
  for (let f = total - 1 - denseRadius; f <= total - 1; f++) dense.push(f)
  return [...new Set([...coarse, ...dense])].sort((a, b) => a - b)
}

/** ffmpeg's select-expression parser chokes on very long OR chains, so pull every frame once and pick from disk instead — still one ffmpeg pass, still reproducible. */
function extractAllFrames(outDir) {
  mkdirSync(outDir, { recursive: true })
  execFileSync('ffmpeg', ['-y', '-v', 'error', '-i', SOURCE, '-q:v', '1', `${outDir}/all_%04d.png`])
}

async function toWebp(srcPath, destPath, quality = WEBP_QUALITY) {
  const buf = await sharp(srcPath)
    .resize(TARGET_WIDTH, null, { kernel: 'lanczos3' })
    .sharpen({ sigma: 0.5 })
    .webp({ quality })
    .toBuffer()
  writeFileSync(destPath, buf)
  return buf.length
}

async function main() {
  const info = probe()
  console.log('Source video:', info)

  if (existsSync(RAW_DIR)) rmSync(RAW_DIR, { recursive: true })
  if (existsSync(FRAMES_DIR)) rmSync(FRAMES_DIR, { recursive: true })
  mkdirSync(FRAMES_DIR, { recursive: true })

  console.log('Extracting every source frame (one ffmpeg pass)...')
  extractAllFrames(RAW_DIR)
  const allFiles = readdirSync(RAW_DIR)
    .filter((f) => f.startsWith('all_'))
    .sort()
  // ffmpeg's %04d output is 1-indexed and matches frame n = (file index - 1).
  const pathForFrame = (n) => `${RAW_DIR}/${allFiles[n]}`

  const indices = denseNearSeamIndices(info.nbFrames, FRAME_COUNT, DENSE_SEAM_RADIUS)
  console.log(`Selecting ${indices.length} frames (dense near the center/loop seam) + 1 center frame...`)
  let total = 0
  for (let i = 0; i < indices.length; i++) {
    const name = `frame-${String(i).padStart(3, '0')}.webp`
    total += await toWebp(pathForFrame(indices[i]), `${FRAMES_DIR}/${name}`)
  }
  total += await toWebp(pathForFrame(CENTER_SOURCE_FRAME), `${FRAMES_DIR}/center.webp`, 90)

  rmSync(RAW_DIR, { recursive: true })
  console.log(`Done. ${indices.length} ring frames + center.webp, ${(total / 1024 / 1024).toFixed(2)} MB total.`)
  console.log('Source-frame indices used for the ring (for recalibrating direction anchors):')
  console.log(indices.join(','))
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
