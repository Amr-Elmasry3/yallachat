"use client";

// *********************** Logic Imports ***********************
// => Ready To Use Hooks
import { useState, useCallback } from "react";

// ***************** Types & Variables Imports *****************
// => Types & Interfaces
import { LoadingErorrReturn } from "@/lib/types";

// **************** My Custom Types & Variables ****************
// => Types & Interfaces
interface LoadingErrorReturnAll extends LoadingErorrReturn {
  handleIsLoading: (isLoad: boolean) => void;
  handleIsError: (isError: boolean) => void;
  handleStatusNum: (num: number) => void;
  reset: () => void;
}

export function useLoadingError(): LoadingErrorReturnAll {
  // ******************* Inside The Component  *******************
  // => States & Refs
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [statusNum, setStatusNum] = useState<number>(0);

  // => Functions
  const handleIsLoading = useCallback((isLoad: boolean) => {
    setIsLoading(isLoad);
  }, []);

  const handleIsError = useCallback((isError: boolean) => {
    setIsError(isError);
  }, []);

  const handleStatusNum = useCallback((num: number) => {
    setStatusNum(num);
  }, []);

  const reset = useCallback(() => {
    handleIsLoading(false);
    handleIsError(false);
    handleStatusNum(0);
  }, [handleIsError, handleIsLoading, handleStatusNum]);

  return {
    isLoading,
    isError,
    statusNum,
    handleIsLoading,
    handleIsError,
    handleStatusNum,
    reset,
  };
}
