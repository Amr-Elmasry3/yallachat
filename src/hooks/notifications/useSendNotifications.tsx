"use client";

// *********************** Logic Imports ***********************
// => My Custom Hooks
import { useAxiosError } from "../useAxiosError";
import { useGetData } from "../useGetData";

// => Libraries
import axios from "axios";

// ***************** Types & Variables Imports *****************
// => Types & Interfaces
import { FcmTokensData } from "@/lib/types";

// **************** My Custom Types & Variables ****************
// => Types & Interfaces
type NotificationsValues = {
  token?: string;
  title: string;
  body: string;
  clickUrl: string;
  senderAvatar: string;
};
interface sendNotificationsProps {
  url: string;
  friendId: string;
  values: NotificationsValues;
}

interface UseSendNotificationsReturn {
  sendNotificationsFetchFunc: (config: sendNotificationsProps) => Promise<void>;
}

export function useSendNotifications(): UseSendNotificationsReturn {
  // ******************* Inside Hook  *******************
  // => Use Hooks
  const { handleAxiosError } = useAxiosError();
  const { getDataFetchFunc } = useGetData<FcmTokensData>();

  // => Functions
  const sendNotificationsFetchFunc = async (config: sendNotificationsProps) => {
    if (!config.friendId) return;

    const fcmTokens = await getDataFetchFunc({
      url: `api/send-notifications/fcm-token?friendId=${config.friendId}`,
    });

    const bodyValues = {
      ...config.values,
      token: fcmTokens?.data.tokens[0],
    };

    try {
      await axios.post(`/${config.url}`, bodyValues, {
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error: unknown) {
      // Errors Mix Between Try Errors & Catch Errors In Api Route
      handleAxiosError({ error });
    }
  };

  return { sendNotificationsFetchFunc };
}
