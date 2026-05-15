# Mahjong Game Project - Build Summary

## Project Overview

Built and deployed a Chinese Classical Mahjong demo game as a standalone React application with GitHub Pages hosting. Now features **dual version** (2D + 3D).

**Live URL:** https://jackbauertv24-droid.github.io/mahjong-game/

---

## Version History

| Version | Description | Date |
|---------|-------------|------|
| v1.0 | Initial emoji-based tiles | May 2026 |
| v1.1 | SVG tiles from FluffyStuff library | May 2026 |
| v1.2 | **3D version added** (Three.js/R3F) | May 15, 2026 |

---

## Planning Phase

### Initial Requirements Analysis

1. **System Analysis**: Identified production services running on the system:
   - WhatsApp Scheduler (ports 3000, 3001) - Active
   - Docker containers - Running
   - MUD Card Game Platform (port 5173) - Stopped per user request

2. **Safety Constraints**: 
   - No local testing (production system)
   - No local npm install/dev
   - All build/test on GitHub Actions CI
   - Only modify files in `/root/opencode-workspace/mahjong`

3. **Game Rules Research**:
   - Verified spelling: "mahjong" (麻将) - Traditional Chinese
   - Researched Chinese Classical Mahjong rules from riichi.wiki
   - Confirmed 144 tile set: 万(Wan/Characters), 筒(Tong/Circles), 条(Tiao/Bamboo), 风(Winds), 箭(Dragons), 花(Flowers), 季(Seasons)

---

## Technical Decisions

### 2D Version

| Decision | Choice | Reason |
|----------|--------|--------|
| Framework | React + Vite + TypeScript | Modern, fast build, type safety |
| Styling | Tailwind CSS | Utility-first, responsive |
| State Management | Zustand | Simple, lightweight |
| Tile Style | SVG from FluffyStuff/riichi-mahjong-tiles | High-quality, open-source (CC0) |
| Visual Style | Mahjong Soul-inspired | Anime-ish, 3D effects via CSS |
| Color Scheme | Classic green felt | Traditional table look |

### 3D Version

| Decision | Choice | Reason |
|----------|--------|--------|
| 3D Framework | Three.js + React Three Fiber | Declarative 3D in React |
| Helper Library | @react-three/drei | RoundedBox, useTexture, OrthographicCamera |
| Tile Geometry | RoundedBoxGeometry | Realistic rounded edges |
| Tile Faces | SVG textures via useTexture | Reuse existing assets |
| Tile Backs | Solid green color | Uniform pattern |
| Camera | Fixed Orthographic (isometric) | No orbit controls per user preference |
| UI | HTML overlay | Same UI components as 2D, positioned over Canvas |
| Version Switch | StartScreen with two buttons | Simple, no localStorage memory |

---

## Emoji Mapping Discovery

⚠️ **Critical Finding**: Unicode standard names for mahjong tiles are WRONG for visual mapping.

User verified on their screen:
- 🀇-🀏 = **WAN (万)** (Unicode says "Bamboo" - incorrect)
- 🀐-🀘 = **TIAO (条)** (Unicode says "Circles" - incorrect)
- 🀙-🀡 = **TONG (筒)** (Unicode says "Characters" - incorrect)

This led to adopting SVG tiles from FluffyStuff library instead of relying on emoji.

---

## Architecture

