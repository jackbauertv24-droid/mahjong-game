import { Suspense, useMemo } from 'react'
import { Canvas, useLoader } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import * as THREE from 'three'
import { useGameStore } from '../../game/flow'
import { Header, TurnIndicator, ActionBar, FloatingActionButton } from '../ui'

const TILE_WIDTH = 0.6
const TILE_HEIGHT = 0.85
const TILE_DEPTH = 0.3

interface Tile3DProps {
  tile: { id: string; suit: string; value: number | string; imagePath: string }
  position: [number, number, number]
  rotation?: [number, number, number]
  onClick?: () => void
}

function TileFace({ imagePath }: { imagePath: string }) {
  const texture = useLoader(THREE.TextureLoader, imagePath)
  texture.colorSpace = THREE.SRGBColorSpace
  return (
    <mesh position={[0, 0, TILE_DEPTH / 2 + 0.005]}>
      <planeGeometry args={[TILE_WIDTH * 0.85, TILE_HEIGHT * 0.85]} />
      <meshBasicMaterial map={texture} />
    </mesh>
  )
}

function Tile3D({ tile, position, rotation = [0, 0, 0], onClick }: Tile3DProps) {
  return (
    <group position={position} rotation={rotation} onClick={onClick}>
      <RoundedBox args={[TILE_WIDTH, TILE_HEIGHT, TILE_DEPTH]} radius={0.05} smoothness={4} castShadow receiveShadow>
        <meshStandardMaterial color="#fffef5" />
      </RoundedBox>
      <Suspense fallback={<mesh position={[0, 0, TILE_DEPTH/2+0.005]}><planeGeometry args={[TILE_WIDTH*0.7, TILE_HEIGHT*0.7]} /><meshBasicMaterial color="#fffef5" /></mesh>}>
        <TileFace imagePath={tile.imagePath} />
      </Suspense>
    </group>
  )
}

function TileBack3D({ position, rotation = [0, 0, 0] }: { position: [number, number, number]; rotation?: [number, number, number] }) {
  return (
    <group position={position} rotation={rotation}>
      <RoundedBox args={[TILE_WIDTH, TILE_HEIGHT, TILE_DEPTH]} radius={0.05} smoothness={4} castShadow receiveShadow>
        <meshStandardMaterial color="#2d5a3d" />
      </RoundedBox>
    </group>
  )
}

function TableSurface() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
      <planeGeometry args={[12, 12]} />
      <meshStandardMaterial color="#1a472a" />
    </mesh>
  )
}

function Wall({ count }: { count: number }) {
  const positions = useMemo(() => {
    const result: [number, number, number][] = []
    const perRow = 12
    for (let i = 0; i < Math.min(count, 24); i++) {
      const row = Math.floor(i / perRow)
      const col = i % perRow
      const x = (col - perRow / 2 + 0.5) * (TILE_WIDTH + 0.05)
      const y = TILE_HEIGHT / 2 + row * (TILE_DEPTH + 0.05)
      const z = 5.5 + row * 0.5
      result.push([x, y, z])
    }
    return result
  }, [count])
  return <>{positions.map((pos, i) => <TileBack3D key={i} position={pos} />)}</>
}

function PlayerHand({ tiles, onDiscard }: { tiles: Array<{ id: string; suit: string; value: number | string; imagePath: string }>; onDiscard?: (id: string) => void }) {
  const spacing = TILE_WIDTH + 0.1
  const startX = -(tiles.length - 1) * spacing / 2
  return (
    <group position={[0, 0, -5]}>
      {tiles.map((tile, i) => (
        <Tile3D key={tile.id} tile={tile} position={[startX + i * spacing, TILE_HEIGHT/2, 0]} onClick={() => onDiscard?.(tile.id)} />
      ))}
    </group>
  )
}

function OpponentHand({ position, count }: { position: 'south' | 'west' | 'north'; count: number }) {
  const configs: Record<string, { pos: [number, number, number]; rot: [number, number, number] }> = {
    south: { pos: [-5.5, 0, 0], rot: [0, Math.PI/2, 0] },
    west: { pos: [0, 0, 5.5], rot: [0, Math.PI, 0] },
    north: { pos: [5.5, 0, 0], rot: [0, -Math.PI/2, 0] },
  }
  const { pos, rot } = configs[position]
  const spacing = TILE_WIDTH + 0.08
  const positions: [number, number, number][] = []
  for (let i = 0; i < Math.min(count, 13); i++) {
    const offset = (i - (Math.min(count,13)-1)/2) * spacing
    positions.push([offset, TILE_HEIGHT/2, 0])
  }
  return (
    <group position={pos} rotation={rot}>
      {positions.map((p, i) => <TileBack3D key={i} position={p} />)}
    </group>
  )
}

function DiscardArea({ discards }: { discards: Array<{ id: string; suit: string; value: number | string; imagePath: string }> }) {
  const spacing = TILE_WIDTH + 0.05
  const perRow = 7
  return (
    <group position={[0, 0, -0.5]}>
      {discards.slice(-10).map((tile, i) => {
        const row = Math.floor(i / perRow)
        const col = i % perRow
        const visibleCount = Math.min(discards.slice(-10).length, perRow)
        const pos: [number, number, number] = [(col - visibleCount/2 + 0.5) * spacing, TILE_HEIGHT/2, row * (TILE_HEIGHT + 0.05)]
        return <Tile3D key={tile.id} tile={tile} position={pos} />
      })}
    </group>
  )
}

export function GameTable3D() {
  const { wall, hands, currentTurn, initGame, discardTile } = useGameStore()
  const showGame = wall.length > 0 || hands.east.tiles.length > 0
  const isPlayerTurn = currentTurn === 'east'
  
  return (
    <div className="w-full min-h-screen flex flex-col items-center p-2 sm:p-4">
      <Header />
      {!showGame ? (
        <button onClick={initGame} className="px-8 py-4 rounded-lg font-bold text-xl bg-gradient-to-b from-green-400 to-green-600 text-white hover:scale-105 shadow-xl transition-all">
          Start Game
        </button>
      ) : (
        <>
          <TurnIndicator />
          <ActionBar />
          <div className="w-full max-w-5xl h-[60vh] sm:h-[70vh] rounded-lg overflow-hidden shadow-2xl">
            <Canvas camera={{ position: [0, 10, -10], fov: 45 }} shadows gl={{ antialias: true }}>
              <Suspense fallback={null}>
                <ambientLight intensity={0.9} />
                <directionalLight position={[5, 15, -5]} intensity={1.2} castShadow shadow-mapSize={[1024,1024]} />
                <TableSurface />
                <Wall count={wall.length} />
                <PlayerHand tiles={hands.east.tiles} onDiscard={isPlayerTurn ? (id) => discardTile('east', id) : undefined} />
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