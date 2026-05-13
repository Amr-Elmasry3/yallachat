"use client";

// *********************** Logic Imports ***********************
// => Ready To Use Hooks
import { useEffect, useRef, useState } from "react";

// => Libs & Utils
import WaveSurfer from "wavesurfer.js";

// **************** My Custom Types & Variables ****************
// => Types & Interfaces
interface UseWaveSurferProps {
  src: string;
}
interface UseWaveSurferReturn {
  waveRef: React.RefObject<HTMLDivElement | null>;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  togglePlay: () => void;
}

export function useWaveSurfer({
  src,
}: UseWaveSurferProps): UseWaveSurferReturn {
  // ******************* Inside Hook  *******************
  // => States & Refs
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const waveRef = useRef<HTMLDivElement | null>(null);
  const waveSurferRef = useRef<WaveSurfer | null>(null);

  // => Use Effects
  useEffect(() => {
    if (!waveRef.current) return;

    const waveSurfer = WaveSurfer.create({
      container: waveRef.current,
      waveColor: "#9ca3af",
      progressColor: "#059d75",
      height: 26,
      barWidth: 3,
      barGap: 2,
      cursorWidth: 0,
      normalize: true,
    });

    const loadResult = waveSurfer.load(src);

    if (
      loadResult &&
      typeof (loadResult as Promise<unknown>).catch === "function"
    ) {
      (loadResult as Promise<unknown>).catch((error) => {
        if (error?.name !== "AbortError") {
          console.error(error);
        }
      });
    }

    const updateTime = () => {
      setCurrentTime(waveSurfer.getCurrentTime());
    };

    waveSurfer.on("ready", () => {
      setDuration(waveSurfer.getDuration());
      setCurrentTime(0);
    });

    waveSurfer.on("audioprocess", updateTime);
    waveSurfer.on("seeking", updateTime);

    waveSurfer.on("play", () => setIsPlaying(true));
    waveSurfer.on("pause", () => setIsPlaying(false));
    waveSurfer.on("finish", () => {
      setIsPlaying(false);
    });

    waveSurferRef.current = waveSurfer;

    return () => {
      waveSurferRef.current = null;
      waveSurfer.destroy();
    };
  }, [src]);

  // => Functions
  const togglePlay = () => {
    if (!waveSurferRef.current) return;
    waveSurferRef.current.playPause();
  };

  return {
    waveRef,
    isPlaying,
    currentTime,
    duration,
    togglePlay,
  };
}
