import { TileBack, DiscardTile } from '../tiles'
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
    east: 'flex-row gap-1',
    south: 'flex-col gap-0.5',
    west: 'flex-row gap-0.5',
    north: 'flex-col gap-0.5',
  }
  
  const containerClasses: Record<PlayerPosition, string> = {
    east: '',
    south: 'absolute left-4 sm:left-8 top-1/3 flex',
    west: 'absolute top-4 sm:top-8 left-1/2 -translate-x-1/2 flex flex-col items-center',
    north: 'absolute right-4 sm:right-8 top-1/3 flex',
  }
  
  const discards = playerHand.discards.slice(-6)
  
  if (position === 'west') {
    return (
      <div className={containerClasses[position]}>
        <div className="flex flex-col items-center gap-1">
          <div className={`flex ${layoutClasses[position]}`}>
            {playerHand.tiles.slice(0, 13).map((_, idx) => (
              <TileBack key={idx} size="small" className="opacity-80" />
            ))}
          </div>
          <div className="relative text-xs sm:text-sm text-white/80">
            西 WEST
            <span className={`absolute -right-3 top-1/2 -translate-y-1/2 text-yellow-400 animate-pulse ${isActive ? 'opacity-100' : 'opacity-0'}`}>●</span>
          </div>
          <div className={`flex ${layoutClasses[position]} gap-0.5 mt-1`}>
            {discards.map(tile => (
              <DiscardTile key={tile.id} tile={tile} size="mini" />
            ))}
          </div>
        </div>
      </div>
    )
  }
  
  if (position === 'south') {
    return (
      <div className={`${containerClasses[position]} flex-row gap-3`}>
        <div className="flex flex-col items-start gap-1">
          <div className={`flex ${layoutClasses[position]}`}>
            {playerHand.tiles.slice(0, 13).map((_, idx) => (
              <TileBack key={idx} size="small" className="opacity-80" />
            ))}
          </div>
          <div className="relative text-xs sm:text-sm text-white/80">
            南 SOUTH
            <span className={`absolute -right-3 top-1/2 -translate-y-1/2 text-yellow-400 animate-pulse ${isActive ? 'opacity-100' : 'opacity-0'}`}>●</span>
          </div>
        </div>
        <div className={`flex ${layoutClasses[position]} gap-0.5`}>
          {discards.map(tile => (
            <DiscardTile key={tile.id} tile={tile} size="mini" />
          ))}
        </div>
      </div>
    )
  }
  
  if (position === 'north') {
    return (
      <div className={`${containerClasses[position]} gap-3`}>
        <div className={`flex ${layoutClasses[position]} gap-0.5`}>
          {discards.map(tile => (
            <DiscardTile key={tile.id} tile={tile} size="mini" />
          ))}
        </div>
        <div className="flex flex-col items-end gap-1">
          <div className={`flex ${layoutClasses[position]}`}>
            {playerHand.tiles.slice(0, 13).map((_, idx) => (
              <TileBack key={idx} size="small" className="opacity-80" />
            ))}
          </div>
          <div className="relative text-xs sm:text-sm text-white/80">
            北 NORTH
            <span className={`absolute -right-3 top-1/2 -translate-y-1/2 text-yellow-400 animate-pulse ${isActive ? 'opacity-100' : 'opacity-0'}`}>●</span>
          </div>
        </div>
      </div>
    )
  }
  
  return null
}