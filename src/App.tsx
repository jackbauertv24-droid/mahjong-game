import { GameTable } from './components/table'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a472a] to-[#0a2a1a] flex flex-col items-center justify-start p-2 sm:p-4 overflow-x-hidden">
      <GameTable />
    </div>
  )
}

export default App