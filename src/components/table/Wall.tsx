import { TileBack } from '../../components/tiles'

interface WallProps {
  tilesRemaining: number
}

export function Wall({ tilesRemaining }: WallProps) {
  const stackCount = Math.ceil(tilesRemaining / 17)
  const displayCount = Math.min(stackCount * 4, 16)
  
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="grid grid-cols-4 sm:grid-cols-5 gap-0.5 sm:gap-1">
        {Array.from({ length: displayCount }).map((_, index) => (
          <TileBack key={index} size="small" className="opacity-70" />
        ))}
      </div>
      <div className="mt-2 text-xs sm:text-sm text-white/50">
        {tilesRemaining} tiles
      </div>
    </div>
  )
}