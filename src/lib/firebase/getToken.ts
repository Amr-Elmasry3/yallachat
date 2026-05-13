// *********************** Logic Imports ***********************
// => Libraries
import { getToken } from "firebase/messaging";

import { messaging } from "./firebase";

export const getDeviceToken = async () => {
  try {
    const permission = await Notification.requestPermission();

    if (permission !== "granted") {
      return null;
    }

    if (messaging) {
      const token = await getToken(messaging, {
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
      });

      return token;
    }
  } catch (error) {
    console.error("Error getting fcm token", error);

    return null;
  }
};
