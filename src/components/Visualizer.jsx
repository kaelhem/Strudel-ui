import { useEffect, useRef } from 'react';

export const Visualizer = ({ analyser, isPlaying }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    if (!analyser || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const timeDataArray = new Uint8Array(bufferLength);

    // Set canvas size
    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      canvas.width = parent.clientWidth * window.devicePixelRatio;
      canvas.height = parent.clientHeight * window.devicePixelRatio;
      canvas.style.width = parent.clientWidth + 'px';
      canvas.style.height = parent.clientHeight + 'px';
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const draw = () => {
      const width = canvas.width / window.devicePixelRatio;
      const height = canvas.height / window.devicePixelRatio;

      // Get frequency data for spectrum
      analyser.getByteFrequencyData(dataArray);

      // Get time domain data for waveform
      analyser.getByteTimeDomainData(timeDataArray);

      // Clear canvas with fade effect
      ctx.fillStyle = 'rgba(3, 7, 18, 0.3)';
      ctx.fillRect(0, 0, width, height);

      // Draw waveform (oscilloscope)
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#00d9ff';
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#00d9ff';
      ctx.beginPath();

      const sliceWidth = width / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = timeDataArray[i] / 128.0;
        const y = (v * height) / 2;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      ctx.stroke();

      // Draw frequency bars (spectrum)
      const barCount = 64;
      const barWidth = width / barCount;

      ctx.shadowBlur = 15;

      for (let i = 0; i < barCount; i++) {
        const barHeight = (dataArray[i] / 255) * (height / 2);

        // Gradient from blue to pink
        const gradient = ctx.createLinearGradient(0, height, 0, height - barHeight);
        gradient.addColorStop(0, '#00d9ff');
        gradient.addColorStop(0.5, '#8338ec');
        gradient.addColorStop(1, '#ff006e');

        ctx.fillStyle = gradient;
        ctx.shadowColor = i % 2 === 0 ? '#00d9ff' : '#ff006e';

        const x = i * barWidth;
        const y = height - barHeight;

        ctx.fillRect(x, y, barWidth - 2, barHeight);
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    if (isPlaying) {
      draw();
    } else {
      // Draw idle state
      ctx.fillStyle = 'rgba(3, 7, 18, 1)';
      ctx.fillRect(0, 0, width, height);

      // Draw center line
      ctx.strokeStyle = '#1f2937';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.stroke();
    }

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [analyser, isPlaying]);

  return (
    <div className="relative h-64 bg-gray-950 rounded-2xl border border-gray-800 overflow-hidden">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
      />

      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-gray-600 text-sm font-medium">
            Press PLAY to visualize audio
          </p>
        </div>
      )}
    </div>
  );
};
