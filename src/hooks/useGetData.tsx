"use client";

// *********************** Logic Imports ***********************
// => Ready To Use Hooks
import { useCallback, useState } from "react";

// => My Custom Hooks
import { useAxiosError } from "./useAxiosError";
import { useLoadingError } from "./useLoadingError";

// => Libs & Utils
import { getToken } from "@/lib/tokenManager";

// => Libraries
import axios from "axios";

// ***************** Types & Variables Imports *****************
// => Types & Interfaces
import { GetDataFetchFunc, GetDataResponse } from "@/lib/types";

// **************** My Custom Types & Variables ****************
// => Types & Interfaces
interface UseGetDataReturn<T> {
  isLoading: boolean;
  data: null | T;
  isError: boolean;
  statusNum: number;
  getDataFetchFunc: (
    config: GetDataFetchFunc,
  ) => Promise<GetDataResponse<T> | undefined>;
}

export function useGetData<T>(): UseGetDataReturn<T> {
  // ******************* Inside The Component  *******************
  // => States & Refs
  const [data, setData] = useState<null | T>(null);

  // => Use Hooks
  const { handleAxiosError } = useAxiosError();
  const {
    isLoading,
    isError,
    statusNum,
    handleIsLoading,
    handleIsError,
    handleStatusNum,
    reset,
  } = useLoadingError();

  // => Functions
  const getDataFetchFunc = useCallback(
    async (
      config: GetDataFetchFunc,
    ): Promise<GetDataResponse<T> | undefined> => {
      const token = await getToken({
        tokenName: "yalla_chat_user_token",
      });

      reset();

      try {
        handleIsLoading(true);

        const response = await axios.get(`/${config.url}`, {
          params: config.params,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const result = response.data;

        if (result.success) {
          setData(result.data);
          return result;
        }
      } catch (error: unknown) {
        // Errors Mix Between Try Errors & Catch Errors In Api Route
        handleAxiosError({ error, handleStatusNum: handleStatusNum });
        handleIsError(true);
      } finally {
        handleIsLoading(false);
      }
    },
    [handleAxiosError, handleIsLoading, handleIsError, handleStatusNum, reset],
  );

  return { isLoading, data, isError, statusNum, getDataFetchFunc };
}
