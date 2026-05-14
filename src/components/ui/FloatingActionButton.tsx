import { useGameStore } from '../../game/flow'

export function FloatingActionButton() {
  const { currentTurn, drawTile, wall, gameOver } = useGameStore()
  const canDraw = currentTurn === 'east' && wall.length > 0 && !gameOver
  
  return (
    <button
      onClick={() => drawTile('east')}
      disabled={!canDraw}
      className={`
        fixed bottom-6 right-6 sm:bottom-8 sm:right-8
        w-14 h-14 sm:w-16 sm:h-16
        rounded-full
        flex flex-col items-center justify-center
        transition-all duration-300 ease-out
        z-50
        select-none
        ${canDraw 
          ? 'bg-gradient-to-b from-yellow-400 to-yellow-600 hover:from-yellow-300 hover:to-yellow-500 hover:scale-110 shadow-lg shadow-yellow-500/40 animate-pulse' 
          : 'bg-gray-600/80 opacity-50 cursor-not-allowed'}
      `}
    >
      <span className="text-2xl sm:text-3xl font-bold text-gray-900">抽</span>
    </button>
  )
}