"use client";

// *********************** Logic Imports ***********************
// => Ready To Use Hooks
import { createContext, useState } from "react";

// => Types & Interfaces
interface MediaCarouselProps {
  children: React.ReactNode;
}
type Context = {
  currentIndex: number | null;
  handleCurrentIndex: (index: number | null) => void;
};

// => Variables
export const MediaCarouselContext = createContext<Context>({
  currentIndex: null,
  handleCurrentIndex: () => {},
});

export default function MediaCarouselProvider({
  children,
}: MediaCarouselProps) {
  // ******************* Inside The Component  *******************
  // => States & Refs
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);

  // => Functions
  const handleCurrentIndex = (index: number | null) => {
    setCurrentIndex(index);
  };

  return (
    <MediaCarouselContext.Provider
      value={{ currentIndex, handleCurrentIndex: handleCurrentIndex }}
    >
      {children}
    </MediaCarouselContext.Provider>
  );
}
