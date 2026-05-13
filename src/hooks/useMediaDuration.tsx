"use client";

// *********************** Logic Imports ***********************
// => Ready To Use Hooks
import { useState, useCallback } from "react";

// **************** My Custom Types & Variables ****************
// => Types & Interfaces
interface GetDurationConfig {
  url: string;
  type: "video" | "audio";
}
interface UseMediaDurationReturn {
  duration: number | null;
  getDuration: (config: GetDurationConfig) => Promise<number>;
}

export function useMediaDuration(): UseMediaDurationReturn {
  // ******************* Inside Hook  *******************
  // => States & Refs
  const [duration, setDuration] = useState<number | null>(null);

  // => Functions
  const getDuration = useCallback((config: GetDurationConfig) => {
    return new Promise<number>((resolve, reject) => {
      const element = document.createElement(config.type);
      element.preload = "metadata";
      element.src = config.url;

      element.onloadedmetadata = () => {
        const dur = element.duration;
        setDuration(dur);
        resolve(dur);
      };

      element.onerror = () => {
        const errMsg = `Failed to load ${config.type} duration`;
        reject(new Error(errMsg));
      };
    });
  }, []);

  return { duration, getDuration };
}