```
mahjong/
├── .github/workflows/
│   └── deploy.yml              # GitHub Pages deployment
├── public/
│   └── tiles/
│       ├── wan/1.svg - 9.svg   # 万 tiles (from Man1-Man9.svg)
│       ├── tiao/1.svg - 9.svg  # 条 tiles (from Sou1-Sou9.svg)
│       ├── tong/1.svg - 9.svg  # 筒 tiles (from Pin1-Pin9.svg)
│       ├── feng/1.svg - 4.svg  # 风 tiles (东南西北)
│       └── jian/1.svg - 3.svg  # 箭 tiles (中发白)
├── src/
│   ├── components/
│   │   ├── tiles/
│   │   │   ├── Tile.tsx            # 2D tile with SVG <img>
│   │   │   ├── DiscardTile.tsx     # Smaller discard tile
│   │   │   └── index.ts
│   │   ├── table/
│   │   │   ├── GameTable.tsx       # Main 2D table layout
│   │   │   ├── Wall.tsx
│   │   │   ├── DiscardArea.tsx
│   │   │   └── index.ts
│   │   ├── hand/
│   │   │   ├── PlayerHand.tsx      # Interactive player hand
│   │   │   ├── OpponentHand.tsx    # Opponent hands with backs
│   │   │   └and index.ts
│   │   ├── ui/
│   │   │   ├── Header.tsx
│   │   │   ├── TurnIndicator.tsx
│   │   │   ├── ActionBar.tsx
│   │   │   ├── FloatingActionButton.tsx  # Draw button (抽)
│   │   │   └and index.ts
│   │   └── three/                  # 3D components (NEW)
│   │       ├── GameTable3D.tsx     # Main 3D Canvas scene
│   │       ├── Tile3D.tsx          # 3D tile mesh
│   │       ├── TableSurface.tsx    # Green table plane
│   │       ├── Wall.tsx            # 3D wall stacks
│   │       ├── DiscardArea.tsx     # 3D discard pile
│   │       ├── PlayerHand.tsx      # 3D player hand
│   │       ├── OpponentHand.tsx    # 3D opponent hands
│   │       └and index.ts
│   ├── screens/                    # NEW
│   │   ├── StartScreen.tsx         # 2D/3D version selector
│   │   └and index.ts
│   ├── game/
│   │   ├── tiles.ts                # 144 tile definitions, imagePath
│   │   └and flow.ts                # Zustand game state/store
│   ├── styles/
│   │   └and index.css              # Tailwind + animations
│   ├── App.tsx                     # Version state + conditional render
│   └and main.tsx
├── package.json                    # Three.js deps added
├── vite.config.ts                  # base: '/mahjong-game/'
├── EMOJI_MAPPING_ANALYSIS.md       # Emoji research documentation
├── PROJECT_SUMMARY.md              # This file
└and README.md
```

---

## 3D Implementation Details

### Canvas Setup

```tsx
<Canvas
  shadows
  gl={{ antialias: true }}
  camera={{ position: [12, 12, 12], zoom: 40 }}
>
  <Suspense fallback={<LoadingFallback />}>
    <OrthographicCamera makeDefault position={[12, 12, 12]} zoom={40} />
    <ambientLight intensity={0.6} />
    <directionalLight position={[10, 20, 10]} intensity={1} castShadow />
    {/* 3D components */}
  </Suspense>
</Canvas>
```

### Tile 3D Component (Simplified for Debugging)

```tsx
<RoundedBox args={[0.7, 1.0, 0.4]} radius={0.05} smoothness={4}>
  <meshStandardMaterial color={tileColor} />
</RoundedBox>
```

**Current Status**: Using colored boxes (no SVG textures yet) to debug Canvas rendering.

### Player Positions in 3D

| Position | Group Position | Rotation |
|----------|----------------|----------|
| East (you) | `[0, 0, -3]` | `[0, 0, 0]` |
| South | `[-3.5, 0, 0]` | `[0, Math.PI/2, 0]` |
| West | `[0, 0, 3.5]` | `[0, Math.PI, 0]` |
| North | `[3.5, 0, 0]` | `[0, -Math.PI/2, 0]` |

---

## Build Process

### Issues Encountered & Resolved

| Issue | Cause | Resolution |
|-------|-------|------------|
| npm ci failure | No package-lock.json | Changed to `npm install` in workflow |
| TypeScript errors | Import paths wrong, type mismatches | Fixed imports, added explicit types |
| GitHub Pages not enabled | Pages not configured | Enabled via GitHub API with workflow build type |
| Array destructuring error | TypeScript strict mode | Used temp variable swap instead |
| Invalid Tailwind classes | `h-18`, `w-11` don't exist | Use valid: `h-20`, `w-12` |
| 3D TypeScript errors | Unused imports, wrong component name | Fixed DiscardArea3D, removed unused vars |
| 3D blank screen | Canvas height undefined, SVG textures fail | Added explicit height, simplified to colored boxes |

### Workflow Runs (3D Implementation)

| Run ID | Status | Description |
|--------|--------|-------------|
| 25899014173 | ✅ Success | 3D fixes: Canvas height, Suspense, simplified tiles |
| 25896227634 | ✅ Success | TypeScript fixes (DiscardArea3D naming) |
| 25896145728 | ❌ Failed | TypeScript errors in 3D components |
| 3505530 | Pushed | Initial 3D version commit |

