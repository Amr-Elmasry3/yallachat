"use client";

// *********************** Logic Imports ***********************
// => Ready To Use Hooks
import { redirect } from "next/navigation";

// => My Custom Hooks
import { useRemoveFriend } from "./friends/useRemoveFriend";

// ***************** Types & Variables Imports *****************
// => Types & Interfaces
import { Friend } from "@/lib/types";

// **************** My Custom Types & Variables ****************
// => Types & Interfaces
interface UseContactsFuncsReturn {
  dialoagContactsFuncs: {
    deleteFriendFunc: (orderType: string, payload?: Friend) => Promise<void>;
  };
  nonDialogContactsFunc: {
    chatFunc: (payload?: Friend) => void;
  };
}

export function useContactsFuncs(): UseContactsFuncsReturn {
  // ******************* Inside The Component  *******************
  // => Use Hooks
  const { removeFriendFetchFunc } = useRemoveFriend();

  // [1] => Go To Chat Page
  const chatFunc = (payload?: Friend): void => {
    redirect(`/dashboard/chats/${payload?.conversationId}`);
  };

  // => Functions
  // [2] Delete Friend
  const deleteFriendFunc = async (
    orderType: string,
    payload?: Friend,
  ): Promise<void> => {
    if (orderType === "ok") {
      await removeFriendFetchFunc({
        url: "api/friends",
        friendId: payload?.id,
        conversationId: payload?.conversationId,
      });
    }
  };

  // *********** Put All Profile Dropdwon Menu Functions  ***********
  // Functions Need Alert Dialog Before Work
  const dialoagContactsFuncs = {
    deleteFriendFunc,
  };

  // Functions Needn`t Alert Dialog Before Work
  const nonDialogContactsFunc = {
    chatFunc,
  };

  return { dialoagContactsFuncs, nonDialogContactsFunc };
}
