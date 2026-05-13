"use client";

// *********************** Logic Imports ***********************
// => Ready To Use Hooks
import { useRef } from "react";

// **************** My Custom Types & Variables ****************
// => Types & Interfaces
interface UseCallRingingReturn {
  startRingtone: () => void;
  stopRingtone: () => void;
}

export function useCallRinging(): UseCallRingingReturn {
  // ******************* Inside The Component  *******************
  // => States & Refs
  const ringToneRef = useRef<HTMLAudioElement | null>(null);

  // => Functions
  const startRingtone = () => {
    if (!ringToneRef.current) {
      ringToneRef.current = new Audio("/ringtone.mp3");
      ringToneRef.current.loop = true;
      ringToneRef.current.volume = 0.5;
    }
    ringToneRef.current.play().catch(() => {});
  };

  const stopRingtone = () => {
    if (ringToneRef.current) {
      ringToneRef.current.pause();
      ringToneRef.current.currentTime = 0;
    }
  };

  return {
    startRingtone,
    stopRingtone,
  };
}
