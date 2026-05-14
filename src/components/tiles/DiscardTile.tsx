import { Tile } from '../../game/tiles'

interface DiscardTileProps {
  tile: Tile
  size?: 'small' | 'mini'
}

export function DiscardTile({ tile, size = 'small' }: DiscardTileProps) {
  const sizeClasses = {
    small: 'w-10 h-12 sm:w-11 sm:h-13',
    mini: 'w-7 h-9 sm:w-8 sm:h-10',
  }
  
  return (
    <div
      className={`
        ${sizeClasses[size]}
        relative flex flex-col items-center justify-center
        rounded-md
        bg-gradient-to-b from-[#f5f5dc] to-[#e8e8c8]
        border border-[#8b7355]/50
        shadow-sm
        opacity-85
      `}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-6xl sm:text-7xl leading-none" style={{ lineHeight: '1' }}>
          {tile.emoji}
        </span>
      </div>
      <div className="absolute inset-0 rounded-md bg-gradient-to-b from-white/15 to-transparent pointer-events-none" />
    </div>
  )
}