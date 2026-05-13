"use client";

// *********************** Logic Imports ***********************
// => Ready To Use Hooks
import { useRouter } from "next/navigation";

// => My Custom Hooks
import { useSonner } from "../useSonner";
import { useAxiosError } from "../useAxiosError";

// => Libraries
import axios from "axios";

// ***************** Types & Variables Imports *****************
// => Types & Interfaces
import { FileValues } from "@/lib/types";

// **************** My Custom Types & Variables ****************
// => Types & Interfaces
interface UpdateAvatarFunc {
  url: string;
  values: FileValues | undefined;
}
interface UseUpdateAvatarReturn {
  updateAvatarFetchFunc: (config: UpdateAvatarFunc) => Promise<void>;
}

export function useUpdateAvatar(): UseUpdateAvatarReturn {
  // ******************* Inside The Component  *******************
  // => Use Hooks
  const { showToast } = useSonner();
  const router = useRouter();
  const { handleAxiosError } = useAxiosError();

  // => Functions
  const updateAvatarFetchFunc = async (config: UpdateAvatarFunc) => {
    const values = {
      profileImage: config.values?.urlFile,
      imgSize: config.values?.fileSize,
    };

    try {
      const response = await axios.post(`/${config.url}`, values, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = response.data;

      if (result.success) {
        showToast({ type: "success", message: result.message });

        router.refresh();
      }
    } catch (error: unknown) {
      // Errors Mix Between Try Errors & Catch Errors In Api Route
      handleAxiosError({ error });
    }
  };

  return { updateAvatarFetchFunc };
}
