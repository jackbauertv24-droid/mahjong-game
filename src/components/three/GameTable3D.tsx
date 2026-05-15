import { Suspense, useMemo } from 'react'
import { Canvas, useLoader } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import * as THREE from 'three'
import { useGameStore } from '../../game/flow'
import { Header, TurnIndicator, ActionBar, FloatingActionButton } from '../ui'

const TILE_WIDTH = 0.65
const TILE_HEIGHT = 0.9
const TILE_DEPTH = 0.35

interface Tile3DProps {
  tile: {
    id: string
    suit: string
    value: number | string
    imagePath: string
  }
  position: [number, number, number]
  rotation?: [number, number, number]
  onClick?: () => void
}

function TileFace({ imagePath }: { imagePath: string }) {
  const texture = useLoader(THREE.TextureLoader, imagePath)
  texture.colorSpace = THREE.SRGBColorSpace
  
  return (
    <mesh position={[0, 0, TILE_DEPTH / 2 + 0.01]}>
      <planeGeometry args={[TILE_WIDTH * 0.9, TILE_HEIGHT * 0.9]} />
      <meshBasicMaterial map={texture} transparent={false} />
    </mesh>
  )
}

function Tile3D({ tile, position, rotation = [0, 0, 0], onClick }: Tile3DProps) {
  return (
    <group position={position} rotation={rotation} onClick={onClick}>
      <RoundedBox 
        args={[TILE_WIDTH, TILE_HEIGHT, TILE_DEPTH]} 
        radius={0.06} 
        smoothness={4}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color="#f5f0e6" />
      </RoundedBox>
      
      <Suspense fallback={
        <mesh position={[0, 0, TILE_DEPTH / 2 + 0.01]}>
          <planeGeometry args={[TILE_WIDTH * 0.75, TILE_HEIGHT * 0.75]} />
          <meshBasicMaterial color="#f5f0e6" />
        </mesh>
      }>
        <TileFace imagePath={tile.imagePath} />
      </Suspense>
      
      <mesh position={[0, 0, -TILE_DEPTH / 2 - 0.01]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[TILE_WIDTH * 0.5, TILE_HEIGHT * 0.5]} />
        <meshBasicMaterial color="#2d5a3d" />
      </mesh>
    </group>
  )
}

function TileBack3D({ position, rotation = [0, 0, 0] }: { position: [number, number, number]; rotation?: [number, number, number] }) {
  return (
    <group position={position} rotation={rotation}>
      <RoundedBox 
        args={[TILE_WIDTH, TILE_HEIGHT, TILE_DEPTH]} 
        radius={0.06} 
        smoothness={4}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color="#2d5a3d" />
      </RoundedBox>
      
      <mesh position={[0, 0, TILE_DEPTH / 2 + 0.01]}>
        <circleGeometry args={[0.12, 32]} />
        <meshBasicMaterial color="#3a6a4d" />
      </mesh>
    </group>
  )
}

function TableSurface() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
      <planeGeometry args={[18, 18]} />
      <meshStandardMaterial color="#1a472a" />
    </mesh>
  )
}

function Wall({ count }: { count: number }) {
  const tiles = useMemo(() => {
    const result = []
    const perRow = 10
    const maxVisible = Math.min(count, 20)
    
    for (let i = 0; i < maxVisible; i++) {
      const row = Math.floor(i / perRow)
      const col = i % perRow
      const x = (col - perRow / 2 + 0.5) * (TILE_WIDTH + 0.08)
      const y = row * (TILE_DEPTH + 0.05) + TILE_HEIGHT / 2
      const z = 5
      result.push([x, y, z] as [number, number, number])
    }
    return result
  }, [count])
  
  return (
    <group>
      {tiles.map((pos, i) => (
        <TileBack3D key={i} position={pos} />
      ))}
    </group>
  )
}

function PlayerHand({ tiles, onDiscard }: { tiles: Array<{ id: string; suit: string; value: number | string; imagePath: string }>; onDiscard?: (id: string) => void }) {
  const spacing = TILE_WIDTH + 0.12
  const startX = -(tiles.length - 1) * spacing / 2
  
  return (
    <group position={[0, 0, -6.5]}>
      {tiles.map((tile, i) => (
        <Tile3D
          key={tile.id}
          tile={tile}
          position={[startX + i * spacing, TILE_HEIGHT / 2 + 0.05, 0]}
          onClick={() => onDiscard?.(tile.id)}
        />
      ))}
    </group>
  )
}

