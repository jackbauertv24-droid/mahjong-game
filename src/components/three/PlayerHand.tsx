import { useState } from 'react'
import { Tile3D } from './Tile3D'
import { Tile } from '../../game/tiles'
import { useGameStore } from '../../game/flow'

interface PlayerHand3DProps {
  tiles: Tile[]
}

export function PlayerHand3D({ tiles }: PlayerHand3DProps) {
  const { currentTurn, discardTile } = useGameStore()
  const [selectedTileId, setSelectedTileId] = useState<string | null>(null)
  
  const isPlayerTurn = currentTurn === 'east'
  const tileSpacing = 0.8
  const startX = -(tiles.length - 1) * tileSpacing / 2
  
  const handleTileClick = (tileId: string) => {
    if (!isPlayerTurn) return
    
    if (selectedTileId === tileId) {
      discardTile('east', tileId)
      setSelectedTileId(null)
    } else {
      setSelectedTileId(tileId)
    }
  }
  
  return (
    <group position={[0, 0, -3]}>
      {tiles.map((tile, i) => {
const x = startX + i * tileSpacing
      const isSelected = selectedTileId === tile.id
      
      return (
          <Tile3D
            key={tile.id}
            tile={tile}
            position={[x, 0.5, 0]}
            onClick={() => handleTileClick(tile.id)}
            isSelected={isSelected}
            isHoverable={isPlayerTurn}
          />
        )
      })}
    </group>
  )
}