"use client";

// *********************** Logic Imports ***********************
// => Ready To Use Hooks
import { createContext, useState, useEffect } from "react";

// => My Custom Hooks
import { useLocalStorage } from "@/hooks/useLocalStorage";

// => Libraries
import { ThemeProvider as NextThemeProvider } from "next-themes";

// **************** My Custom Types & Variables ****************
// => Types & Interfaces
interface ThemeProps {
  children: React.ReactNode;
}
type Context = {
  mode: string;
  handleNewMode: (mode: string) => void;
};

// => Variables
export const ThemeContext = createContext<Context>({
  mode: "light",
  handleNewMode: (): void => {},
});

function ThemeProvider({ children }: ThemeProps) {
  // ******************* Inside The Component  *******************
  // => States & Refs
  const [mode, setMode] = useState<string>("light");

  // => Use Hooks
  const { getFromLocalStorage, setInLocalStorage } = useLocalStorage();

  // => Functions
  const handleNewMode = (mode: string): void => {
    setMode(mode);

    setInLocalStorage("yallachat-mode", mode);
  };

  // => Use Effects
  useEffect(() => {
    const handleModeAfterReload = () => {
      const mode = getFromLocalStorage("yallachat-mode");

      if (mode) {
        setMode(mode);
      }
    };

    handleModeAfterReload();
  }, [getFromLocalStorage]);

  return (
    <NextThemeProvider
      attribute={"class"}
      defaultTheme={mode}
      forcedTheme={mode}
    >
      <div className={`${mode}`}>
        <ThemeContext.Provider
          value={{ mode: mode, handleNewMode: handleNewMode }}
        >
          {children}
        </ThemeContext.Provider>
      </div>
    </NextThemeProvider>
  );
}

export default ThemeProvider;
