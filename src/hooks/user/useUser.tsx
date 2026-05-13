"use client";

// *********************** Logic Imports ***********************
// => My Custom Hooks
import { useAxiosError } from "../useAxiosError";
import { useLocalStorage } from "../useLocalStorage";

// => Libraries
import axios from "axios";

// ***************** Types & Variables Imports *****************
// => Types & Interfaces
import { UserIdData } from "@/lib/types";

// **************** My Custom Types & Variables ****************
// => Types & Interfaces
interface UseUserReturn {
  userIdFetchFunc: (url: string) => Promise<UserIdData | undefined>;
}

export function useUser(): UseUserReturn {
  // ******************* Inside The Component  *******************
  // => Use Hooks
  const { handleAxiosError } = useAxiosError();
  const { getFromLocalStorage } = useLocalStorage();

  // => Functions
  const isLogin = getFromLocalStorage("yalla-chat-is-login");

  const userIdFetchFunc = async (
    url: string,
  ): Promise<UserIdData | undefined> => {
    if (!isLogin) return;

    try {
      const response = await axios.get(`/${url}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      const result = response.data;

      // Get User Id Successfully
      if (result.success) {
        return result.data;
      }
    } catch (error: unknown) {
      // Errors Mix Between Try Errors & Catch Errors In Api Route
      handleAxiosError({ error });
    }
  };

  return { userIdFetchFunc };
}
