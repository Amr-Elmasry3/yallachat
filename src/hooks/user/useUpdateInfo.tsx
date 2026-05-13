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
import { UpdateInfoContext } from "@/contexts/UpdateInfoContext";

// => Libraries
import { FieldValues, UseFormReturn } from "react-hook-form";
import axios from "axios";

// **************** My Custom Types & Variables ****************
// => Types & Interfaces
type Values = {
  username?: string;
  email?: string;
  phone?: string;
  bio?: string;
};
interface UpdateInfoFunc<T extends FieldValues> {
  url: string;
  values: Values;
  form: UseFormReturn<T>;
}
interface UseUpdateInfoReturn {
  isLoading: boolean;
  updateInfoFetchFunc: <T extends FieldValues>(
    config: UpdateInfoFunc<T>,
  ) => Promise<void>;
}

export function useUpdateInfo(): UseUpdateInfoReturn {
  // ******************* Inside Hook  *******************
  // => Use Contexts
  const { handleIsOpen } = useContext(UpdateInfoContext);
  const router = useRouter();

  // => Use Hooks
  const { showToast } = useSonner();
  const { handleAxiosError } = useAxiosError();
  const { isLoading, handleIsLoading, reset } = useLoadingError();

  // => Functions
  const updateInfoFetchFunc = async <T extends FieldValues>(
    config: UpdateInfoFunc<T>,
  ) => {
    reset();

    try {
      handleIsLoading(true);

      const response = await axios.patch(`/${config.url}`, config.values, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      const result = response.data;

      // Update User Data Successfully
      if (result.success) {
        showToast({ type: "success", message: result.message });

        // Reset All Values;
        config.form.reset();

        // Close Update Dialog
        handleIsOpen();

        // Refresh Page
        router.refresh();
      }
    } catch (error: unknown) {
      // Errors Mix Between Try Errors & Catch Errors In Api Route
      handleAxiosError({ error, form: config.form });
    } finally {
      handleIsLoading(false);
    }
  };

  return { isLoading, updateInfoFetchFunc };
}
