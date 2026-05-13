"use client";

// *********************** Logic Imports ***********************
// => Ready To Use Hooks
import { createContext, useState } from "react";

// **************** My Custom Types & Variables ****************
// => Types & Interfaces
interface UpdateInfoProps {
  children: React.ReactNode;
}
type Context = {
  isOpen: boolean;
  handleIsOpen: () => void;
};

// => Variables
export const UpdateInfoContext = createContext<Context>({
  isOpen: false,
  handleIsOpen: (): void => {},
});

function UpdateInfoProvider({ children }: UpdateInfoProps) {
  // ******************* Inside The Component  *******************
  // => States & Refs
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // => Functions
  const handleIsOpen = (): void => {
    setIsOpen(!isOpen);
  };

  return (
    <UpdateInfoContext
      value={{
        isOpen: isOpen,
        handleIsOpen: handleIsOpen,
      }}
    >
      {children}
    </UpdateInfoContext>
  );
}

export default UpdateInfoProvider;
