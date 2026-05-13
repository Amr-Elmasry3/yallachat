"use client";

// *********************** Logic Imports ***********************
// => Ready To Use Hooks
import { useEffect, useRef } from "react";

// **************** My Custom Types & Variables ****************
// => Types & Interfaces
interface UseWaveformReturn {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
}

export function useWaveform(isRecording: boolean): UseWaveformReturn {
  // ******************* Inside Hook  *******************
  // => States & Refs
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  // => Functions
  const drawWave = () => {
    const canvas = canvasRef.current;
    const analyser = analyserRef.current;
    if (!canvas || !analyser) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const barWidth = canvas.width / bufferLength;

    const draw = () => {
      analyser.getByteFrequencyData(dataArray);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < bufferLength; i++) {
        const value = dataArray[i];
        const percent = value / 255;
        let height = percent * 28;
        if (height < 2) height = 2;

        const x = i * barWidth;
        const y = canvas.height / 2 - height / 2;

        ctx.fillStyle = "#ef4444";
        ctx.fillRect(x, y, barWidth - 1, height);
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();
  };

  // => Use Effects
  useEffect(() => {
    if (!isRecording) {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      if (audioContextRef.current?.state === "closed")
        audioContextRef.current?.close();
      return;
    }

    const setupWaveform = async () => {
      if (!canvasRef.current) return;

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        const audioContext = new AudioContext();
        audioContextRef.current = audioContext;

        const source = audioContext.createMediaStreamSource(stream);
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        analyserRef.current = analyser;
        source.connect(analyser);

        if (audioContext.state === "suspended") {
          await audioContext.resume();
        }

        drawWave();
      } catch (err) {
        console.error(err);
      }
    };

    setupWaveform();

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      if (audioContextRef.current?.state === "closed")
        audioContextRef.current?.close();
    };
  }, [isRecording]);

  return {
    canvasRef,
  };
}
