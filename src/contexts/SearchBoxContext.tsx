"use client";

// *********************** Logic Imports ***********************
// => Ready To Use Hooks
import { createContext, useState } from "react";

// **************** My Custom Types & Variables ****************
// => Types & Interfaces
interface SearchBoxProps {
  children: React.ReactNode;
}
type Context = {
  searchValue: string;
  handleSearchValue: (value: string) => void;
};

// => Variables
export const SearchBoxContext = createContext<Context>({
  searchValue: "",
  handleSearchValue: () => {},
});

function SearchBoxProvider({ children }: SearchBoxProps) {
  // ******************* Inside The Component  *******************
  // => States & Refs
  const [searchValue, setSearchValue] = useState<string>("");

  // => Functions
  const handleSearchValue = (value: string) => {
    setSearchValue(value);
  };

  return (
    <SearchBoxContext
      value={{ searchValue, handleSearchValue: handleSearchValue }}
    >
      {children}
    </SearchBoxContext>
  );
}

export default SearchBoxProvider;
