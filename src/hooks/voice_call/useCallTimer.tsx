"use client";

// *********************** Logic Imports ***********************
// => Ready To Use Hooks
import { useRef, useState } from "react";

// **************** My Custom Types & Variables ****************
// => Types & Interfaces
interface UseCallTimerReturn {
  callTime: number;
  startTimer: () => void;
  stopTimer: () => void;
}

export function useCallTimer(): UseCallTimerReturn {
  // ******************* Inside The Component  *******************
  // => States & Refs
  const [callTime, setCallTime] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // => Functions
  const startTimer = () => {
    stopTimer();

    timerRef.current = setInterval(() => {
      setCallTime((p) => p + 1);
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = null;

    setCallTime(0);
  };

  return {
    callTime,
    startTimer,
    stopTimer,
  };
}
