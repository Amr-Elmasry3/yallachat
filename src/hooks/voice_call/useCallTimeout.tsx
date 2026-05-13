"use client";

// *********************** Logic Imports ***********************
// => Ready To Use Hooks
import { useRef } from "react";

// **************** My Custom Types & Variables ****************
// => Types & Interfaces
interface UseCallTimeoutReturn {
  callTimeoutRef: React.RefObject<NodeJS.Timeout | null>;
  startTimeout: (callback: () => void, delay: number) => void;
  clearCallTimeout: () => void;
}

export function useCallTimeout(): UseCallTimeoutReturn {
  // ******************* Inside The Component  *******************
  // => States & Refs
  const callTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // => Functions
  const startTimeout = (callback: () => void, delay: number) => {
    clearCallTimeout();

    callTimeoutRef.current = setTimeout(callback, delay);
  };

  const clearCallTimeout = () => {
    if (callTimeoutRef.current) {
      clearTimeout(callTimeoutRef.current);
      callTimeoutRef.current = null;
    }
  };

  return {
    callTimeoutRef,
    startTimeout,
    clearCallTimeout,
  };
}
