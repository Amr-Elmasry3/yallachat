"use client";

// *********************** Logic Imports ***********************
// => Ready To Use Hooks
import { useRef } from "react";

// **************** My Custom Types & Variables ****************
// => Types & Interfaces
interface UseCallMediaReturn {
  localStreamRef: React.RefObject<MediaStream | null>;
  remoteAudioRef: React.RefObject<HTMLAudioElement | null>;
  toggleMute: (stream: MediaStream | null) => void;
  toggleSpeaker: (audioRef: React.RefObject<HTMLAudioElement | null>) => void;
}

export function useCallMedia(): UseCallMediaReturn {
  // ******************* Inside The Component  *******************
  // => States & Refs
  const localStreamRef = useRef<MediaStream | null>(null);
  const remoteAudioRef = useRef<HTMLAudioElement | null>(null);

  // => Functions
  // Mute/Unmute Microphone
  const toggleMute = (stream: MediaStream | null) => {
    if (!stream) return;

    stream.getAudioTracks().forEach((t) => {
      t.enabled = !t.enabled;
    });
  };

  // Turn The Speaker On/Off (Change The Volume)
  const toggleSpeaker = (
    audioRef: React.RefObject<HTMLAudioElement | null>,
  ) => {
    if (!audioRef.current) return;
    audioRef.current.volume = audioRef.current.volume === 1 ? 0.3 : 1;
  };

  return {
    localStreamRef,
    remoteAudioRef,
    toggleMute,
    toggleSpeaker,
  };
}
