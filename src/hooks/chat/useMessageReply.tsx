"use client";

// *********************** Logic Imports ***********************
// => Ready To Use Hooks
import { useState, useCallback } from "react";

// **************** My Custom Types & Variables ****************
// => Types & Interfaces
interface UseMessageReplyReturn {
  showFlash: number | null;
  scrollToReply: (
    container: HTMLDivElement | null,
    messageId: number | null,
  ) => void;
}

export function useMessageReply(): UseMessageReplyReturn {
  // ******************* Inside The Component  *******************
  // => States & Refs
  const [showFlash, setShowFlash] = useState<number | null>(null);

  // => Functions
  const scrollToReply = useCallback(
    (container: HTMLDivElement | null, messageId: number | null) => {
      if (!messageId) return;

      const element = document.getElementById(`message-${messageId}`);

      if (element && container) {
        setShowFlash(messageId);

        const containerTop = container.getBoundingClientRect().top;
        const elementTop = element.getBoundingClientRect().top;
        const offset = elementTop - containerTop;

        const handleScrollEnd = () => {
          setTimeout(() => setShowFlash(null), 800);
          container.removeEventListener("scrollend", handleScrollEnd);
        };

        container.addEventListener("scrollend", handleScrollEnd);

        container.scrollTo({
          top: container.scrollTop + offset - 100,
          behavior: "smooth",
        });
      } else if (container) {
        container.scrollTo({ top: 0, behavior: "smooth" });
      }
    },
    [],
  );

  return {
    showFlash,
    scrollToReply,
  };
}
