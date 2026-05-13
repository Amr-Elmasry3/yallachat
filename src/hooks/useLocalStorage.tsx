"use client";

export function useLocalStorage() {
  // ******************* Inside Hook  *******************
  // => Functions
  const getFromLocalStorage = (itemName: string) => {
    if (typeof document !== "undefined") {
      const item = localStorage.getItem(itemName);
      return item ? JSON.parse(item) : null;
    }
  };

  const setInLocalStorage = (itemName: string, values: unknown) => {
    if (typeof document !== "undefined") {
      localStorage.setItem(itemName, JSON.stringify(values));
    }
  };

  return { setInLocalStorage, getFromLocalStorage };
}
