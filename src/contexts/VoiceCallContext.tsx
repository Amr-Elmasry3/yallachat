"use client";

// ************************ Ui Imports *************************
// => My Custom Components
import PhoneCall from "@/components/ui/userChat/headr/phone_call/PhoneCall";

// *********************** Logic Imports ***********************
// => Ready To Use Hooks
import { createContext, useState } from "react";

// => My Custom Hooks
import { usePeer } from "@/hooks/usePeer";

// ***************** Types & Variables Imports *****************
// => Types & Interfaces
import { OutgoingCallData } from "@/components/ui/userChat/headr/phone_call/types";

// **************** My Custom Types & Variables ****************
// => Types & Interfaces
interface CallProviderProps {
  children: React.ReactNode;
}
export interface CallContextType {
  outgoingCallData: OutgoingCallData | null;
  handleOutgoingCallData: (data: OutgoingCallData | null) => void;
  clearOutgoingCall: () => void;
}

// => Variables
export const VoiceCallContext = createContext<CallContextType>({
  outgoingCallData: null,
  handleOutgoingCallData: () => {},
  clearOutgoingCall: () => {},
});

export default function VoiceCallProvider({ children }: CallProviderProps) {
  // ******************* Inside The Component  *******************
  // => States & Refs
  const [outgoingCallData, setOutgoingCallData] =
    useState<OutgoingCallData | null>(null);

  // => Use Hooks
  const { peer, userId } = usePeer();

  // => Functions
  const clearOutgoingCall = () => {
    setOutgoingCallData(null);
  };

  return (
    <VoiceCallContext.Provider
      value={{
        outgoingCallData,
        handleOutgoingCallData: setOutgoingCallData,
        clearOutgoingCall: clearOutgoingCall,
      }}
    >
      {children}

      {/*A Phone Call Is Always Available; It Works If There Is A Call Or A Rose*/}
      {peer && userId && (
        <PhoneCall
          peer={peer}
          userId={userId}
          outgoingData={outgoingCallData}
          onCallEnd={clearOutgoingCall}
        />
      )}
    </VoiceCallContext.Provider>
  );
}
