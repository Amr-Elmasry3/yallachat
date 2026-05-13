"use client";

// *********************** Logic Imports ***********************
// => Ready To Use Hooks
import { createContext, useState } from "react";

// **************** My Custom Types & Variables ****************
// => Types & Interfaces
interface AddFriendsProps {
  children: React.ReactNode;
}
type Context = {
  isOpen: boolean;
  handleIsOpenFriends: () => void;
};

// => Variables
export const AddFriendsContext = createContext<Context>({
  isOpen: false,
  handleIsOpenFriends: (): void => {},
});

function AddFriendsProvider({ children }: AddFriendsProps) {
  // ******************* Inside The Component  *******************
  // => States & Refs
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // => Functions
  const handleIsOpenFriends = (): void => {
    setIsOpen(!isOpen);
  };

  return (
    <AddFriendsContext
      value={{
        isOpen: isOpen,
        handleIsOpenFriends: handleIsOpenFriends,
      }}
    >
      {children}
    </AddFriendsContext>
  );
}

export default AddFriendsProvider;
