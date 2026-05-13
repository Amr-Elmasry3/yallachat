"use client";

// *********************** Logic Imports ***********************
// => Ready To Use Hooks
import { useContext } from "react";
import { redirect } from "next/navigation";

// => My Custom Hooks
import { useLogout } from "./auth/useLogout";

// => Contexts
import { UpdateInfoContext } from "@/contexts/UpdateInfoContext";

// **************** My Custom Types & Variables ****************
// => Types & Interfaces
interface UseProfileFuncsReturn {
  dialoagCProfileFuncs: {
    logoutFunc: (orderType: string) => Promise<void>;
  };
  nonDialogProfileFunc: {
    updateInfoFunc: () => void;
    changePasswordFunc: () => void;
  };
}

export function useProfileFuncs(): UseProfileFuncsReturn {
  // ******************* Inside Hook  *******************
  // => Use Contexts
  const { handleIsOpen } = useContext(UpdateInfoContext);

  // => Use Hooks
  const { logoutFetchFunc } = useLogout();

  // => Functions
  // [1] Update Info
  const updateInfoFunc = (): void => {
    handleIsOpen();
  };

  // [2] Change Password
  const changePasswordFunc = (): void => {
    redirect("/change-password");
  };

  // [3] Logout
  const logoutFunc = async (orderType: string) => {
    if (orderType === "ok") {
      await logoutFetchFunc("api/auth/logout", "/login");
    }
  };

  // *********** Put All Profile Dropdwon Menu Functions  ***********
  // Functions Need Alert Dialog Before Work
  const dialoagCProfileFuncs = {
    logoutFunc,
  };

  // Functions Needn`t Alert Dialog Before Work
  const nonDialogProfileFunc = {
    updateInfoFunc,
    changePasswordFunc,
  };

  return { dialoagCProfileFuncs, nonDialogProfileFunc };
}
