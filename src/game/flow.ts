import { Tile, PlayerPosition, PlayerHand, generateAllTiles, shuffleTiles, sortTiles } from './tiles'

export interface GameState {
  wall: Tile[]
  hands: Record<PlayerPosition, PlayerHand>
  currentTurn: PlayerPosition
  drawnTile: Tile | null
  gameOver: boolean
  winner: PlayerPosition | null
  
  initGame: () => void
  drawTile: (player: PlayerPosition) => void
  discardTile: (player: PlayerPosition, tileId: string) => void
  nextTurn: () => void
  autoOpponentTurn: () => void
  resetGame: () => void
}

import { create } from 'zustand'

const createEmptyHand = (): PlayerHand => ({
  tiles: [],
  melds: [],
  discards: [],
})

export const useGameStore = create<GameState>((set, get) => ({
  wall: [],
  hands: {
    east: createEmptyHand(),
    south: createEmptyHand(),
    west: createEmptyHand(),
    north: createEmptyHand(),
  },
  currentTurn: 'east',
  drawnTile: null,
  gameOver: false,
  winner: null,
  
  initGame: () => {
    const allTiles = generateAllTiles()
    const shuffled = shuffleTiles(allTiles)
    
    const gameTiles = shuffled.filter(t => t.suit !== 'hua' && t.suit !== 'ji')
    const wallTiles = gameTiles.slice(52)
    
    const hands: Record<PlayerPosition, PlayerHand> = {
      east: { tiles: sortTiles(gameTiles.slice(0, 13)), melds: [], discards: [] },
      south: { tiles: sortTiles(gameTiles.slice(13, 26)), melds: [], discards: [] },
      west: { tiles: sortTiles(gameTiles.slice(26, 39)), melds: [], discards: [] },
      north: { tiles: sortTiles(gameTiles.slice(39, 52)), melds: [], discards: [] },
    }
    
    set({
      wall: wallTiles,
      hands,
      currentTurn: 'east',
      drawnTile: null,
      gameOver: false,
      winner: null,
    })
  },
  
  drawTile: (player: PlayerPosition) => {
    const state = get()
    if (state.wall.length === 0) {
      set({ gameOver: true })
      return
    }
    
    const tile = state.wall[0]
    const newWall = state.wall.slice(1)
    
    if (player === 'east') {
      set({
        wall: newWall,
        drawnTile: tile,
        hands: {
          ...state.hands,
          east: {
            ...state.hands.east,
            tiles: sortTiles([...state.hands.east.tiles, tile]),
          },
        },
      })
    } else {
      set({
        wall: newWall,
        hands: {
          ...state.hands,
          [player]: {
            ...state.hands[player],
            tiles: sortTiles([...state.hands[player].tiles, tile]),
          },
        },
      })
    }
  },
  
  discardTile: (player: PlayerPosition, tileId: string) => {
    const state = get()
    const playerHand = state.hands[player]
    const tileToDiscard = playerHand.tiles.find(t => t.id === tileId) || state.drawnTile
    
    if (!tileToDiscard) return
    
    const newTiles = playerHand.tiles.filter(t => t.id !== tileId)
    
    set({
      drawnTile: player === 'east' ? null : state.drawnTile,
      hands: {
        ...state.hands,
        [player]: {
          ...playerHand,
          tiles: sortTiles(newTiles),
          discards: [...playerHand.discards, tileToDiscard],
        },
      },
    })
    
    get().nextTurn()
  },
  
  nextTurn: () => {
    const state = get()
    const turnOrder: PlayerPosition[] = ['east', 'south', 'west', 'north']
    const currentIndex = turnOrder.indexOf(state.currentTurn)
    const nextIndex = (currentIndex + 1) % 4
    const nextPlayer = turnOrder[nextIndex]
    
    set({ currentTurn: nextPlayer })
    
    if (nextPlayer !== 'east') {
      setTimeout(() => {
        get().autoOpponentTurn()
      }, 800)
    }
  },
  
  autoOpponentTurn: () => {
    const state = get()
    const player = state.currentTurn
    
    if (player === 'east') return
    
    get().drawTile(player)
    
    setTimeout(() => {
      const newState = get()
      const playerHand = newState.hands[player]
      if (playerHand.tiles.length > 0) {
        const randomTile = playerHand.tiles[Math.floor(Math.random() * playerHand.tiles.length)]
        get().discardTile(player, randomTile.id)
      }
    }, 500)
  },
  
  resetGame: () => {
    get().initGame()
  },
}))