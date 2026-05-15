import { useRef, useState } from 'react'
import { RoundedBox } from '@react-three/drei'
import { useFrame, ThreeEvent } from '@react-three/fiber'
import * as THREE from 'three'
import { Tile } from '../../game/tiles'

interface Tile3DProps {
  tile: Tile
  position: [number, number, number]
  rotation?: [number, number, number]
  onClick?: () => void
  isSelected?: boolean
  isHoverable?: boolean
}

const TILE_COLORS: Record<string, string> = {
  wan: '#d4a574',
  tiao: '#8b4513',
  tong: '#cd853f',
  feng: '#6b8e23',
  jian: '#2e8b57',
}

export function Tile3D({ 
  tile, 
  position, 
  rotation = [0, 0, 0],
  onClick,
  isSelected = false,
  isHoverable = true
}: Tile3DProps) {
  const meshRef = useRef<THREE.Group>(null)
  const [hovered, setHovered] = useState(false)
  
  const targetY = isSelected ? position[1] + 0.3 : position[1]
  const targetScale = hovered && isHoverable ? 1.1 : 1
  const tileColor = TILE_COLORS[tile.suit] || '#f5f5dc'
  
  useFrame(() => {
    if (!meshRef.current) return
    
    meshRef.current.position.y = THREE.MathUtils.lerp(
      meshRef.current.position.y,
      targetY,
      0.1
    )
    
    const currentScale = meshRef.current.scale.x
    const newScale = THREE.MathUtils.lerp(currentScale, targetScale, 0.1)
    meshRef.current.scale.setScalar(newScale)
  })
  
  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation()
    onClick?.()
  }
  
  const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
    if (!isHoverable) return
    e.stopPropagation()
    setHovered(true)
    document.body.style.cursor = 'pointer'
  }
  
  const handlePointerOut = (e: ThreeEvent<PointerEvent>) => {
    if (!isHoverable) return
    e.stopPropagation()
    setHovered(false)
    document.body.style.cursor = 'default'
  }
  
  return (
    <group
      ref={meshRef}
      position={position}
      rotation={rotation}
      onClick={handleClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      <RoundedBox args={[0.7, 1.0, 0.4]} radius={0.05} smoothness={4} castShadow receiveShadow>
        <meshStandardMaterial color={tileColor} />
      </RoundedBox>
      
      <mesh position={[0, 0, 0.21]}>
        <planeGeometry args={[0.5, 0.7]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      
      <mesh position={[0, 0, -0.2]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[0.5, 0.7]} />
        <meshBasicMaterial color="#2d5a3d" />
      </mesh>
    </group>
  )
}

export function TileBack3D({ 
  position, 
  rotation = [0, 0, 0]
}: { 
  position: [number, number, number]
  rotation?: [number, number, number]
}) {
  return (
    <group position={position} rotation={rotation}>
      <RoundedBox args={[0.7, 1.0, 0.4]} radius={0.05} smoothness={4} castShadow receiveShadow>
        <meshStandardMaterial color="#2d5a3d" />
      </RoundedBox>
      
      <mesh position={[0, 0, 0.21]}>
        <circleGeometry args={[0.15, 32]} />
        <meshBasicMaterial color="#3a6a4d" />
      </mesh>
    </group>
  )
}