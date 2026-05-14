import { Tile, getTileColorByCharacter } from '../../game/tiles'

interface DiscardTileProps {
  tile: Tile
  size?: 'small' | 'mini'
}

export function DiscardTile({ tile, size = 'small' }: DiscardTileProps) {
  const color = getTileColorByCharacter(tile.character)
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
      <div
        className="text-lg sm:text-xl font-bold font-serif"
        style={{ color }}
      >
        {tile.character}
      </div>
      {tile.suit !== 'feng' && tile.suit !== 'jian' && tile.suit !== 'hua' && tile.suit !== 'ji' && (
        <div className="text-xs text-gray-500 absolute bottom-0.5">
          {tile.suit === 'wan' ? '万' : tile.suit === 'tong' ? '筒' : '条'}
        </div>
      )}
      <div className="absolute inset-0 rounded-md bg-gradient-to-b from-white/15 to-transparent pointer-events-none" />
    </div>
  )
}