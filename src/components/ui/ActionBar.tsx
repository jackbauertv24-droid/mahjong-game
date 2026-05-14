import { useGameStore } from '../../game/flow'

export function ActionBar() {
  const { currentTurn, drawTile, wall, gameOver, resetGame } = useGameStore()
  const canDraw = currentTurn === 'east' && wall.length > 0
  
  return (
    <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-4">
      <button
        onClick={() => drawTile('east')}
        disabled={!canDraw}
        className={`
          px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold
          transition-all duration-200
          ${canDraw 
            ? 'bg-gradient-to-b from-yellow-400 to-yellow-600 text-gray-900 hover:from-yellow-300 hover:to-yellow-500 hover:scale-105 shadow-lg' 
            : 'bg-gray-600 text-gray-400 cursor-not-allowed opacity-50'}
        `}
      >
        Draw Tile
      </button>
      
      {gameOver && (
        <button
          onClick={resetGame}
          className="px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold bg-gradient-to-b from-blue-400 to-blue-600 text-white hover:from-blue-300 hover:to-blue-500 hover:scale-105 shadow-lg transition-all duration-200"
        >
          New Game
        </button>
      )}
    </div>
  )
}