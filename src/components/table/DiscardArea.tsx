import { DiscardTile } from '../tiles'
import { useGameStore } from '../../game/flow'

export function DiscardArea() {
  const { hands } = useGameStore()
  const discards = hands.east.discards.slice(-6)
  
  if (discards.length === 0) {
    return (
      <div className="text-sm text-white/40 italic">
        No tiles discarded
      </div>
    )
  }
  
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="text-xs text-white/50">Your Discards</div>
      <div className="flex flex-row justify-center gap-0.5">
        {discards.map((tile) => (
          <DiscardTile key={tile.id} tile={tile} size="mini" />
        ))}
      </div>
    </div>
  )
}