---

## Features Implemented

### 2D Version (v1.1 - Stable)

- ✅ Traditional Chinese tile rendering (万筒条风箭)
- ✅ SVG tiles from FluffyStuff/riichi-mahjong-tiles (CC0)
- ✅ Mahjong Soul-inspired 3D tile effects with CSS
- ✅ Classic green felt table background
- ✅ 4-player table layout (East, South, West, North)
- ✅ Interactive player hand (East/You)
- ✅ Opponent hands with back-facing tiles
- ✅ Wall stack visualization
- ✅ Discard area for all players
- ✅ Draw button FAB (抽)
- ✅ Click-to-discard interaction
- ✅ Turn indicator with animation
- ✅ Auto-opponent turns (random discard)
- ✅ Responsive design (desktop + mobile)
- ✅ GitHub Pages deployment with CI/CD

### 3D Version (v1.2 - Beta)

- ✅ StartScreen with 2D/3D version selection
- ✅ Three.js Canvas with orthographic isometric camera
- ✅ RoundedBoxGeometry for 3D tiles
- ✅ Fixed camera (no orbit controls)
- ✅ HTML overlay UI (same as 2D)
- ⚠️ Colored boxes (SVG textures pending)
- ⚠️ Testing/debugging in progress

### Future Phase 2

- Peng/Chi/Gang meld actions
- Win detection (basic pattern matching)
- Scoring system
- SVG texture loading for 3D tiles

---

## Correct Seating (Clockwise E→S→W→N)

From East (you) perspective:

| Player | Direction | Position | Tile Orientation | Discard Layout |
|--------|-----------|----------|------------------|----------------|
| **South** | Downstream (next) | LEFT side | Vertical ↓ | Vertical in front |
| **West** | Opposite | TOP center | Horizontal → | Horizontal below |
| **North** | Upstream (previous) | RIGHT side | Vertical ↓ | Vertical in front |

---

## Game Flow (Demo Mode)

```
User (East):
1. Click "Start Game"
2. Click "Draw" → tile added to hand (14 tiles)
3. Click any tile → discard (13 tiles)
4. Turn passes to South

South/West/North (Auto):
1. Auto-draw from wall
2. Auto-discard random tile
3. Turn passes to next player

Loop continues until wall empty → Game Over
```

---

## Key Learnings

### GitHub Pages & CI/CD

1. **Pages Setup**: Must enable Pages via API or settings before workflow can deploy
2. **Vite Base Path**: Must set `base: '/repo-name/'` for GitHub Pages subdirectory
3. **No Local Testing**: All validation via GitHub Actions CI

### React Three Fiber

1. **Canvas Height**: Must have explicit height (aspect ratio alone doesn't work)
2. **Suspense Placement**: Wrap entire 3D scene, not individual components
3. **SVG Texture Loading**: `useTexture` may fail silently - need error handling
4. **OrthographicCamera**: Must set `makeDefault` for camera to work
5. **Group Positioning**: Use group transforms for positioning multiple tiles

### Tailwind CSS

1. **Invalid Classes**: `h-18`, `h-13`, `w-11`, `w-7` don't exist
2. **Valid Alternatives**: `h-20`, `h-24`, `h-28`, `h-14`, `h-16`, `w-12`, `w-8`

---

## Repository Information

- **GitHub:** https://github.com/jackbauertv24-droid/mahjong-game
- **Branch:** main
- **Visibility:** Public
- **Pages:** Enabled (workflow build type)
- **CI/CD:** GitHub Actions (automatic on push)

---

## Conclusion

Successfully built and deployed a dual-version Chinese Classical Mahjong demo:
- **2D Version**: Stable, using SVG tiles, CSS 3D effects
- **3D Version**: Beta, using Three.js/R3F, currently debugging
- **Version Switch**: Simple StartScreen with two buttons
- **Safe Architecture**: 2D components untouched, 3D isolated in separate directory

**Current Status**: 3D version shows blank - investigating Canvas rendering issues. Simplified to colored boxes for debugging.

**Next steps**: 
1. Debug 3D Canvas rendering
2. Add SVG texture loading for 3D tiles
3. Implement Peng/Chi/Gang actions