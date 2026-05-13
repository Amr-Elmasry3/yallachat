"use client";

// *********************** Logic Imports ***********************
// => Ready To Use Hooks
import { useEffect } from "react";

// => My Custom Hooks
import { useLocalStorage } from "@/hooks/useLocalStorage";

// => Libs & Utils
import { getDeviceToken } from "@/lib/firebase/getToken";

export function useInitialNotification() {
  // ******************* Inside Hook *******************
  // => Use Hooks
  const { getFromLocalStorage } = useLocalStorage();

  // => Variables
  const isLogin = getFromLocalStorage("yalla-chat-is-login");

  // => Use Effects
  useEffect(() => {
    const initNotifications = async () => {
      const token = await getDeviceToken();

      if (token && isLogin) {
        await fetch("/api/user/fcm-token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fcmToken: token,
          }),
        });
      }
    };

    initNotifications();
  }, [isLogin]);
}
