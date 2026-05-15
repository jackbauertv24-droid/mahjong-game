import { Suspense, useMemo } from 'react'
import { Canvas, useLoader } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import * as THREE from 'three'
import { useGameStore } from '../../game/flow'
import { Header, TurnIndicator, ActionBar, FloatingActionButton } from '../ui'

const TILE_WIDTH = 0.8
const TILE_HEIGHT = 1.2
const TILE_DEPTH = 0.5

const SUIT_COLORS: Record<string, string> = {
  wan: '#f5deb3',
  tiao: '#deb887',
  tong: '#d2b48c',
  feng: '#8fbc8f',
  jian: '#556b2f',
}

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
      <planeGeometry args={[TILE_WIDTH * 0.85, TILE_HEIGHT * 0.85]} />
      <meshBasicMaterial map={texture} transparent={false} />
    </mesh>
  )
}

function Tile3D({ tile, position, rotation = [0, 0, 0], onClick }: Tile3DProps) {
  const baseColor = SUIT_COLORS[tile.suit] || '#f5deb3'
  
  return (
    <group position={position} rotation={rotation} onClick={onClick}>
      <RoundedBox 
        args={[TILE_WIDTH, TILE_HEIGHT, TILE_DEPTH]} 
        radius={0.08} 
        smoothness={4}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color={baseColor} />
      </RoundedBox>
      
      <Suspense fallback={
        <mesh position={[0, 0, TILE_DEPTH / 2 + 0.01]}>
          <planeGeometry args={[TILE_WIDTH * 0.7, TILE_HEIGHT * 0.7]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      }>
        <TileFace imagePath={tile.imagePath} />
      </Suspense>
      
      <mesh position={[0, 0, -TILE_DEPTH / 2 - 0.01]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[TILE_WIDTH * 0.6, TILE_HEIGHT * 0.6]} />
        <meshBasicMaterial color="#1a472a" />
      </mesh>
    </group>
  )
}

function TileBack3D({ position, rotation = [0, 0, 0] }: { position: [number, number, number]; rotation?: [number, number, number] }) {
  return (
    <group position={position} rotation={rotation}>
      <RoundedBox 
        args={[TILE_WIDTH, TILE_HEIGHT, TILE_DEPTH]} 
        radius={0.08} 
        smoothness={4}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color="#1a472a" />
      </RoundedBox>
      
      <mesh position={[0, 0, TILE_DEPTH / 2 + 0.01]}>
        <circleGeometry args={[0.18, 32]} />
        <meshBasicMaterial color="#2d5a3d" />
      </mesh>
    </group>
  )
}

function TableSurface() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
      <planeGeometry args={[14, 14]} />
      <meshStandardMaterial color="#1a472a" />
    </mesh>
  )
}

function Wall({ count }: { count: number }) {
  const tiles = useMemo(() => {
    const result = []
    const perRow = 9
    const maxVisible = Math.min(count, 18)
    
    for (let i = 0; i < maxVisible; i++) {
      const row = Math.floor(i / perRow)
      const col = i % perRow
      const x = (col - perRow / 2 + 0.5) * (TILE_WIDTH + 0.1)
      const y = row * (TILE_DEPTH + 0.1) + TILE_HEIGHT / 2
      const z = 3.5
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
  const spacing = TILE_WIDTH + 0.15
  const startX = -(tiles.length - 1) * spacing / 2
  
  return (
    <group position={[0, 0, -5]}>
      {tiles.map((tile, i) => (
        <Tile3D
          key={tile.id}
          tile={tile}
          position={[startX + i * spacing, TILE_HEIGHT / 2 + 0.1, 0]}
          onClick={() => onDiscard?.(tile.id)}
        />
      ))}
    </group>
  )
}

function OpponentHand({ position, count }: { position: 'left' | 'top' | 'right'; count: number }) {
  const configs: Record<string, { groupPos: [number, number, number]; groupRot: [number, number, number] }> = {
    left: { groupPos: [-5.5, 0, 0], groupRot: [0, Math.PI / 2, 0] },
    top: { groupPos: [0, 0, 5.5], groupRot: [0, Math.PI, 0] },
    right: { groupPos: [5.5, 0, 0], groupRot: [0, -Math.PI / 2, 0] },
  }
  
  const config = configs[position]
  const spacing = TILE_WIDTH + 0.15
  const positions: [number, number, number][] = []
  
  for (let i = 0; i < Math.min(count, 13); i++) {
    const offset = (i - (Math.min(count, 13) - 1) / 2) * spacing
    if (position === 'top') {
      positions.push([offset, TILE_HEIGHT / 2 + 0.1, 0])
    } else {
      positions.push([offset, TILE_HEIGHT / 2 + 0.1, 0])
    }
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
  const spacing = TILE_WIDTH + 0.1
  const perRow = 8
  const positions = useMemo(() => {
    return discards.slice(-12).map((_, i) => {
      const row = Math.floor(i / perRow)
      const col = i % perRow
      return [
        (col - Math.min(perRow, discards.slice(-12).length) / 2 + 0.5) * spacing,
        TILE_HEIGHT / 2,
        row * (TILE_HEIGHT + 0.1) + 1.5
      ] as [number, number, number]
    })
  }, [discards])
  
  return (
    <group position={[0, 0, 0]}>
      {discards.slice(-12).map((tile, i) => (
        <Tile3D key={tile.id} tile={tile} position={positions[i]} />
      ))}
    </group>
  )
}

function Lights() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight 
        position={[10, 20, 5]} 
        intensity={1.2} 
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      <directionalLight position={[-5, 10, -5]} intensity={0.3} />
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
          
          <div className="w-full max-w-5xl h-[60vh] sm:h-[70vh] rounded-lg overflow-hidden shadow-2xl">
            <Canvas
              camera={{ 
                position: [0, 12, 10], 
                fov: 45,
                near: 0.1,
                far: 100
              }}
              shadows
              gl={{ antialias: true, preserveDrawingBuffer: true }}
            >
              <Suspense fallback={null}>
                <Lights />
                <TableSurface />
                <Wall count={wall.length} />
                <PlayerHand tiles={hands.east.tiles} onDiscard={handleDiscard} />
                <OpponentHand position="left" count={hands.south.tiles.length} />
                <OpponentHand position="top" count={hands.west.tiles.length} />
                <OpponentHand position="right" count={hands.north.tiles.length} />
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