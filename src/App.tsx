import { useLenis } from './hooks/useLenis'

function App() {
  useLenis()

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-neutral-950 text-neutral-100">
      <h1 className="text-4xl font-semibold tracking-tight">Dogabow</h1>
      <p className="mt-2 text-neutral-400">Pet accessories, done right.</p>
    </main>
  )
}

export default App
