"use client";

// ************************ Ui Imports *************************
// => Ready To Use Components
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/shadcn/input-group";
import { Spinner } from "@/components/shadcn/spinner";

// => Icons
import { SearchIcon } from "lucide-react";

// *********************** Logic Imports ***********************
// => Ready To Use Hooks
import { useContext } from "react";

// => Contexts
import { SearchBoxContext } from "@/contexts/SearchBoxContext";

// **************** My Custom Types & Variables ****************
// => Types & Interfaces
interface SearchBoxProps {
  placeholder: string;
}

function SearchBox({ placeholder }: SearchBoxProps) {
  // ******************* Inside The Component  *******************
  // => Use Contexts
  const { handleSearchValue } = useContext(SearchBoxContext);

  // => Functions
  const handleOnChange = (value: string) => {
    handleSearchValue(value);
  };

  return (
    <div className="search-box">
      <InputGroup className="bg-gray-light">
        <InputGroupInput
          placeholder={placeholder}
          onChange={(eve) => {
            handleOnChange(eve.currentTarget.value);
          }}
        />

        <InputGroupAddon>
          <SearchIcon />
        </InputGroupAddon>

        <InputGroupAddon align="inline-end" className="hidden">
          <Spinner />
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}

export default SearchBox;
