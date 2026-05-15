import { TileBack3D } from './Tile3D'
import { Tile, PlayerPosition } from '../../game/tiles'

interface OpponentHand3DProps {
  position: PlayerPosition
  tiles: Tile[]
}

export function OpponentHand3D({ position, tiles }: OpponentHand3DProps) {
  const tileSpacing = 0.6
  
  const getGroupPosition = (): [number, number, number] => {
    switch (position) {
      case 'south': return [-3.5, 0, 0]
      case 'west': return [0, 0, 3.5]
      case 'north': return [3.5, 0, 0]
      default: return [0, 0, 0]
    }
  }
  
  const getGroupRotation = (): [number, number, number] => {
    switch (position) {
      case 'south': return [0, Math.PI / 2, 0]
      case 'west': return [0, Math.PI, 0]
      case 'north': return [0, -Math.PI / 2, 0]
      default: return [0, 0, 0]
    }
  }
  
  const positions: [number, number, number][] = tiles.map((_, i) => {
    const offset = (i - (tiles.length - 1) / 2) * tileSpacing
    return [offset, 0.5, 0]
  })
  
  return (
    <group position={getGroupPosition()} rotation={getGroupRotation()}>
      {positions.map((pos, i) => (
        <TileBack3D key={i} position={pos} />
      ))}
    </group>
  )
}