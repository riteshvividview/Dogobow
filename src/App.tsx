import { useLenis } from './hooks/useLenis'
import Home from './pages/Home'

function App() {
  useLenis()

  return (
    <div className="grain">
      <Home />
    </div>
  )
}

export default App
