import { TileBack } from '../tiles'

interface WallProps {
  tilesRemaining: number
}

export function Wall({ tilesRemaining }: WallProps) {
  if (tilesRemaining === 0) return null
  
  const displayCount = Math.min(Math.ceil(tilesRemaining / 10), 9)
  
  return (
    <div className="flex flex-col items-center justify-center opacity-40 scale-90">
      <div className="grid grid-cols-3 gap-0.5">
        {Array.from({ length: displayCount }).map((_, index) => (
          <TileBack key={index} size="mini" className="opacity-60" />
        ))}
      </div>
      <div className="mt-1 text-xs text-white/40">
        {tilesRemaining}
      </div>
    </div>
  )
}