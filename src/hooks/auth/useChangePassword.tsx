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
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
};
interface ChangePasswordFunc<T extends FieldValues> {
  url: string;
  values: Values;
  form: UseFormReturn<T>;
}
interface UseChangePasswordReturn {
  isLoading: boolean;
  changePasswordFetchFunc: <T extends FieldValues>(
    config: ChangePasswordFunc<T>,
  ) => Promise<void>;
}

export function useChangePassword(): UseChangePasswordReturn {
  // ******************* Inside The Component  *******************
  // => Use Hooks
  const router = useRouter();
  const { showToast } = useSonner();
  const { handleAxiosError } = useAxiosError();
  const { isLoading, handleIsLoading, reset } = useLoadingError();

  // => Functions
  const changePasswordFetchFunc = async <T extends FieldValues>(
    config: ChangePasswordFunc<T>,
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

      // Change Password Successfully
      if (result.success) {
        showToast({ type: "success", message: result.message });

        // Reset All Values;
        config.form.reset();

        // Move To Redirect Page
        router.replace("/dashboard/chats");
      }
    } catch (error: unknown) {
      // Errors Mix Between Try Errors & Catch Errors In Api Route
      handleAxiosError({ error, form: config.form });
    } finally {
      handleIsLoading(false);
    }
  };

  return { isLoading, changePasswordFetchFunc };
}
