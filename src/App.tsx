import { useState } from 'react'
import { GameTable } from './components/table'
import { GameTable3D } from './components/three'
import { StartScreen } from './screens'

function App() {
  const [version, setVersion] = useState<'2d' | '3d' | null>(null)
  
  if (!version) {
    return <StartScreen onSelect={setVersion} />
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a472a] to-[#0a2a1a] flex flex-col items-center justify-start p-2 sm:p-4 overflow-x-hidden">
      {version === '2d' ? <GameTable /> : <GameTable3D />}
    </div>
  )
}

export default App