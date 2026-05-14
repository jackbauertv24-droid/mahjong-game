# 麻将 Mahjong Game

[![Deploy](https://github.com/jackbauertv24-droid/mahjong-game/actions/workflows/deploy.yml/badge.svg)](https://github.com/jackbauertv24-droid/mahjong-game/actions/workflows/deploy.yml)

A Chinese Classical Mahjong demo game built with React, TypeScript, and Tailwind CSS.

## Live Demo

Play the game at: **https://jackbauertv24-droid.github.io/mahjong-game/**

## Features

- **Traditional Chinese Tiles** - All 144 tiles with proper Chinese characters (万筒条风箭花季)
- **Mahjong Soul-inspired UI** - 3D tile effects with hover and selection animations
- **Classic Green Felt Table** - Traditional mahjong table aesthetic
- **4-Player Layout** - Full table arrangement with all player positions
- **Draw/Discard Flow** - Interactive gameplay with turn-based progression
- **Responsive Design** - Works on desktop and mobile devices

## Game Rules (Phase 1 Demo)

This is a UI demo focused on showcasing the visual elements:

- You play as **East** (the dealer)
- Click **Draw** to pick a tile from the wall
- Click any tile in your hand to discard it
- Other players (South, West, North) auto-discard random tiles
- Game continues until the wall is empty

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Zustand** - State management
- **GitHub Pages** - Deployment

## Development

This project is built and tested entirely on GitHub Actions CI/CD. No local development environment is needed.

### Build Commands

```bash
npm install
npm run build
npm run preview
```

## Roadmap

- **Phase 1**: UI and game flow ✅
- **Phase 2**: Peng/Chi/Gang actions
- **Phase 3**: Win detection and scoring
- **Phase 4**: AI opponents with strategy
- **Phase 5**: Online multiplayer

## Tile Set

| Category | Tiles | Count |
|----------|-------|-------|
| Wan (万) | 一-九万 | 36 |
| Tong (筒) | 一-九筒 | 36 |
| Tiao (条) | 一-九条 | 36 |
| Feng (风) | 东南西北 | 16 |
| Jian (箭) | 中发白 | 12 |
| Hua (花) | 春夏秋冬 | 4 |
| Ji (季) | 梅兰菊竹 | 4 |

## License

MIT

---

Built with ❤️ using React and Tailwind CSS