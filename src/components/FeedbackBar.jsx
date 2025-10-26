import { useEffect, useState } from 'react';

export const FeedbackBar = ({ isPlaying, tempo, analyser }) => {
  const [level, setLevel] = useState(0);
  const [beat, setBeat] = useState(0);

  useEffect(() => {
    if (!analyser || !isPlaying) {
      setLevel(0);
      return;
    }

    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    const updateLevel = () => {
      analyser.getByteFrequencyData(dataArray);

      // Calculate average volume
      const sum = dataArray.reduce((acc, val) => acc + val, 0);
      const avg = sum / dataArray.length;
      setLevel(avg / 255);

      requestAnimationFrame(updateLevel);
    };

    updateLevel();
  }, [analyser, isPlaying]);

  // Beat counter animation
  useEffect(() => {
    if (!isPlaying) {
      setBeat(0);
      return;
    }

    const beatInterval = (60 / tempo) * 1000; // ms per beat
    let beatCount = 0;

    const interval = setInterval(() => {
      beatCount = (beatCount + 1) % 4;
      setBeat(beatCount);
    }, beatInterval);

    return () => clearInterval(interval);
  }, [isPlaying, tempo]);

  return (
    <div className="p-6 bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-800">
      <div className="flex items-center justify-between gap-8">

        {/* Level meter */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xs font-bold text-gray-500 tracking-wider">
              LEVEL
            </span>
          </div>
          <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink transition-all duration-100 glow"
              style={{ width: `${level * 100}%` }}
            />
          </div>
        </div>

        {/* Beat indicators */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-gray-500 tracking-wider mr-2">
            BEAT
          </span>
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`
                w-3 h-3 rounded-full transition-all duration-100
                ${beat === i && isPlaying
                  ? 'bg-neon-pink glow-strong scale-125'
                  : 'bg-gray-700'
                }
              `}
            />
          ))}
        </div>

        {/* Status */}
        <div className="flex items-center gap-3">
          {isPlaying ? (
            <>
              <div className="w-2 h-2 bg-neon-pink rounded-full animate-pulse glow" />
              <span className="text-sm font-bold text-neon-pink glow">
                LIVE
              </span>
            </>
          ) : (
            <>
              <div className="w-2 h-2 bg-gray-600 rounded-full" />
              <span className="text-sm font-bold text-gray-600">
                IDLE
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
