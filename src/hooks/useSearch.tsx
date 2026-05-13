"use client";

// *********************** Logic Imports ***********************
// => Ready To Use Hooks
import { useMemo } from "react";

// ***************** Types & Variables Imports *****************
// => Types & Interfaces
import { Friend } from "@/lib/types";

// **************** My Custom Types & Variables ****************
// => Types & Interfaces
interface UseSearchProps {
  searchValue: string;
  originalList: Friend[];
}
interface UseSearchReturn {
  filteredList: {
    count: number;
    friendsList: Friend[];
  };
}

export function useSearch({
  searchValue,
  originalList,
}: UseSearchProps): UseSearchReturn {
  // ******************* Inside The Component  *******************
  // => Variables
  const filteredList = useMemo(() => {
    // Not Found Value For Search
    if (!searchValue.trim()) {
      return {
        count: originalList.length,
        friendsList: originalList,
      };
    }

    const searchLower = searchValue.toLowerCase();
    const filtered = originalList.filter((friend) =>
      friend.username?.toLowerCase().includes(searchLower),
    );

    return {
      count: filtered.length,
      friendsList: filtered,
    };
  }, [searchValue, originalList]);
  return { filteredList };
}
