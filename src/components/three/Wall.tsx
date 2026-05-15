import { TileBack3D } from './Tile3D'

interface Wall3DProps {
  tilesRemaining: number
}

export function Wall3D({ tilesRemaining }: Wall3DProps) {
  const tilesPerRow = 8
  const rows = Math.ceil(tilesRemaining / tilesPerRow)
  const maxRows = 3
  
  const positions: [number, number, number][] = []
  
  for (let row = 0; row < Math.min(rows, maxRows); row++) {
    const tilesInRow = Math.min(tilesRemaining - row * tilesPerRow, tilesPerRow)
    for (let col = 0; col < tilesInRow; col++) {
      const x = (col - tilesPerRow / 2) * 0.8
      const z = (row - 1) * 0.5
      positions.push([x, 0.5, z])
    }
  }
  
  return (
    <group position={[0, 0, 2]}>
      {positions.map((pos, i) => (
        <TileBack3D key={i} position={pos} />
      ))}
    </group>
  )
}