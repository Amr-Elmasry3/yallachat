"use client";

// *********************** Logic Imports ***********************
// => Ready To Use Hooks
import { useRouter } from "next/navigation";

// => My Custom Hooks
import { useSonner } from "../useSonner";
import { useAxiosError } from "../useAxiosError";
import { useLoadingError } from "../useLoadingError";

// => Libraries
import { FieldValues, UseFormReturn } from "react-hook-form";
import axios from "axios";

// **************** My Custom Types & Variables ****************
// => Types & Interfaces
type Values = {
  username: string;
  email: string;
  password: string;
  phone: string;
};
interface RegisterFunc<T extends FieldValues> {
  url: string;
  values: Values;
  redirectUrl: string;
  form: UseFormReturn<T>;
}
interface UseRegisterReturn {
  isLoading: boolean;
  registerFetchFunc: <T extends FieldValues>(
    config: RegisterFunc<T>,
  ) => Promise<void>;
}

export function useRegister(): UseRegisterReturn {
  // ******************* Inside Hook  *******************
  // => Use Hooks
  const router = useRouter();
  const { showToast } = useSonner();
  const { handleAxiosError } = useAxiosError();
  const { isLoading, handleIsLoading, reset } = useLoadingError();

  // => Functions
  const registerFetchFunc = async <T extends FieldValues>(
    config: RegisterFunc<T>,
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

      // Register Successfully
      if (result.success) {
        showToast({ type: "success", message: result.message });

        // Reset All Values;
        config.form.reset();

        // Move To Redirect Page
        router.push(config.redirectUrl);
      }
    } catch (error: unknown) {
      // Errors Mix Between Try Errors & Catch Errors In Api Route
      handleAxiosError({ error, form: config.form });
    } finally {
      handleIsLoading(false);
    }
  };

  return { isLoading, registerFetchFunc };
}
