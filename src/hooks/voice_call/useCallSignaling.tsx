"use client";

// *********************** Logic Imports ***********************
// => Ready To Use Hooks
import { useRef } from "react";

// => Libraries
import Peer, { DataConnection } from "peerjs";

// ***************** Types & Variables Imports *****************
// => Types & Interfaces
import { SignalData } from "@/components/ui/userChat/headr/phone_call/types";

// **************** My Custom Types & Variables ****************
// => Types & Interfaces
interface UseCallSignalingReturn {
  dataConnectionRef: React.RefObject<DataConnection | null>;
  createDataConnection: () => DataConnection | null;
  setDataConnection: (conn: DataConnection) => void;
  sendSignal: (signal: SignalData) => boolean;
  closeDataConnection: () => void;
}

export function useCallSignaling(
  peer: Peer | null,
  friendId: string | undefined,
): UseCallSignalingReturn {
  // ******************* Inside The Component  *******************
  // => States & Refs
  const dataConnectionRef = useRef<DataConnection | null>(null);

  // => Functions
  const createDataConnection = () => {
    if (!peer || !friendId) return null;
    const conn = peer.connect(friendId);
    dataConnectionRef.current = conn;
    return conn;
  };

  const setDataConnection = (conn: DataConnection) => {
    dataConnectionRef.current = conn;
  };

  // Sending A Signal To The Other Party (Rejection, Cancellation, Expiry, Missed)
  const sendSignal = (signal: SignalData) => {
    if (dataConnectionRef.current && dataConnectionRef.current.open) {
      dataConnectionRef.current.send(signal);
      return true;
    }
    return false;
  };

  const closeDataConnection = () => {
    if (dataConnectionRef.current) {
      dataConnectionRef.current.close();
      dataConnectionRef.current = null;
    }
  };

  return {
    dataConnectionRef,
    createDataConnection,
    setDataConnection,
    sendSignal,
    closeDataConnection,
  };
}
