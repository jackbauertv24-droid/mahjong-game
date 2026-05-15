import { Suspense, useState, useRef } from 'react'
import { Canvas, useLoader, ThreeEvent } from '@react-three/fiber'
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
      <planeGeometry args={[10, 10]} />
      <meshStandardMaterial color="#1a472a" />
    </mesh>
  )
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

function EastDiscards({ tiles }: { tiles: Array<{ id: string; suit: string; imagePath: string }> }) {
  const spacing = TILE_W + 0.03
  const perRow = 8
  
  return <>
    {tiles.map((tile, i) => {
      const row = Math.floor(i / perRow)
      const col = i % perRow
      const rowTileCount = Math.min(tiles.length - row * perRow, perRow)
      const x = (col - rowTileCount/2 + 0.5) * spacing
      const z = -TABLE_RADIUS + 1.5 + row * (TILE_H + 0.05)
      return <Tile key={tile.id} position={[x, TILE_D/2 + 0.01, z]} rotation={[-Math.PI/2, 0, 0]} tile={tile} isBack={false} />
    })}
  </>
}

function SouthDiscards({ tiles }: { tiles: Array<{ id: string; suit: string; imagePath: string }> }) {
  const spacing = TILE_W + 0.03
  const perRow = 8
  
  return <>
    {tiles.map((tile, i) => {
      const row = Math.floor(i / perRow)
      const col = i % perRow
      const rowTileCount = Math.min(tiles.length - row * perRow, perRow)
      const z = (col - rowTileCount/2 + 0.5) * spacing
      const x = -TABLE_RADIUS + 1.5 + row * (TILE_H + 0.05)
      return <Tile key={tile.id} position={[x, TILE_D/2 + 0.01, z]} rotation={[-Math.PI/2, 0, Math.PI/2]} tile={tile} isBack={false} />
    })}
  </>
}

function WestDiscards({ tiles }: { tiles: Array<{ id: string; suit: string; imagePath: string }> }) {
  const spacing = TILE_W + 0.03
  const perRow = 8
  
  return <>
    {tiles.map((tile, i) => {
      const row = Math.floor(i / perRow)
      const col = i % perRow
      const rowTileCount = Math.min(tiles.length - row * perRow, perRow)
      const x = (col - rowTileCount/2 + 0.5) * spacing
      const z = TABLE_RADIUS - 1.5 - row * (TILE_H + 0.05)
      return <Tile key={tile.id} position={[x, TILE_D/2 + 0.01, z]} rotation={[-Math.PI/2, 0, Math.PI]} tile={tile} isBack={false} />
    })}
  </>
}

function NorthDiscards({ tiles }: { tiles: Array<{ id: string; suit: string; imagePath: string }> }) {
  const spacing = TILE_W + 0.03
  const perRow = 8
  
  return <>
    {tiles.map((tile, i) => {
      const row = Math.floor(i / perRow)
      const col = i % perRow
      const rowTileCount = Math.min(tiles.length - row * perRow, perRow)
      const z = (col - rowTileCount/2 + 0.5) * spacing
      const x = TABLE_RADIUS - 1.5 - row * (TILE_H + 0.05)
      return <Tile key={tile.id} position={[x, TILE_D/2 + 0.01, z]} rotation={[-Math.PI/2, 0, -Math.PI/2]} tile={tile} isBack={false} />
    })}
  </>
}

function CameraController() {
  const controlsRef = useRef<any>(null)
  
  return (
    <OrbitControls 
      ref={controlsRef}
      enableRotate={false}
      enablePan={true}
      enableZoom={true}
      minDistance={8}
      maxDistance={30}
      target={[0, 0, 0]}
      panSpeed={0.5}
      maxAzimuthAngle={Infinity}
      minAzimuthAngle={Infinity}
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
            <Canvas camera={{ position: [0, 20, -12], fov: 28 }} shadows gl={{ antialias: true }}>
              <Suspense fallback={null}>
                <ambientLight intensity={0.7} />
                <directionalLight position={[0, 20, -5]} intensity={1.2} castShadow shadow-mapSize={[2048,2048]} />
                <Table />
                <EastHand tiles={hands.east.tiles} onDiscard={isPlayerTurn ? (id) => discardTile('east', id) : () => {}} />
                <SouthHand count={hands.south.tiles.length} />
                <WestHand count={hands.west.tiles.length} />
                <NorthHand count={hands.north.tiles.length} />
                <EastDiscards tiles={hands.east.discards} />
                <SouthDiscards tiles={hands.south.discards} />
                <WestDiscards tiles={hands.west.discards} />
                <NorthDiscards tiles={hands.north.discards} />
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