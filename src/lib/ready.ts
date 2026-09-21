type Cb = () => void

let ready = false
const waiting: Cb[] = []

/** Runs cb once the loader has finished (immediately if it already has). */
export function onReady(cb: Cb) {
  if (ready) cb()
  else waiting.push(cb)
}

export function markReady() {
  if (ready) return
  ready = true
  waiting.splice(0).forEach((cb) => cb())
}
