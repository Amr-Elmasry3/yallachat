"use client";

// *********************** Logic Imports ***********************
// => Ready To Use Hooks
import { useContext } from "react";
import { useRouter } from "next/navigation";

// => My Custom Hooks
import { useSonner } from "../useSonner";
import { useAxiosError } from "../useAxiosError";
import { useLoadingError } from "../useLoadingError";

// => Contexts
import { UserStatusContext } from "@/contexts/UserStatusContext";

// => Libs & Utils
import { setToken } from "@/lib/tokenManager";

// => Libraries
import { FieldValues, UseFormReturn } from "react-hook-form";
import axios from "axios";

// **************** My Custom Types & Variables ****************
// => Types & Interfaces
type Values = {
  email: string;
  password: string;
};
interface LoginFunc<T extends FieldValues> {
  url: string;
  values: Values;
  redirectUrl: string;
  form: UseFormReturn<T>;
}
interface UseLoginReturn {
  isLoading: boolean;
  loginFetchFunc: <T extends FieldValues>(
    config: LoginFunc<T>,
  ) => Promise<void>;
}

export function useLogin(): UseLoginReturn {
  // ******************* Inside Hook  *******************
  // => Use Contexts
  const { handleIsLogin } = useContext(UserStatusContext);

  //  => Use Hooks
  const router = useRouter();
  const { showToast } = useSonner();

  const { handleAxiosError } = useAxiosError();
  const { isLoading, handleIsLoading, reset } = useLoadingError();

  // => Functions
  const loginFetchFunc = async <T extends FieldValues>(
    config: LoginFunc<T>,
  ) => {
    reset();

    try {
      handleIsLoading(true);

      const response = await axios.post(`/${config.url}`, config.values, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      const result = response.data;

      // Login Successfully
      if (result.success) {
        handleIsLogin();

        // Set Token When Successfully
        setToken({
          tokenName: "yalla_chat_user_token",
          token: result.data.token,
          expireDays: result.data.expiresDays,
        });

        showToast({ type: "success", message: result.message });

        // Reset All Values;
        config.form.reset();

        // Move To Redirect Page
        router.replace(config.redirectUrl);
      }
    } catch (error: unknown) {
      // Errors Mix Between Try Errors & Catch Errors In Api Route
      handleAxiosError({ error, form: config.form });
    } finally {
      handleIsLoading(false);
    }
  };

  return { isLoading, loginFetchFunc };
}
