"use client";

// *********************** Logic Imports ***********************
// => Ready To Use Hooks
import { createContext, useState, useEffect } from "react";

// => My Custom Hooks
import { useUser } from "@/hooks/user/useUser";
import { useLocalStorage } from "@/hooks/useLocalStorage";

// => Libs & Utils
import { presenceManager } from "@/lib/presence-manager/presenceManager";

// **************** My Custom Types & Variables ****************
// => Types & Interfaces
interface UserStatusProps {
  children: React.ReactNode;
}
type Context = {
  isLogin: boolean;
  handleIsLogin: () => void;
};

// => Variables
export const UserStatusContext = createContext<Context>({
  isLogin: false,
  handleIsLogin: (): void => {},
});

function UserStatusProvider({ children }: UserStatusProps) {
  // ******************* Inside The Component  *******************
  // => Use Hooks
  const { setInLocalStorage, getFromLocalStorage } = useLocalStorage();
  const { userIdFetchFunc } = useUser();

  // => States & Refs
  const [isLogin, setIsLogin] = useState<boolean>(
    getFromLocalStorage("yalla-chat-is-login"),
  );

  // => Functions
  const handleIsLogin = (): void => {
    setIsLogin(!isLogin);

    setInLocalStorage("yalla-chat-is-login", !isLogin);
  };

  // => Use Effects
  useEffect(() => {
    if (isLogin) {
      const fetchUserId = async () => {
        const user = await userIdFetchFunc("api/user/userId");

        if (user?.id) {
          // The Manager Is Activated When The User Logs In
          presenceManager.initialize(user.id);

          // Clean When The User Exits
          return () => {
            presenceManager.cleanup();
          };
        }
      };

      fetchUserId();
    } else {
      return () => {
        presenceManager.cleanup();
      };
    }
  }, [isLogin, userIdFetchFunc]);

  return (
    <UserStatusContext.Provider
      value={{ isLogin: isLogin, handleIsLogin: handleIsLogin }}
    >
      {children}
    </UserStatusContext.Provider>
  );
}

export default UserStatusProvider;