function OpponentHand({ position, count }: { position: 'south' | 'west' | 'north'; count: number }) {
  const configs: Record<string, { groupPos: [number, number, number]; groupRot: [number, number, number] }> = {
    south: { groupPos: [-8, 0, 0], groupRot: [0, Math.PI / 2, 0] },
    west: { groupPos: [0, 0, 8], groupRot: [0, Math.PI, 0] },
    north: { groupPos: [8, 0, 0], groupRot: [0, -Math.PI / 2, 0] },
  }
  
  const config = configs[position]
  const spacing = TILE_WIDTH + 0.1
  const positions: [number, number, number][] = []
  
  for (let i = 0; i < Math.min(count, 13); i++) {
    const offset = (i - (Math.min(count, 13) - 1) / 2) * spacing
    positions.push([offset, TILE_HEIGHT / 2 + 0.05, 0])
  }
  
  return (
    <group position={config.groupPos} rotation={config.groupRot}>
      {positions.map((pos, i) => (
        <TileBack3D key={i} position={pos} />
      ))}
    </group>
  )
}

function DiscardArea({ discards }: { discards: Array<{ id: string; suit: string; value: number | string; imagePath: string }> }) {
  const spacing = TILE_WIDTH + 0.08
  const perRow = 8
  
  return (
    <group position={[0, 0, -1]}>
      {discards.slice(-12).map((tile, i) => {
        const row = Math.floor(i / perRow)
        const col = i % perRow
        const visibleCount = Math.min(discards.slice(-12).length, perRow)
        const pos: [number, number, number] = [
          (col - visibleCount / 2 + 0.5) * spacing,
          TILE_HEIGHT / 2,
          row * (TILE_HEIGHT + 0.1)
        ]
        return (
          <Tile3D key={tile.id} tile={tile} position={pos} />
        )
      })}
    </group>
  )
}

function Lights() {
  return (
    <>
      <ambientLight intensity={0.8} />
      <directionalLight 
        position={[0, 25, 10]} 
        intensity={1.5} 
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={60}
        shadow-camera-left={-15}
        shadow-camera-right={15}
        shadow-camera-top={15}
        shadow-camera-bottom={-15}
      />
      <directionalLight position={[0, 15, -10]} intensity={0.5} />
    </>
  )
}

export function GameTable3D() {
  const { wall, hands, currentTurn, initGame, discardTile } = useGameStore()
  const showGame = wall.length > 0 || hands.east.tiles.length > 0
  const isPlayerTurn = currentTurn === 'east'
  
  const handleDiscard = (tileId: string) => {
    if (isPlayerTurn) {
      discardTile('east', tileId)
    }
  }
  
  return (
    <div className="relative w-full min-h-screen flex flex-col items-center justify-start p-2 sm:p-4">
      <Header />
      
      {!showGame && (
        <div className="flex-1 flex items-center justify-center">
          <button
            onClick={initGame}
            className="px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-bold text-lg sm:text-xl bg-gradient-to-b from-green-400 to-green-600 text-white hover:from-green-300 hover:to-green-500 hover:scale-105 shadow-xl transition-all duration-200"
          >
            Start Game
          </button>
        </div>
      )}
      
      {showGame && (
        <>
          <TurnIndicator />
          <ActionBar />
          
          <div className="w-full max-w-6xl h-[65vh] sm:h-[75vh] rounded-lg overflow-hidden shadow-2xl border-4 border-[#1a472a]/50">
            <Canvas
              camera={{ 
                position: [0, 18, 14], 
                fov: 40,
                near: 0.1,
                far: 100
              }}
              shadows
              gl={{ antialias: true }}
            >
              <Suspense fallback={null}>
                <Lights />
                <TableSurface />
                <Wall count={wall.length} />
                <PlayerHand tiles={hands.east.tiles} onDiscard={handleDiscard} />
                <OpponentHand position="south" count={hands.south.tiles.length} />
                <OpponentHand position="west" count={hands.west.tiles.length} />
                <OpponentHand position="north" count={hands.north.tiles.length} />
                <DiscardArea discards={hands.east.discards} />
              </Suspense>
            </Canvas>
          </div>
          
          <FloatingActionButton />
        </>
      )}
    </div>
  )
}