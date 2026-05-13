"use client";

// *********************** Logic Imports ***********************
// => Ready To Use Hooks
import { useEffect, useState } from "react";

// => My Custom Hooks
import { useUser } from "@/hooks/user/useUser";

// => Libraries
import Peer from "peerjs";

// **************** My Custom Types & Variables ****************
// => Types & Interfaces
interface UsePeerReturn {
  peer: Peer | null;
  peerId: string;
  userId: string | null;
}

export function usePeer(): UsePeerReturn {
  // ******************* Inside Hook *******************
  // => States & Refs
  const [peer, setPeer] = useState<Peer | null>(null);
  const [peerId, setPeerId] = useState<string>("");
  const [userId, setUserId] = useState<string | null>(null);

  // => Use Hooks
  const { userIdFetchFunc } = useUser();

  // => Use Effects
  useEffect(() => {
    const getUserId = async () => {
      const user = await userIdFetchFunc("api/user/userId");

      if (user?.id) {
        setUserId(user.id);
      }
    };

    getUserId();

    if (userId) {
      const newPeer = new Peer(userId);

      const handlePeer = () => {
        setPeer(newPeer);
      };

      handlePeer();

      newPeer.on("open", (id) => {
        setPeerId(id);
      });

      return () => {
        newPeer.destroy();
      };
    }
  }, [userId, userIdFetchFunc]);

  return {
    peer,
    peerId,
    userId,
  };
}
