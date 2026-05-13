"use client";

// *********************** Logic Imports ***********************
// => Ready To Use Hooks
import { useCallback } from "react";
import { useRouter } from "next/navigation";

// => My Custom Hooks
import { useSonner } from "./useSonner";

// => Libraries
import { FieldValues, UseFormReturn } from "react-hook-form";
import axios from "axios";

// **************** My Custom Types & Variables ****************
// => Types & Interfaces
interface HandleAxiosFunc<T extends FieldValues> {
  error: unknown;
  form?: UseFormReturn<T>;
  handleStatusNum?: (num: number) => void;
}
interface UseAxiosErrorReturn {
  handleAxiosError: <T extends FieldValues>(config: HandleAxiosFunc<T>) => void;
}

export function useAxiosError(): UseAxiosErrorReturn {
  // ******************* Inside Hook  *******************
  // => Use Hooks
  const { showToast } = useSonner();
  const router = useRouter();

  // => Functions
  const handleAxiosError = useCallback(
    <T extends FieldValues>(config: HandleAxiosFunc<T>) => {
      if (axios.isAxiosError(config.error)) {
        if (config.error.response) {
          const result = config.error.response.data;

          config?.handleStatusNum?.(config.error.response.status);

          // This Is Errors From Try Errors In Api Route
          if (result.field) {
            config.form?.setError(result.field, {
              message: result.message,
            });
            config.form?.setFocus(result.field);
          }

          showToast({
            type: "error",
            message: result.message,
          });

          // If No Valid Session Found
          if (config.error.response.status === 401) {
            router.replace("/");
          }
        }
      }
    },
    [router, showToast],
  );

  return { handleAxiosError };
}
