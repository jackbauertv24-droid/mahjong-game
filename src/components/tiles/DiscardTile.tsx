import { Tile } from '../../game/tiles'

interface DiscardTileProps {
  tile: Tile
  size?: 'small' | 'mini'
}

export function DiscardTile({ tile, size = 'small' }: DiscardTileProps) {
  const sizeClasses = {
    small: 'w-10 h-14 sm:w-12 h-16',
    mini: 'w-8 h-10',
  }
  
  const emojiSize = size === 'small'
    ? 'text-4xl sm:text-5xl'
    : 'text-3xl'
  
  return (
    <div
      className={`
        ${sizeClasses[size]}
        relative flex flex-col items-center justify-center overflow-hidden
        rounded-md
        bg-gradient-to-b from-[#f5f5dc] to-[#e8e8c8]
        border border-[#8b7355]/50
        shadow-sm
        opacity-85
      `}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={`${emojiSize} leading-none`} style={{ lineHeight: '1' }}>
          {tile.emoji}
        </span>
      </div>
      <div className="absolute inset-0 rounded-md bg-gradient-to-b from-white/15 to-transparent pointer-events-none" />
    </div>
  )
}