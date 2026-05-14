import { useGameStore } from '../../game/flow'

export function ActionBar() {
  const { gameOver, resetGame } = useGameStore()
  
  if (!gameOver) return null
  
  return (
    <div className="flex justify-center mb-4">
      <button
        onClick={resetGame}
        className="px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold bg-gradient-to-b from-blue-400 to-blue-600 text-white hover:from-blue-300 hover:to-blue-500 hover:scale-105 shadow-lg transition-all duration-200"
      >
        New Game
      </button>
    </div>
  )
}