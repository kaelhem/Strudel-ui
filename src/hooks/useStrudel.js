import { useState, useEffect, useRef, useCallback } from 'react';

export const useStrudel = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [tempo, setTempo] = useState(120);
  const [pattern, setPattern] = useState('bd hh sn hh');
  const [audioContext, setAudioContext] = useState(null);
  const [analyser, setAnalyser] = useState(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(null);
  const patternRef = useRef(null);

  // Initialize - just set ready
  useEffect(() => {
    console.log('[useStrudel] Initializing...');
    setReady(true);
  }, []);

  // Play pattern
  const play = useCallback(async () => {
    console.log('[useStrudel] Play clicked, ready:', ready);

    if (!ready) {
      console.warn('[useStrudel] Not ready yet');
      return;
    }

    try {
      setError(null);
      console.log('[useStrudel] Starting play sequence...');

      // Stop previous pattern
      if (patternRef.current) {
        console.log('[useStrudel] Stopping previous pattern');
        try {
          patternRef.current.stop();
        } catch (e) {
          console.warn('[useStrudel] Error stopping:', e);
        }
        patternRef.current = null;
      }

      // Import Strudel modules
      console.log('[useStrudel] Importing Strudel modules...');
      const [webaudioModule, miniModule] = await Promise.all([
        import('@strudel/webaudio'),
        import('@strudel/mini')
      ]);

      console.log('[useStrudel] Modules imported successfully');

      const { initAudioOnFirstClick, getAudioContext } = webaudioModule;
      const { mini } = miniModule;

      // Initialize audio
      console.log('[useStrudel] Initializing audio...');
      await initAudioOnFirstClick();
      const ctx = getAudioContext();
      console.log('[useStrudel] Audio context state:', ctx.state);

      // Create analyser if not exists
      if (!analyser) {
        const analyserNode = ctx.createAnalyser();
        analyserNode.fftSize = 2048;
        analyserNode.connect(ctx.destination);
        setAnalyser(analyserNode);
        setAudioContext(ctx);
        console.log('[useStrudel] Analyser created');
      }

      // Create pattern
      const patternCode = pattern || 'bd hh sn hh';
      console.log('[useStrudel] Creating pattern:', patternCode);

      const pat = mini(patternCode)
        .cpm(tempo)
        .out();

      console.log('[useStrudel] Pattern created, type:', typeof pat);

      patternRef.current = pat;
      setIsPlaying(true);
      console.log('[useStrudel] Playing!');

    } catch (err) {
      console.error('[useStrudel] Play error:', err);
      setError(`Playback error: ${err.message}`);
      setIsPlaying(false);
    }
  }, [pattern, tempo, ready, analyser]);

  // Stop playback
  const stop = useCallback(() => {
    console.log('[useStrudel] Stop clicked');
    try {
      if (patternRef.current) {
        patternRef.current.stop();
        patternRef.current = null;
        console.log('[useStrudel] Stopped');
      }
      setIsPlaying(false);
    } catch (err) {
      console.error('[useStrudel] Stop error:', err);
      setError(`Stop error: ${err.message}`);
      setIsPlaying(false);
    }
  }, []);

  // Update tempo when playing
  useEffect(() => {
    if (isPlaying && patternRef.current) {
      console.log('[useStrudel] Updating tempo to:', tempo);
      // Restart with new tempo
      play();
    }
  }, [tempo]);

  // Toggle play/stop
  const togglePlay = useCallback(() => {
    console.log('[useStrudel] Toggle play, current state:', isPlaying);
    if (isPlaying) {
      stop();
    } else {
      play();
    }
  }, [isPlaying, play, stop]);

  return {
    isPlaying,
    tempo,
    pattern,
    audioContext,
    analyser,
    ready,
    error,
    setTempo,
    setPattern,
    play,
    stop,
    togglePlay,
  };
};
