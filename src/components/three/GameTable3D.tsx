import { Canvas } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import { useGameStore } from '../../game/flow'
import { Header, TurnIndicator, ActionBar, FloatingActionButton } from '../ui'

function Tile3D({ position, color }: { position: [number, number, number]; color: string }) {
  return (
    <RoundedBox args={[0.7, 1.0, 0.4]} radius={0.05} smoothness={4} position={position} castShadow>
      <meshStandardMaterial color={color} />
    </RoundedBox>
  )
}

function TileBack3D({ position }: { position: [number, number, number] }) {
  return (
    <RoundedBox args={[0.7, 1.0, 0.4]} radius={0.05} smoothness={4} position={position} castShadow>
      <meshStandardMaterial color="#2d5a3d" />
    </RoundedBox>
  )
}

function TableSurface() {
  return (
    <mesh position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[12, 12]} />
      <meshStandardMaterial color="#1a472a" />
    </mesh>
  )
}

function Wall({ count }: { count: number }) {
  const tiles = []
  const perRow = 8
  for (let i = 0; i < Math.min(count, 24); i++) {
    const row = Math.floor(i / perRow)
    const col = i % perRow
    tiles.push(
      <TileBack3D key={i} position={[(col - perRow/2) * 0.8, 0.2 + row * 0.5, 3]} />
    )
  }
  return <>{tiles}</>
}

function PlayerHand({ tiles }: { tiles: Array<{ suit: string; id: string }> }) {
  const colors: Record<string, string> = {
    wan: '#d4a574',
    tiao: '#8b4513',
    tong: '#cd853f',
    feng: '#6b8e23',
    jian: '#2e8b57',
  }
  const spacing = 0.8
  const startX = -(tiles.length - 1) * spacing / 2
  
  return (
    <>
      {tiles.map((tile, i) => (
        <Tile3D 
          key={tile.id} 
          position={[startX + i * spacing, 0, -3]} 
          color={colors[tile.suit] || '#f5f5dc'} 
        />
      ))}
    </>
  )
}

function OpponentHand({ position, count }: { position: 'south' | 'west' | 'north'; count: number }) {
  const config = {
    south: { pos: [-4, 0, 0], rot: [0, Math.PI/2, 0] },
    west: { pos: [0, 0, 4], rot: [0, Math.PI, 0] },
    north: { pos: [4, 0, 0], rot: [0, -Math.PI/2, 0] },
  }
  const { pos, rot } = config[position]
  const tiles = []
  for (let i = 0; i < count; i++) {
    tiles.push(
      <group key={i} position={[pos[0] + (i - count/2) * 0.6 * (position === 'west' ? 1 : 0), pos[1], pos[2] + (i - count/2) * 0.6 * (position !== 'west' ? 1 : 0)]} rotation={rot as [number, number, number]}>
        <TileBack3D position={[0, 0, 0]} />
      </group>
    )
  }
  return <>{tiles}</>
}

export function GameTable3D() {
  const { wall, hands, initGame } = useGameStore()
  const showGame = wall.length > 0 || hands.east.tiles.length > 0
  
  return (
    <div className="relative w-full min-h-[80vh] sm:min-h-[85vh] flex flex-col items-center justify-center">
      <Header />
      
      {!showGame && (
        <button
          onClick={initGame}
          className="px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-bold text-lg sm:text-xl bg-gradient-to-b from-green-400 to-green-600 text-white hover:from-green-300 hover:to-green-500 hover:scale-105 shadow-xl transition-all duration-200"
        >
          Start Game
        </button>
      )}
      
      {showGame && (
        <>
          <TurnIndicator />
          <ActionBar />
          
          <div className="w-full h-[600px]">
            <Canvas camera={{ position: [8, 8, 8], fov: 50 }} shadows>
              <ambientLight intensity={0.5} />
              <directionalLight position={[10, 15, 10]} intensity={1} castShadow />
              
              <TableSurface />
              <Wall count={wall.length} />
              <PlayerHand tiles={hands.east.tiles} />
              <OpponentHand position="south" count={hands.south.tiles.length} />
              <OpponentHand position="west" count={hands.west.tiles.length} />
              <OpponentHand position="north" count={hands.north.tiles.length} />
            </Canvas>
          </div>
          
          <FloatingActionButton />
        </>
      )}
    </div>
  )
}