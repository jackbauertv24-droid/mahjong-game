import { TileBack } from '../../components/tiles'
import { useGameStore } from '../../game/flow'
import { PlayerPosition } from '../../game/tiles'

interface OpponentHandProps {
  position: PlayerPosition
}

export function OpponentHand({ position }: OpponentHandProps) {
  const { hands, currentTurn } = useGameStore()
  const playerHand = hands[position]
  const isActive = currentTurn === position
  
  const layoutClasses: Record<PlayerPosition, string> = {
    east: 'flex-row gap-0.5 sm:gap-1',
    south: 'flex-row gap-0.5 sm:gap-1',
    west: 'flex-col gap-0.5 sm:gap-1',
    north: 'flex-row gap-0.5 sm:gap-1',
  }
  
  const containerClasses: Record<PlayerPosition, string> = {
    east: '',
    south: 'absolute right-4 sm:right-8 top-1/4 flex flex-col items-end',
    west: 'absolute left-4 sm:left-8 top-1/3 flex flex-col items-start',
    north: 'absolute left-4 sm:left-8 top-1/4 flex flex-col items-start',
  }
  
  return (
    <div className={`${containerClasses[position]} ${layoutClasses[position]}`}>
      <div className={`flex ${layoutClasses[position]} mb-1`}>
        {playerHand.tiles.slice(0, 13).map((_, index) => (
          <TileBack key={index} size="small" className="opacity-80" />
        ))}
      </div>
      <div className="text-xs sm:text-sm text-white/80 mb-1">
        {position.toUpperCase()}
        {isActive && <span className="ml-1 text-yellow-400 animate-pulse">●</span>}
      </div>
      <DiscardAreaCompact position={position} />
    </div>
  )
}

function DiscardAreaCompact({ position }: { position: PlayerPosition }) {
  const { hands } = useGameStore()
  const discards = hands[position].discards
  
  if (discards.length === 0) return null
  
  return (
    <div className="flex flex-wrap gap-0.5 max-w-[120px]">
      {discards.slice(-12).map((tile) => (
        <div key={tile.id} className="w-6 h-8 sm:w-7 sm:h-9 flex items-center justify-center bg-[#f5f5dc]/80 rounded text-xs font-serif text-gray-700">
          {tile.character}
        </div>
      ))}
    </div>
  )
}