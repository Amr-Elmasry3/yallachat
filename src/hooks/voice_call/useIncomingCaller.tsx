"use client";

// *********************** Logic Imports ***********************
// => Ready To Use Hooks
import { useState } from "react";

// => My Custom Hooks
import { useGetData } from "../useGetData";

// ***************** Types & Variables Imports *****************
// => Types & Interfaces
import { UserInfo } from "@/lib/types";
import { CallerData } from "@/components/ui/userChat/headr/phone_call/types";

// **************** My Custom Types & Variables ****************
// => Types & Interfaces
interface UseIncomingCallerReturn {
  incomingCallerData: CallerData | null;
  setCaller: (callerId: string) => Promise<void>;
  resetCaller: () => void;
}

export function useIncomingCaller(): UseIncomingCallerReturn {
  // ******************* Inside Hook *******************
  // => States & Refs
  const [incomingCallerData, setIncomingCallerData] =
    useState<CallerData | null>(null);

  const { getDataFetchFunc } = useGetData<UserInfo>();

  // => Functions
  const setCaller = async (callerId: string) => {
    const userData = await getDataFetchFunc({ url: `api/users/${callerId}` });

    const callerData = {
      name: userData?.data.username,
      image: userData?.data.profile_image,
    };

    setIncomingCallerData(callerData);
  };

  const resetCaller = () => {
    setIncomingCallerData(null);
  };

  return {
    incomingCallerData,
    setCaller,
    resetCaller,
  };
}
