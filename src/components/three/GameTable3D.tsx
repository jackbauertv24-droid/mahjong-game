import { Suspense } from 'react'
import { Canvas, useLoader } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import * as THREE from 'three'
import { useGameStore } from '../../game/flow'
import { Header, TurnIndicator, ActionBar, FloatingActionButton } from '../ui'

const TILE_W = 0.55
const TILE_H = 0.8
const TILE_D = 0.25
const TABLE_RADIUS = 4.5

function TileFace({ imagePath }: { imagePath: string }) {
  const texture = useLoader(THREE.TextureLoader, imagePath)
  texture.colorSpace = THREE.SRGBColorSpace
  return (
    <mesh position={[0, 0, TILE_D / 2 + 0.005]}>
      <planeGeometry args={[TILE_W * 0.85, TILE_H * 0.85]} />
      <meshBasicMaterial map={texture} />
    </mesh>
  )
}

function Tile({ position, rotation, tile, showFace }: {
  position: [number, number, number]
  rotation: [number, number, number]
  tile?: { id: string; suit: string; imagePath: string }
  showFace: boolean
}) {
  return (
    <group position={position} rotation={rotation}>
      <RoundedBox args={[TILE_W, TILE_H, TILE_D]} radius={0.04} smoothness={4} castShadow receiveShadow>
        <meshStandardMaterial color={showFace ? "#fffef5" : "#2d5a3d"} />
      </RoundedBox>
      {showFace && tile && (
        <Suspense fallback={<mesh position={[0, 0, TILE_D/2+0.005]}><planeGeometry args={[TILE_W*0.8, TILE_H*0.8]} /><meshBasicMaterial color="#fffef5" /></mesh>}>
          <TileFace imagePath={tile.imagePath} />
        </Suspense>
      )}
      {!showFace && (
        <mesh position={[0, 0, TILE_D/2+0.005]}>
          <circleGeometry args={[0.1, 32]} />
          <meshBasicMaterial color="#3a6a4d" />
        </mesh>
      )}
    </group>
  )
}

function Table() {
  return (
    <mesh rotation={[-Math.PI/2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
      <planeGeometry args={[10, 10]} />
      <meshStandardMaterial color="#1a472a" />
    </mesh>
  )
}

function Wall({ count }: { count: number }) {
  const tiles = []
  for (let i = 0; i < Math.min(count, 20); i++) {
    const row = Math.floor(i / 10)
    const col = i % 10
    const x = (col - 5 + 0.5) * (TILE_W + 0.04)
    const y = TILE_H/2 + row * (TILE_D + 0.04)
    const z = TABLE_RADIUS + 0.5 + row * 0.3
    tiles.push({ pos: [x, y, z] as [number,number,number], rot: [0, 0, 0] as [number,number,number] })
  }
  return <>{tiles.map((t, i) => <Tile key={i} position={t.pos} rotation={t.rot} showFace={false} />)}</>
}

function PlayerRow({ tiles, side }: { tiles: Array<{ id: string; suit: string; imagePath: string }>; side: 'east' | 'south' | 'west' | 'north' }) {
  const positions: { pos: [number,number,number]; rot: [number,number,number] }[] = []
  const spacing = TILE_W + 0.06
  
  for (let i = 0; i < tiles.length; i++) {
    const offset = (i - (tiles.length - 1) / 2) * spacing
    
    if (side === 'east') {
      positions.push({ pos: [offset, TILE_H/2, -TABLE_RADIUS], rot: [0, Math.PI, 0] })
    } else if (side === 'south') {
      positions.push({ pos: [-TABLE_RADIUS, TILE_H/2, offset], rot: [0, -Math.PI/2, 0] })
    } else if (side === 'west') {
      positions.push({ pos: [offset, TILE_H/2, TABLE_RADIUS], rot: [0, 0, 0] })
    } else if (side === 'north') {
      positions.push({ pos: [TABLE_RADIUS, TILE_H/2, offset], rot: [0, Math.PI/2, 0] })
    }
  }
  
  const isEast = side === 'east'
  
  return <>
    {positions.map((p, i) => (
      <Tile key={tiles[i].id} position={p.pos} rotation={p.rot} tile={tiles[i]} showFace={isEast} />
    ))}
  </>
}

function OpponentRow({ count, side }: { count: number; side: 'south' | 'west' | 'north' }) {
  const positions: { pos: [number,number,number]; rot: [number,number,number] }[] = []
  const spacing = TILE_W + 0.06
  
  for (let i = 0; i < count; i++) {
    const offset = (i - (count - 1) / 2) * spacing
    
    if (side === 'south') {
      positions.push({ pos: [-TABLE_RADIUS, TILE_H/2, offset], rot: [0, -Math.PI/2, 0] })
    } else if (side === 'west') {
      positions.push({ pos: [offset, TILE_H/2, TABLE_RADIUS], rot: [0, 0, 0] })
    } else if (side === 'north') {
      positions.push({ pos: [TABLE_RADIUS, TILE_H/2, offset], rot: [0, Math.PI/2, 0] })
    }
  }
  
  return <>
    {positions.map((p, i) => <Tile key={i} position={p.pos} rotation={p.rot} showFace={false} />)}
  </>
}

function Discards({ tiles }: { tiles: Array<{ id: string; suit: string; imagePath: string }> }) {
  const positions: { pos: [number,number,number]; rot: [number,number,number] }[] = []
  const spacing = TILE_W + 0.04
  const perRow = 6
  
  for (let i = 0; i < Math.min(tiles.length, 12); i++) {
    const row = Math.floor(i / perRow)
    const col = i % perRow
    const offset = (col - Math.min(Math.min(tiles.length,12), perRow)/2 + 0.5) * spacing
    positions.push({ pos: [offset, TILE_H/2, -TABLE_RADIUS + 1 + row * (TILE_H + 0.04)], rot: [0, Math.PI, 0] })
  }
  
  return <>
    {tiles.slice(-12).map((tile, i) => (
      <Tile key={tile.id} position={positions[i]?.pos || [0, TILE_H/2, -2]} rotation={positions[i]?.rot || [0, Math.PI, 0]} tile={tile} showFace={true} />
    ))}
  </>
}

export function GameTable3D() {
  const { wall, hands, currentTurn, initGame, discardTile } = useGameStore()
  const showGame = wall.length > 0 || hands.east.tiles.length > 0
  
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
          <div className="w-full max-w-5xl h-[65vh] sm:h-[75vh] rounded-lg overflow-hidden shadow-2xl">
            <Canvas camera={{ position: [0, 12, -12], fov: 35 }} shadows gl={{ antialias: true }}>
              <Suspense fallback={null}>
                <ambientLight intensity={0.7} />
                <directionalLight position={[3, 10, -5]} intensity={1} castShadow shadow-mapSize={[1024,1024]} />
                <Table />
                <Wall count={wall.length} />
                <PlayerRow tiles={hands.east.tiles} side="east" />
                <OpponentRow count={hands.south.tiles.length} side="south" />
                <OpponentRow count={hands.west.tiles.length} side="west" />
                <OpponentRow count={hands.north.tiles.length} side="north" />
                <Discards tiles={hands.east.discards} />
              </Suspense>
            </Canvas>
          </div>
          <FloatingActionButton />
        </>
      )}
    </div>
  )
}