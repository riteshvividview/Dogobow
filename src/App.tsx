import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { useLenis } from './hooks/useLenis'
import { getLenis } from './lib/lenis'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Collection from './pages/Collection'
import Product from './pages/Product'
import Preloader from './components/Preloader'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    // Lenis keeps its own virtual scroll position, so a plain window.scrollTo
    // gets overridden on the next animation frame unless we reset Lenis too.
    getLenis()?.scrollTo(0, { immediate: true })
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

function App() {
  useLenis()

  return (
    <div className="grain">
      <Preloader />
      <Navbar />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/collections/:slug" element={<Collection />} />
        <Route path="/collections/:slug/product/:id" element={<Product />} />
      </Routes>
    </div>
  )
}

export default App
