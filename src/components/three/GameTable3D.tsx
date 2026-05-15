import { Suspense, useState, useRef } from 'react'
import { Canvas, useLoader, ThreeEvent, useThree } from '@react-three/fiber'
import { RoundedBox, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { useGameStore } from '../../game/flow'
import { Header, TurnIndicator, ActionBar, FloatingActionButton } from '../ui'

const TILE_W = 0.5
const TILE_H = 0.7
const TILE_D = 0.2
const TABLE_RADIUS = 3.8

function TileFace({ imagePath }: { imagePath: string }) {
  const texture = useLoader(THREE.TextureLoader, imagePath)
  texture.colorSpace = THREE.SRGBColorSpace
  
  return (
    <>
      <mesh position={[0, 0, TILE_D / 2 + 0.01]}>
        <planeGeometry args={[TILE_W * 0.92, TILE_H * 0.92]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0, 0, TILE_D / 2 + 0.02]}>
        <planeGeometry args={[TILE_W * 0.85, TILE_H * 0.85]} />
        <meshBasicMaterial map={texture} transparent={true} />
      </mesh>
    </>
  )
}

function Tile({ position, rotation, tile, isBack, onClick }: {
  position: [number, number, number]
  rotation: [number, number, number]
  tile?: { id: string; suit: string; imagePath: string }
  isBack: boolean
  onClick?: () => void
}) {
  const [hovered, setHovered] = useState(false)
  
  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation()
    onClick?.()
  }
  
  const handlePointerOver = () => {
    if (onClick) {
      setHovered(true)
      document.body.style.cursor = 'pointer'
    }
  }
  
  const handlePointerOut = () => {
    setHovered(false)
    document.body.style.cursor = 'default'
  }
  
  const scale = hovered ? 1.15 : 1
  
  return (
    <group 
      position={position} 
      rotation={rotation}
      scale={[scale, scale, scale]}
      onClick={handleClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      <RoundedBox args={[TILE_W, TILE_H, TILE_D]} radius={0.04} smoothness={4} castShadow receiveShadow>
        <meshStandardMaterial color={isBack ? "#2d5a3d" : "#fffef5"} />
      </RoundedBox>
      
      {isBack && (
        <mesh position={[0, 0, TILE_D/2 + 0.01]}>
          <circleGeometry args={[0.08, 32]} />
          <meshBasicMaterial color="#3a6a4d" />
        </mesh>
      )}
      
      {!isBack && tile && (
        <Suspense fallback={
          <mesh position={[0, 0, TILE_D / 2 + 0.01]}>
            <planeGeometry args={[TILE_W * 0.92, TILE_H * 0.92]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        }>
          <TileFace imagePath={tile.imagePath} />
        </Suspense>
      )}
    </group>
  )
}

function Table() {
  return (
    <mesh rotation={[-Math.PI/2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
      <planeGeometry args={[9, 9]} />
      <meshStandardMaterial color="#1a472a" />
    </mesh>
  )
}

function Wall({ count }: { count: number }) {
  const tiles = []
  for (let i = 0; i < Math.min(count, 16); i++) {
    const row = Math.floor(i / 8)
    const col = i % 8
    const x = (col - 4 + 0.5) * (TILE_W + 0.02)
    const y = TILE_H/2 + row * (TILE_D + 0.02)
    const z = TABLE_RADIUS + 0.8 + row * 0.2
    tiles.push({ pos: [x, y, z] as [number,number,number], rot: [0, 0, 0] as [number,number,number] })
  }
  return <>{tiles.map((t, i) => <Tile key={i} position={t.pos} rotation={t.rot} isBack={true} />)}</>
}

function EastHand({ tiles, onDiscard }: { tiles: Array<{ id: string; suit: string; imagePath: string }>; onDiscard: (id: string) => void }) {
  const spacing = TILE_W + 0.05
  
  return <>
    {tiles.map((tile, i) => {
      const x = (i - (tiles.length - 1) / 2) * spacing
      return (
        <Tile 
          key={tile.id} 
          position={[x, TILE_H/2, -TABLE_RADIUS]} 
          rotation={[0, Math.PI, 0]} 
          tile={tile} 
          isBack={false}
          onClick={() => onDiscard(tile.id)} 
        />
      )
    })}
  </>
}

function SouthHand({ count }: { count: number }) {
  const spacing = TILE_W + 0.05
  
  return <>
    {Array.from({ length: count }).map((_, i) => {
      const z = (i - (count - 1) / 2) * spacing
      return <Tile key={i} position={[-TABLE_RADIUS, TILE_H/2, z]} rotation={[0, -Math.PI/2, 0]} isBack={true} />
    })}
  </>
}

function WestHand({ count }: { count: number }) {
  const spacing = TILE_W + 0.05
  
  return <>
    {Array.from({ length: count }).map((_, i) => {
      const x = (i - (count - 1) / 2) * spacing
      return <Tile key={i} position={[x, TILE_H/2, TABLE_RADIUS]} rotation={[0, 0, 0]} isBack={true} />
    })}
  </>
}

function NorthHand({ count }: { count: number }) {
  const spacing = TILE_W + 0.05
  
  return <>
    {Array.from({ length: count }).map((_, i) => {
      const z = (i - (count - 1) / 2) * spacing
      return <Tile key={i} position={[TABLE_RADIUS, TILE_H/2, z]} rotation={[0, Math.PI/2, 0]} isBack={true} />
    })}
  </>
}

function Discards({ tiles }: { tiles: Array<{ id: string; suit: string; imagePath: string }> }) {
  const spacing = TILE_W + 0.03
  const perRow = 5
  
  return <>
    {tiles.slice(-10).map((tile, i) => {
      const row = Math.floor(i / perRow)
      const col = i % perRow
      const visibleCount = Math.min(tiles.slice(-10).length, perRow)
      const x = (col - visibleCount/2 + 0.5) * spacing
      const z = -TABLE_RADIUS + 1.2 + row * (TILE_H + 0.03)
      return <Tile key={tile.id} position={[x, TILE_H/2, z]} rotation={[0, Math.PI, 0]} tile={tile} isBack={false} />
    })}
  </>
}

function CameraController() {
  const controlsRef = useRef<any>(null)
  
  return (
    <OrbitControls 
      ref={controlsRef}
      enableRotate={false}
      enablePan={false}
      enableZoom={true}
      minDistance={5}
      maxDistance={25}
      target={[0, 0, 0]}
    />
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
          <div className="w-full max-w-5xl h-[70vh] rounded-lg overflow-hidden shadow-2xl">
            <Canvas camera={{ position: [0, 14, -10], fov: 30 }} shadows gl={{ antialias: true }}>
              <Suspense fallback={null}>
                <ambientLight intensity={0.6} />
                <directionalLight position={[0, 15, -5]} intensity={1.5} castShadow shadow-mapSize={[2048,2048]} />
                <Table />
                <Wall count={wall.length} />
                <EastHand tiles={hands.east.tiles} onDiscard={isPlayerTurn ? (id) => discardTile('east', id) : () => {}} />
                <SouthHand count={hands.south.tiles.length} />
                <WestHand count={hands.west.tiles.length} />
                <NorthHand count={hands.north.tiles.length} />
                <Discards tiles={hands.east.discards} />
                <CameraController />
              </Suspense>
            </Canvas>
          </div>
          <FloatingActionButton />
        </>
      )}
    </div>
  )
}