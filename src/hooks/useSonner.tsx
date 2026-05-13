"use client";

// *********************** Logic Imports ***********************
// => Ready To Use Hooks
import { useCallback } from "react";

// => Libraries
import { toast } from "sonner";

// **************** My Custom Types & Variables ****************
// => Types & Interfaces
type SonnerConfig = {
  message: string;
  type: "success" | "error" | "warning" | "info" | "loading";
};
interface UseSonnerReturn {
  showToast: (config: SonnerConfig) => void;
}

export function useSonner(): UseSonnerReturn {
  // ******************* Inside The Component  *******************
  // => Functions
  const showToast = useCallback((config: SonnerConfig) => {
    toast[config.type](config.message);
  }, []);

  return { showToast };
}
