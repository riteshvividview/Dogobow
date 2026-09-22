import { Route, Routes } from 'react-router-dom'
import { useLenis } from './hooks/useLenis'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Collection from './pages/Collection'
import Product from './pages/Product'
import Preloader from './components/Preloader'

function App() {
  useLenis()

  return (
    <div className="grain">
      <Preloader />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/collections/:slug" element={<Collection />} />
        <Route path="/collections/:slug/product/:id" element={<Product />} />
      </Routes>
    </div>
  )
}

export default App
