import { useState, useEffect } from 'react';

export const Controls = ({ isPlaying, tempo, onTempoChange, onTogglePlay }) => {
  const [localTempo, setLocalTempo] = useState(tempo);

  useEffect(() => {
    setLocalTempo(tempo);
  }, [tempo]);

  const handleTempoChange = (e) => {
    const newTempo = parseInt(e.target.value);
    setLocalTempo(newTempo);
    onTempoChange(newTempo);
  };

  // Calculate progress percentage
  const progressPercent = ((localTempo - 60) / 140) * 100;

  return (
    <div className="flex items-center justify-between gap-6 p-6 bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-800">
      {/* Tempo Slider */}
      <div className="flex items-center gap-4 flex-1">
        <label className="text-sm font-medium text-gray-400 min-w-[60px]">
          TEMPO
        </label>
        <div className="flex-1 relative">
          <div className="absolute inset-0 bg-gray-800 rounded-lg pointer-events-none">
            <div
              className="h-full bg-neon-blue rounded-lg transition-all duration-150"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <input
            type="range"
            min="60"
            max="200"
            value={localTempo}
            onChange={handleTempoChange}
            className="relative w-full h-2 bg-transparent rounded-lg appearance-none cursor-pointer slider z-10"
          />
        </div>
        <span className="text-lg font-mono font-bold text-neon-blue min-w-[60px] text-right glow">
          {localTempo}
        </span>
      </div>

      {/* Play/Stop Button */}
      <button
        onClick={onTogglePlay}
        className={`
          px-8 py-4 rounded-xl font-bold text-lg
          transition-all duration-200 transform hover:scale-105 active:scale-95
          ${isPlaying
            ? 'bg-neon-pink text-white glow-strong hover:bg-neon-pink/90'
            : 'bg-neon-blue text-gray-900 glow hover:bg-neon-blue/90'
          }
        `}
      >
        {isPlaying ? '⏹ STOP' : '▶ PLAY'}
      </button>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          background: #00d9ff;
          cursor: pointer;
          border-radius: 50%;
          box-shadow: 0 0 16px #00d9ff;
        }

        .slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          background: #00d9ff;
          cursor: pointer;
          border-radius: 50%;
          box-shadow: 0 0 16px #00d9ff;
          border: none;
        }
      `}</style>
    </div>
  );
};
