import { Canvas } from '@react-three/fiber'
import { OrthographicCamera } from '@react-three/drei'
import { TableSurface } from './TableSurface'
import { Wall3D } from './Wall'
import { DiscardArea3D } from './DiscardArea'
import { PlayerHand3D } from './PlayerHand'
import { OpponentHand3D } from './OpponentHand'
import { useGameStore } from '../../game/flow'
import { Header, TurnIndicator, ActionBar, FloatingActionButton } from '../ui'

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
          
          <div className="relative w-full max-w-4xl aspect-[4/3] sm:aspect-[5/4]">
            <Canvas
              shadows
              gl={{ antialias: true, alpha: false }}
              style={{ background: 'linear-gradient(to bottom, #1a472a, #0a2a1a)' }}
            >
              <OrthographicCamera
                makeDefault
                position={[12, 12, 12]}
                zoom={40}
                near={0.1}
                far={1000}
              />
              
              <ambientLight intensity={0.6} />
              <directionalLight
                position={[10, 20, 10]}
                intensity={1}
                castShadow
                shadow-mapSize={[1024, 1024]}
              />
              
              <TableSurface />
              <Wall3D tilesRemaining={wall.length} />
              <DiscardArea3D discards={hands.east.discards} />
              <PlayerHand3D tiles={hands.east.tiles} />
              <OpponentHand3D position="south" tiles={hands.south.tiles} />
              <OpponentHand3D position="west" tiles={hands.west.tiles} />
              <OpponentHand3D position="north" tiles={hands.north.tiles} />
            </Canvas>
          </div>
          
          <FloatingActionButton />
        </>
      )}
    </div>
  )
}