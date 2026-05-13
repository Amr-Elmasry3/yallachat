"use client";

// Import My Custom Hooks
import { useSonner } from "../useSonner";
import { useAxiosError } from "../useAxiosError";

// Import Hooks
import { useContext } from "react";
import { useRouter } from "next/navigation";

// Import Contexts
import { UserStatusContext } from "@/contexts/UserStatusContext";

// Import Axios
import axios from "axios";
interface UseLogoutReturn {
  logoutFetchFunc: (url: string, redirectUrl: string) => Promise<void>;
}

export function useLogout(): UseLogoutReturn {
  // ******************* Inside Hook  *******************
  // => Use Contexts
  const { handleIsLogin } = useContext(UserStatusContext);

  // => Use Hooks
  const router = useRouter();
  const { showToast } = useSonner();

  const { handleAxiosError } = useAxiosError();

  // => Functions
  const logoutFetchFunc = async (url: string, redirectUrl: string) => {
    try {
      const response = await axios.post(`/${url}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = response.data;

      if (result.success) {
        handleIsLogin();

        showToast({ type: "success", message: result.message });

        // Move To Redirect Page
        router.replace(redirectUrl);
      }
    } catch (error: unknown) {
      // Errors Mix Between Try Errors & Catch Errors In Api Route
      handleAxiosError({ error });
    }
  };

  return { logoutFetchFunc };
}
