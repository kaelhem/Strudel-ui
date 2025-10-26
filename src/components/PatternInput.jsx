import { useEffect, useRef } from 'react';

export const PatternInput = ({ pattern, onChange, isPlaying }) => {
  const textareaRef = useRef(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [pattern]);

  return (
    <div className="relative">
      <div className={`
        absolute -inset-0.5 bg-gradient-to-r from-neon-blue to-neon-purple rounded-2xl blur opacity-20
        ${isPlaying ? 'animate-pulse' : ''}
      `}></div>

      <div className="relative bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
        <div className="px-6 py-4 bg-gray-800/50 border-b border-gray-700">
          <h3 className="text-sm font-bold text-gray-400 tracking-wider">
            PATTERN
          </h3>
        </div>

        <textarea
          ref={textareaRef}
          value={pattern}
          onChange={(e) => onChange(e.target.value)}
          placeholder="bd hh sn hh&#10;bd [sn hh] bd bd&#10;..."
          className="
            w-full p-6 bg-transparent text-2xl font-mono
            text-white placeholder-gray-600
            focus:outline-none focus:ring-2 focus:ring-neon-blue/50
            resize-none overflow-hidden
            min-h-[120px]
          "
          spellCheck="false"
        />

        {/* Live indicator */}
        {isPlaying && (
          <div className="absolute top-6 right-6 flex items-center gap-2">
            <div className="w-2 h-2 bg-neon-pink rounded-full animate-pulse glow"></div>
            <span className="text-xs font-bold text-neon-pink glow">LIVE</span>
          </div>
        )}
      </div>
    </div>
  );
};
