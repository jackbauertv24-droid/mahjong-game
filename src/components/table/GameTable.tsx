import { Wall } from './Wall'
import { DiscardArea } from './DiscardArea'
import { PlayerHand, OpponentHand } from '../hand'
import { ActionBar, TurnIndicator, Header } from '../ui'
import { useGameStore } from '../../game/flow'

export function GameTable() {
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
          
          <div className="relative w-full max-w-4xl aspect-[4/3] sm:aspect-[5/4] flex items-center justify-center my-4">
            <OpponentHand position="north" />
            <OpponentHand position="west" />
            <OpponentHand position="south" />
            
            <div className="absolute inset-0 flex items-center justify-center">
              <Wall tilesRemaining={wall.length} />
            </div>
            
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 mb-2">
              <DiscardArea />
            </div>
          </div>
          
          <div className="mt-4">
            <PlayerHand />
          </div>
        </>
      )}
    </div>
  )
}