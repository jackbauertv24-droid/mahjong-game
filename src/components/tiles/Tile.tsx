import { Tile } from '../../game/tiles'

interface TileProps {
  tile: Tile
  onClick?: () => void
  isSelected?: boolean
  disabled?: boolean
  size?: 'normal' | 'small'
}

export function TileComponent({ tile, onClick, isSelected, disabled, size = 'normal' }: TileProps) {
  const baseClasses = size === 'normal' 
    ? 'w-14 h-20 sm:w-16 h-24 md:w-20 h-28'
    : 'w-10 h-14 sm:w-12 h-16'
  
  return (
    <div
      onClick={disabled ? undefined : onClick}
      className={`
        ${baseClasses}
        relative flex flex-col items-center justify-center
        rounded-lg cursor-pointer select-none overflow-hidden
        transition-all duration-200 ease-out
        bg-gradient-to-b from-[#f5f5dc] to-[#e8e8c8]
        border-2 border-[#8b7355]
        shadow-tile
        ${isSelected ? 'shadow-tile-selected -translate-y-3 rotate-x-10' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        hover:shadow-tile-hover hover:-translate-y-2
        active:scale-95
      `}
      style={{
        transformStyle: 'preserve-3d',
        transform: isSelected ? 'translateY(-8px) rotateX(10deg)' : undefined,
      }}
    >
      <img 
        src={tile.imagePath}
        alt={tile.displayName}
        className="w-full h-full object-contain p-1"
      />
      <div className="absolute inset-0 rounded-lg bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
    </div>
  )
}

interface TileBackProps {
  size?: 'normal' | 'small' | 'mini'
  className?: string
}

export function TileBack({ size = 'normal', className = '' }: TileBackProps) {
  const sizeClasses = {
    normal: 'w-14 h-20 sm:w-16 h-24 md:w-20 h-28',
    small: 'w-10 h-14 sm:w-12 h-16',
    mini: 'w-8 h-10',
  }
  
  return (
    <div
      className={`
        ${sizeClasses[size]}
        ${className}
        relative flex items-center justify-center
        rounded-lg overflow-hidden
        bg-gradient-to-b from-[#2d5a3d] to-[#1a472a]
        border-2 border-[#0a2a1a]
        shadow-tile
      `}
    >
      <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-gradient-to-b from-[#3a6a4d] to-[#2a5a3d] border border-[#1a3a2d]" />
      <div className="absolute inset-0 rounded-lg bg-gradient-to-b from-[#4a7a5d]/30 to-transparent pointer-events-none" />
    </div>
  )
}

export function WallTile() {
  return (
    <TileBack size="small" className="opacity-90" />
  )
}