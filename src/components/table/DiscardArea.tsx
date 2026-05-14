import { useGameStore } from '../../game/flow'

export function DiscardArea() {
  const { hands } = useGameStore()
  const discards = hands.east.discards
  
  if (discards.length === 0) {
    return (
      <div className="text-sm text-white/40 italic">
        No tiles discarded yet
      </div>
    )
  }
  
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="text-xs sm:text-sm text-white/60">Your Discards</div>
      <div className="flex flex-wrap justify-center gap-1 max-w-md">
        {discards.map((tile) => (
          <div
            key={tile.id}
            className="w-10 h-12 sm:w-12 sm:h-14 flex flex-col items-center justify-center bg-[#f5f5dc]/90 rounded border border-[#8b7355]/50 shadow text-sm sm:text-base font-serif"
            style={{ color: tile.character === '中' ? '#ff0000' : tile.character === '发' ? '#006400' : '#333' }}
          >
            <span>{tile.character}</span>
            {tile.suit !== 'feng' && tile.suit !== 'jian' && (
              <span className="text-xs text-gray-500">
                {tile.suit === 'wan' ? '万' : tile.suit === 'tong' ? '筒' : '条'}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}