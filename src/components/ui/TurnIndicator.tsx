import { useGameStore } from '../../game/flow'

export function TurnIndicator() {
  const { currentTurn, wall, gameOver } = useGameStore()
  
  const positions = ['east', 'south', 'west', 'north'] as const
  const positionLabels = {
    east: '东 East (You)',
    south: '南 South',
    west: '西 West',
    north: '北 North',
  }
  
  return (
    <div className="flex flex-col items-center gap-2 mb-2">
      <h2 className="text-lg sm:text-xl font-bold text-white">
        Current Turn: <span className="text-yellow-400">{positionLabels[currentTurn]}</span>
      </h2>
      <div className="flex gap-2 sm:gap-3">
        {positions.map((pos) => (
          <div
            key={pos}
            className={`
              px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium
              transition-all duration-300
              ${currentTurn === pos 
                ? 'bg-yellow-400 text-gray-900 scale-110 shadow-lg' 
                : 'bg-white/20 text-white/60'}
            `}
          >
            {pos === 'east' ? '东' : pos === 'south' ? '南' : pos === 'west' ? '西' : '北'}
          </div>
        ))}
      </div>
      <div className="text-sm text-white/70">
        Wall remaining: {wall.length} tiles
      </div>
      {gameOver && (
        <div className="text-lg font-bold text-red-400 animate-pulse">
          Game Over - Wall Empty!
        </div>
      )}
    </div>
  )
}