import { useState, useEffect, useRef, useCallback } from 'react';

let audioCtx = null;
let analyserNode = null;

export const useStrudel = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [tempo, setTempo] = useState(120);
  const [pattern, setPattern] = useState('bd hh sn hh');
  const [audioContext, setAudioContext] = useState(null);
  const [analyser, setAnalyser] = useState(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(null);
  const schedulerRef = useRef(null);
  const replRef = useRef(null);

  // Initialize audio context only (no Strudel yet)
  useEffect(() => {
    const initAudio = () => {
      try {
        if (!audioCtx) {
          audioCtx = new (window.AudioContext || window.webkitAudioContext)();
          analyserNode = audioCtx.createAnalyser();
          analyserNode.fftSize = 2048;
          analyserNode.connect(audioCtx.destination);
          console.log('Audio context created');
        }

        setAudioContext(audioCtx);
        setAnalyser(analyserNode);
        setReady(true);
      } catch (err) {
        console.error('Audio init error:', err);
        setError(`Audio initialization failed: ${err.message}`);
      }
    };

    initAudio();
  }, []);

  // Play pattern
  const play = useCallback(async () => {
    if (!ready || !audioContext) {
      console.warn('Audio not ready');
      return;
    }

    try {
      setError(null);
      console.log('Starting play...');

      // Resume audio context
      if (audioContext.state === 'suspended') {
        await audioContext.resume();
        console.log('Audio context resumed');
      }

      // Stop previous scheduler
      if (schedulerRef.current) {
        try {
          schedulerRef.current.stop();
        } catch (e) {
          console.warn('Stop error:', e);
        }
        schedulerRef.current = null;
      }

      // Import Strudel modules
      console.log('Loading Strudel modules...');
      const [coreModule, webaudioModule, miniModule] = await Promise.all([
        import('@strudel/core'),
        import('@strudel/webaudio'),
        import('@strudel/mini')
      ]);

      const { repl, evalScope } = coreModule;
      const { webaudioOutput, initAudioOnFirstClick, getAudioContext } = webaudioModule;
      const { mini } = miniModule;

      console.log('Modules loaded');

      // Initialize Strudel audio
      await initAudioOnFirstClick();
      console.log('Strudel audio initialized');

      // Create repl if needed
      if (!replRef.current) {
        console.log('Creating repl...');

        // Load mini notation into global scope
        await evalScope(miniModule);

        replRef.current = repl({
          defaultOutput: webaudioOutput,
          getTime: () => getAudioContext().currentTime,
        });

        console.log('Repl created');
      }

      // Create pattern
      const patternCode = pattern || 'bd hh sn hh';
      console.log('Creating pattern:', patternCode);

      const pat = mini(patternCode);
      const patWithTempo = pat.cpm(tempo);

      // Start playback
      console.log('Setting pattern...');
      const { scheduler } = replRef.current;
      await scheduler.setPattern(patWithTempo, true);

      schedulerRef.current = scheduler;
      setIsPlaying(true);
      console.log('Playing!');

    } catch (err) {
      console.error('Play error:', err);
      setError(`Playback error: ${err.message}`);
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
      setError(`Stop error: ${err.message}`);
      setIsPlaying(false);
    }
  }, []);

  // Update tempo
  useEffect(() => {
    if (isPlaying && replRef.current?.scheduler?.setCpm) {
      try {
        replRef.current.scheduler.setCpm(tempo);
        console.log('Tempo updated:', tempo);
      } catch (err) {
        console.error('Tempo update error:', err);
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
