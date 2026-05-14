export type TileSuit = 'wan' | 'tong' | 'tiao' | 'feng' | 'jian' | 'hua' | 'ji'

export type TileValue = number | string

export interface Tile {
  id: string
  suit: TileSuit
  value: TileValue
  emoji: string
  displayName: string
  imagePath: string
}

export interface TileGroup {
  type: 'sequence' | 'triplet' | 'quad' | 'pair'
  tiles: Tile[]
}

export type PlayerPosition = 'east' | 'south' | 'west' | 'north'

export interface PlayerHand {
  tiles: Tile[]
  melds: TileGroup[]
  discards: Tile[]
}

export const WAN_EMOJIS = ['🀇', '🀈', '🀉', '🀊', '🀋', '🀌', '🀍', '🀎', '🀏']
export const TIAO_EMOJIS = ['🀐', '🀑', '🀒', '🀓', '🀔', '🀕', '🀖', '🀗', '🀘']
export const TONG_EMOJIS = ['🀙', '🀚', '🀛', '🀜', '🀝', '🀞', '🀟', '🀠', '🀡']
export const FENG_EMOJIS = ['🀀', '🀁', '🀂', '🀃']
export const JIAN_EMOJIS = ['🀄', '🀅', '🀆']
export const HUA_EMOJIS = ['🀢', '🀣', '🀤', '🀥']
export const JI_EMOJIS = ['🀦', '🀧', '🀨', '🀩']

const SUIT_DISPLAY: Record<TileSuit, string> = {
  wan: '万',
  tong: '筒',
  tiao: '条',
  feng: '风',
  jian: '箭',
  hua: '花',
  ji: '季',
}

export function getTileImagePath(suit: TileSuit, value: TileValue): string {
  if (suit === 'hua' || suit === 'ji') {
    return ''
  }
  const valueNum = typeof value === 'number' ? value : parseInt(value as string) || 0
  return `/mahjong-game/assets/tiles/${suit}/${valueNum}.svg`
}

export function createTile(suit: TileSuit, value: TileValue, emoji: string, index: number): Tile {
  const valueNum = typeof value === 'number' ? value : parseInt(value as string) || 0
  const displayName = suit === 'feng' || suit === 'jian' || suit === 'hua' || suit === 'ji'
    ? `${emoji}`
    : `${valueNum}${SUIT_DISPLAY[suit]}`
  
  return {
    id: `${suit}-${value}-${index}`,
    suit,
    value,
    emoji,
    displayName,
    imagePath: getTileImagePath(suit, value),
  }
}

export function generateAllTiles(): Tile[] {
  const tiles: Tile[] = []
  let idCounter = 0
  
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 4; j++) {
      tiles.push(createTile('wan', i + 1, WAN_EMOJIS[i], idCounter++))
    }
  }
  
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 4; j++) {
      tiles.push(createTile('tiao', i + 1, TIAO_EMOJIS[i], idCounter++))
    }
  }
  
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 4; j++) {
      tiles.push(createTile('tong', i + 1, TONG_EMOJIS[i], idCounter++))
    }
  }
  
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      tiles.push(createTile('feng', i + 1, FENG_EMOJIS[i], idCounter++))
    }
  }
  
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 4; j++) {
      tiles.push(createTile('jian', i + 1, JIAN_EMOJIS[i], idCounter++))
    }
  }
  
  for (let i = 0; i < 4; i++) {
    tiles.push(createTile('hua', i + 1, HUA_EMOJIS[i], idCounter++))
  }
  
  for (let i = 0; i < 4; i++) {
    tiles.push(createTile('ji', i + 1, JI_EMOJIS[i], idCounter++))
  }
  
  return tiles
}

export function shuffleTiles(tiles: Tile[]): Tile[] {
  const shuffled = [...tiles]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const temp = shuffled[i]
    shuffled[i] = shuffled[j]
    shuffled[j] = temp
  }
  return shuffled
}

export function sortTiles(tiles: Tile[]): Tile[] {
  const suitOrder: TileSuit[] = ['wan', 'tiao', 'tong', 'feng', 'jian', 'hua', 'ji']
  return [...tiles].sort((a, b) => {
    const suitIndexA = suitOrder.indexOf(a.suit)
    const suitIndexB = suitOrder.indexOf(b.suit)
    if (suitIndexA !== suitIndexB) {
      return suitIndexA - suitIndexB
    }
    const valueA = typeof a.value === 'number' ? a.value : parseInt(a.value as string) || 0
    const valueB = typeof b.value === 'number' ? b.value : parseInt(b.value as string) || 0
    return valueA - valueB
  })
}