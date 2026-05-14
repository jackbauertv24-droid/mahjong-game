export type TileSuit = 'wan' | 'tong' | 'tiao' | 'feng' | 'jian' | 'hua' | 'ji'

export type TileValue = number | string

export interface Tile {
  id: string
  suit: TileSuit
  value: TileValue
  character: string
  displayName: string
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

export const WAN_CHARS = ['一', '二', '三', '四', '五', '六', '七', '八', '九']
export const TONG_CHARS = ['一', '二', '三', '四', '五', '六', '七', '八', '九']
export const TIAO_CHARS = ['一', '二', '三', '四', '五', '六', '七', '八', '九']
export const FENG_CHARS = ['东', '南', '西', '北']
export const JIAN_CHARS = ['中', '发', '白']
export const HUA_CHARS = ['春', '夏', '秋', '冬']
export const JI_CHARS = ['梅', '兰', '菊', '竹']

const SUIT_DISPLAY: Record<TileSuit, string> = {
  wan: '万',
  tong: '筒',
  tiao: '条',
  feng: '风',
  jian: '箭',
  hua: '花',
  ji: '季',
}

export function createTile(suit: TileSuit, value: TileValue, character: string, index: number): Tile {
  const displayName = suit === 'feng' || suit === 'jian' || suit === 'hua' || suit === 'ji'
    ? character
    : `${character}${SUIT_DISPLAY[suit]}`
  
  return {
    id: `${suit}-${value}-${index}`,
    suit,
    value,
    character,
    displayName,
  }
}

export function generateAllTiles(): Tile[] {
  const tiles: Tile[] = []
  let idCounter = 0
  
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 4; j++) {
      tiles.push(createTile('wan', i + 1, WAN_CHARS[i], idCounter++))
    }
  }
  
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 4; j++) {
      tiles.push(createTile('tong', i + 1, TONG_CHARS[i], idCounter++))
    }
  }
  
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 4; j++) {
      tiles.push(createTile('tiao', i + 1, TIAO_CHARS[i], idCounter++))
    }
  }
  
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      tiles.push(createTile('feng', i + 1, FENG_CHARS[i], idCounter++))
    }
  }
  
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 4; j++) {
      tiles.push(createTile('jian', i + 1, JIAN_CHARS[i], idCounter++))
    }
  }
  
  for (let i = 0; i < 4; i++) {
    tiles.push(createTile('hua', i + 1, HUA_CHARS[i], idCounter++))
  }
  
  for (let i = 0; i < 4; i++) {
    tiles.push(createTile('ji', i + 1, JI_CHARS[i], idCounter++))
  }
  
  return tiles
}

export function shuffleTiles(tiles: Tile[]): Tile[] {
  const shuffled = [...tiles]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export function sortTiles(tiles: Tile[]): Tile[] {
  const suitOrder: TileSuit[] = ['wan', 'tong', 'tiao', 'feng', 'jian', 'hua', 'ji']
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

export function getTileColor(suit: TileSuit): string {
  switch (suit) {
    case 'wan':
      return '#c41e3a'
    case 'tong':
      return '#1e90ff'
    case 'tiao':
      return '#228b22'
    case 'feng':
      return '#4b0082'
    case 'jian':
      if (suit === 'jian') return '#ff4500'
      return '#ff4500'
    case 'hua':
    case 'ji':
      return '#ff69b4'
    default:
      return '#333'
  }
}

export function getTileColorByCharacter(character: string): string {
  if (JIAN_CHARS.includes(character)) {
    if (character === '中') return '#ff0000'
    if (character === '发') return '#006400'
    if (character === '白') return '#333333'
  }
  if (FENG_CHARS.includes(character)) {
    return '#4b0082'
  }
  if (HUA_CHARS.includes(character) || JI_CHARS.includes(character)) {
    return '#ff69b4'
  }
  return '#c41e3a'
}