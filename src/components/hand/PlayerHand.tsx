import { Tile } from '../../components/tiles'
import { useGameStore } from '../../game/flow'
import { sortTiles } from '../../game/tiles'

export function PlayerHand() {
  const { hands, currentTurn, drawnTile, discardTile } = useGameStore()
  const playerHand = hands.east
  
  const canAct = currentTurn === 'east' && playerHand.tiles.length === 14 && drawnTile
  
  const handleDiscard = (tileId: string) => {
    if (canAct) {
      discardTile('east', tileId)
    }
  }
  
  const sortedTiles = sortTiles(playerHand.tiles)
  
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex flex-wrap justify-center gap-1 sm:gap-2 max-w-xl px-4">
        {sortedTiles.map((tile) => (
          <Tile
            key={tile.id}
            tile={tile}
            onClick={() => handleDiscard(tile.id)}
            isSelected={drawnTile?.id === tile.id}
            disabled={!canAct}
          />
        ))}
      </div>
      {!canAct && currentTurn === 'east' && (
        <p className="text-sm text-yellow-300 animate-pulse">Click "Draw" to pick a tile</p>
      )}
      {canAct && (
        <p className="text-sm text-white">Click a tile to discard it</p>
      )}
    </div>
  )
}