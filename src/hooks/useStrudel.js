import { useState, useEffect, useRef, useCallback } from 'react';

let strudelInitialized = false;
let audioCtx = null;
let analyserNode = null;
let replInstance = null;

export const useStrudel = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [tempo, setTempo] = useState(120);
  const [pattern, setPattern] = useState('bd hh sn hh');
  const [audioContext, setAudioContext] = useState(null);
  const [analyser, setAnalyser] = useState(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(null);
  const schedulerRef = useRef(null);

  // Initialize Strudel and audio
  useEffect(() => {
    const init = async () => {
      if (strudelInitialized) {
        setAudioContext(audioCtx);
        setAnalyser(analyserNode);
        setReady(true);
        return;
      }

      try {
        console.log('Initializing Strudel...');

        // Import modules
        const { repl, evalScope } = await import('@strudel/core');
        const { webaudioOutput, initAudioOnFirstClick, getAudioContext } = await import('@strudel/webaudio');
        const miniModule = await import('@strudel/mini');

        // Initialize audio (requires user interaction)
        await initAudioOnFirstClick();
        const ctx = getAudioContext();
        audioCtx = ctx;

        // Create analyser
        analyserNode = ctx.createAnalyser();
        analyserNode.fftSize = 2048;
        analyserNode.connect(ctx.destination);

        // Load eval scope with mini notation
        await evalScope(miniModule);

        // Create repl instance
        replInstance = repl({
          defaultOutput: webaudioOutput,
          getTime: () => ctx.currentTime,
        });

        setAudioContext(ctx);
        setAnalyser(analyserNode);
        setReady(true);
        strudelInitialized = true;

        console.log('Strudel initialized successfully');
      } catch (err) {
        console.error('Init failed:', err);
        setError(`Initialization failed: ${err.message}`);
      }
    };

    init();
  }, []);

  // Play pattern
  const play = useCallback(async () => {
    if (!ready || !replInstance) {
      console.warn('Not ready');
      return;
    }

    try {
      setError(null);

      // Stop previous pattern
      if (schedulerRef.current) {
        schedulerRef.current.stop();
      }

      // Resume audio context
      if (audioContext.state === 'suspended') {
        await audioContext.resume();
      }

      const patternCode = pattern || 'bd hh sn hh';
      console.log('Playing:', patternCode);

      // Import mini to create pattern
      const { mini } = await import('@strudel/mini');

      // Create pattern from mini notation
      const pat = mini(patternCode);

      // Apply tempo (cpm = cycles per minute)
      const patWithTempo = pat.cpm(tempo);

      // Set pattern and start scheduler
      const { scheduler } = replInstance;
      await scheduler.setPattern(patWithTempo, true); // autostart = true

      schedulerRef.current = scheduler;
      setIsPlaying(true);
      console.log('Playing!');

    } catch (err) {
      console.error('Play error:', err);
      setError(`Play error: ${err.message}`);
      setIsPlaying(false);
    }
  }, [pattern, tempo, audioContext, ready]);

  // Stop playback
  const stop = useCallback(() => {
    try {
      if (schedulerRef.current) {
        schedulerRef.current.stop();
        setIsPlaying(false);
        console.log('Stopped');
      }
    } catch (err) {
      console.error('Stop error:', err);
      setIsPlaying(false);
    }
  }, []);

  // Update tempo
  useEffect(() => {
    if (isPlaying && replInstance) {
      const { scheduler } = replInstance;
      if (scheduler && scheduler.setCpm) {
        scheduler.setCpm(tempo);
      }
    }
  }, [tempo, isPlaying]);

  // Toggle play/stop
  const togglePlay = useCallback(() => {
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
