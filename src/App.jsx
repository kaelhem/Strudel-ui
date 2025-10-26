import { useStrudel } from './hooks/useStrudel';
import { Controls } from './components/Controls';
import { PatternInput } from './components/PatternInput';
import { Visualizer } from './components/Visualizer';
import { FeedbackBar } from './components/FeedbackBar';

function App() {
  const {
    isPlaying,
    tempo,
    pattern,
    analyser,
    setTempo,
    setPattern,
    togglePlay,
  } = useStrudel();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Header */}
        <header className="text-center py-8">
          <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink bg-clip-text text-transparent glow-strong mb-2">
            STRUDEL
          </h1>
          <p className="text-gray-500 text-sm tracking-widest">
            LIVE AUDIO PLAYGROUND
          </p>
        </header>

        {/* Controls */}
        <Controls
          isPlaying={isPlaying}
          tempo={tempo}
          onTempoChange={setTempo}
          onTogglePlay={togglePlay}
        />

        {/* Pattern Input */}
        <PatternInput
          pattern={pattern}
          onChange={setPattern}
          isPlaying={isPlaying}
        />

        {/* Visualizer */}
        <Visualizer
          analyser={analyser}
          isPlaying={isPlaying}
        />

        {/* Feedback Bar */}
        <FeedbackBar
          isPlaying={isPlaying}
          tempo={tempo}
          analyser={analyser}
        />

        {/* Footer */}
        <footer className="text-center py-6">
          <p className="text-gray-600 text-xs">
            Powered by{' '}
            <a
              href="https://strudel.cc"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neon-blue hover:text-neon-pink transition-colors"
            >
              Strudel
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
