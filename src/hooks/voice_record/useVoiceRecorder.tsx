"use client";

// *********************** Logic Imports ***********************
// => Ready To Use Hooks
import { useRef, useState } from "react";

// => My Custom Hooks
import { useCloudinaryUpload } from "@/hooks/useCloudinaryUpload";

// **************** My Custom Types & Variables ****************
// => Types & Interfaces
interface UseVoiceRecorderProps {
  onSend: (url: string, size: number, duration: number | undefined) => void;
}
interface UseVoiceRecorderReturn {
  isRecording: boolean;
  seconds: number;
  startRecording: () => void;
  stopRecording: () => void;
  cancelRecording: () => void;
}

export function useVoiceRecorder({
  onSend,
}: UseVoiceRecorderProps): UseVoiceRecorderReturn {
  // ******************* Inside Hook  *******************
  // => Use Hooks
  const { uploadFile } = useCloudinaryUpload();

  // => States & Refs
  const [isRecording, setIsRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const isCancelledRef = useRef(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);

  // => Functions
  // Start Timer
  const startTimer = () => {
    startTimeRef.current = Date.now();

    timerRef.current = setInterval(() => {
      if (!startTimeRef.current) return;
      const diff = Math.floor((Date.now() - startTimeRef.current) / 1000);
      setSeconds(diff);
    }, 1000);
  };

  // Stop Timer
  const stopTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
  };

  // Cleanup
  const cleanup = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    stopTimer();
    setIsRecording(false);
  };

  // Start Recording
  const startRecording = async () => {
    if (isRecording) return;

    setSeconds(0);
    isCancelledRef.current = false;
    audioChunks.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => audioChunks.current.push(e.data);

      mediaRecorder.onstop = async () => {
        if (isCancelledRef.current) return;

        const blob = new Blob(audioChunks.current, { type: "audio/webm" });
        const result = await uploadFile({ file: blob, fileName: "file" });

        if (result) {
          onSend(result.url, blob.size, result.duration);
        }
      };

      mediaRecorder.start();
      startTimer();
      setIsRecording(true);
    } catch (err) {
      console.error(err);
    }
  };

  // Stop Recording (Success)
  const stopRecording = () => {
    if (!isRecording) return;
    isCancelledRef.current = false;
    mediaRecorderRef.current?.stop();
    cleanup();
  };

  // Cancel Recording (Fail)
  const cancelRecording = () => {
    if (!isRecording) return;
    isCancelledRef.current = true;
    mediaRecorderRef.current?.stop();
    cleanup();
  };

  return {
    isRecording,
    seconds,
    startRecording,
    stopRecording,
    cancelRecording,
  };
}
