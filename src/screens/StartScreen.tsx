interface StartScreenProps {
  onSelect: (version: '2d' | '3d') => void
}

export function StartScreen({ onSelect }: StartScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a472a] to-[#0a2a1a] flex flex-col items-center justify-center p-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 tracking-wide">
          麻将游戏
        </h1>
        <p className="text-lg text-green-200/80 mb-2">Mahjong Game</p>
        <p className="text-sm text-green-300/60">选择游戏版本</p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-6 items-center justify-center">
        <button
          onClick={() => onSelect('2d')}
          className="
            px-12 py-8 rounded-2xl font-bold text-xl
            bg-gradient-to-b from-green-400 to-green-600
            text-white shadow-2xl
            hover:from-green-300 hover:to-green-500
            hover:scale-105 hover:shadow-green-500/30
            transition-all duration-300 ease-out
            border-2 border-green-300/50
            min-w-[200px]
          "
        >
          <div className="flex flex-col items-center gap-2">
            <span className="text-3xl">2D</span>
            <span className="text-sm font-normal opacity-80">经典平面版</span>
          </div>
        </button>
        
        <button
          onClick={() => onSelect('3d')}
          className="
            px-12 py-8 rounded-2xl font-bold text-xl
            bg-gradient-to-b from-blue-400 to-blue-600
            text-white shadow-2xl
            hover:from-blue-300 hover:to-blue-500
            hover:scale-105 hover:shadow-blue-500/30
            transition-all duration-300 ease-out
            border-2 border-blue-300/50
            min-w-[200px]
          "
        >
          <div className="flex flex-col items-center gap-2">
            <span className="text-3xl">3D</span>
            <span className="text-sm font-normal opacity-80">立体版 (Beta)</span>
          </div>
        </button>
      </div>
      
      <div className="mt-12 text-center">
        <p className="text-xs text-green-400/50">
          v1.1 · Powered by React + Three.js
        </p>
      </div>
    </div>
  )
}