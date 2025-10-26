import { useState, useEffect, useRef, useCallback } from 'react';

let strudelInitialized = false;
let audioCtx = null;
let analyserNode = null;
let miniApi = null;

export const useStrudel = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [tempo, setTempo] = useState(120);
  const [pattern, setPattern] = useState('bd hh sn hh');
  const [audioContext, setAudioContext] = useState(null);
  const [analyser, setAnalyser] = useState(null);
  const [ready, setReady] = useState(false);
  const schedulerRef = useRef(null);

  // Initialize Strudel
  useEffect(() => {
    const initStrudel = async () => {
      if (strudelInitialized) {
        setAudioContext(audioCtx);
        setAnalyser(analyserNode);
        setReady(true);
        return;
      }

      try {
        // Import mini API
        const mini = await import('@strudel/mini');
        miniApi = mini;

        // Initialize audio - this will wait for user interaction
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        audioCtx = ctx;

        // Create analyser
        analyserNode = ctx.createAnalyser();
        analyserNode.fftSize = 2048;
        analyserNode.connect(ctx.destination);

        setAudioContext(ctx);
        setAnalyser(analyserNode);
        setReady(true);
        strudelInitialized = true;

        console.log('Strudel initialized');
      } catch (error) {
        console.error('Failed to initialize Strudel:', error);
      }
    };

    initStrudel();
  }, []);

  // Play pattern
  const play = useCallback(async () => {
    if (!audioContext || !ready) {
      console.warn('Strudel not ready yet');
      return;
    }

    try {
      // Stop previous scheduler
      if (schedulerRef.current) {
        try {
          await schedulerRef.current.stop();
        } catch (e) {
          console.warn('Error stopping previous scheduler:', e);
        }
      }

      // Resume audio context if suspended
      if (audioContext.state === 'suspended') {
        await audioContext.resume();
      }

      // Import required functions
      const { mini, evalScope } = await import('@strudel/mini');
      const { getAudioContext, initAudioOnFirstClick, webaudioOutput } = await import('@strudel/webaudio');

      // Make sure audio is initialized
      await initAudioOnFirstClick();

      // Evaluate the pattern
      const patternCode = pattern || 'bd hh sn hh';
      console.log('Evaluating pattern:', patternCode);

      // Use mini to evaluate
      const evaluated = await evalScope(
        mini(patternCode),
        {}
      );

      // Set tempo and output
      const withSettings = evaluated
        .cpm(tempo)
        .out();

      // Start the scheduler
      schedulerRef.current = withSettings;

      setIsPlaying(true);
      console.log('Pattern playing');
    } catch (error) {
      console.error('Error playing pattern:', error);
      setIsPlaying(false);
    }
  }, [pattern, tempo, audioContext, ready]);

  // Stop playback
  const stop = useCallback(async () => {
    if (schedulerRef.current) {
      try {
        await schedulerRef.current.stop();
        console.log('Stopped');
      } catch (error) {
        console.error('Error stopping:', error);
      }
    }
    setIsPlaying(false);
  }, []);

  // Update tempo when playing
  useEffect(() => {
    if (isPlaying && schedulerRef.current) {
      // Restart with new tempo
      play();
    }
  }, [tempo]);

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
    setTempo,
    setPattern,
    play,
    stop,
    togglePlay,
  };
};
