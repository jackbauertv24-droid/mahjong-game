import { Tile3D } from './Tile3D'
import { Tile } from '../../game/tiles'

interface DiscardArea3DProps {
  discards: Tile[]
}

export function DiscardArea3D({ discards }: DiscardArea3DProps) {
  const tilesPerRow = 6
  
  return (
    <group position={[0, 0, 0]}>
      {discards.map((tile, i) => {
        const row = Math.floor(i / tilesPerRow)
        const col = i % tilesPerRow
        const x = (col - tilesPerRow / 2) * 0.8
        const z = row * 0.5 - 0.5
        
        return (
          <Tile3D
            key={tile.id}
            tile={tile}
            position={[x, 0.2, z]}
            isHoverable={false}
          />
        )
      })}
    </group>
  )
}