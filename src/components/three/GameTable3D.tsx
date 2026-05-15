import { Canvas } from '@react-three/fiber'
import { useGameStore } from '../../game/flow'
import { Header, TurnIndicator, ActionBar, FloatingActionButton } from '../ui'

function SimpleScene() {
  return (
    <>
      <ambientLight intensity={1} />
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial color="orange" />
      </mesh>
      <mesh position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="#1a472a" />
      </mesh>
    </>
  )
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
          
          <div className="w-full h-[600px] border-4 border-red-500">
            <Canvas camera={{ position: [5, 5, 5], fov: 50 }}>
              <SimpleScene />
            </Canvas>
          </div>
          
          <FloatingActionButton />
        </>
      )}
    </div>
  )
}