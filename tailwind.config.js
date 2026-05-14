/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'table-green': '#1a472a',
        'table-felt': '#2d5a3d',
        'tile-bg': '#f5f5dc',
        'tile-border': '#8b7355',
        'tile-shadow': '#5a4a3a',
      },
      boxShadow: {
        'tile': '2px 2px 4px rgba(0, 0, 0, 0.3)',
        'tile-hover': '4px 4px 8px rgba(0, 0, 0, 0.4)',
        'tile-selected': '0 0 0 3px rgba(255, 215, 0, 0.6)',
      },
      animation: {
        'draw': 'drawTile 0.5s ease-out',
        'discard': 'discardTile 0.3s ease-in',
        'lift': 'liftTile 0.2s ease-out',
      },
      keyframes: {
        drawTile: {
          '0%': { transform: 'translateY(-100px) scale(0.5)', opacity: '0' },
          '100%': { transform: 'translateY(0) scale(1)', opacity: '1' },
        },
        discardTile: {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '100%': { transform: 'scale(0.8) translateY(20px)', opacity: '0.8' },
        },
        liftTile: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(-8px)' },
        },
      },
    },
  },
  plugins: [],
}