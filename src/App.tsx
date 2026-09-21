import { useLenis } from './hooks/useLenis'
import Home from './pages/Home'
import Preloader from './components/Preloader'

function App() {
  useLenis()

  return (
    <div className="grain">
      <Preloader />
      <Home />
    </div>
  )
}

export default App
