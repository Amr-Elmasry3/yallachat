importScripts(
  "https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js",
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js",
);

firebase.initializeApp({
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
});

const messaging = firebase.messaging();

// Receive message from data only
messaging.onBackgroundMessage((payload) => {
  // The data remained in payload.data, not payload.notification
  const notificationTitle = payload.data?.title || "New Notification";
  const notificationBody = payload.data?.body || "You have a new message";
  const iconUrl = payload.data?.icon || "/pictures/avatar_icon.png";
  const clickUrl = payload.data?.url || "/";

  const notificationOptions = {
    body: notificationBody,
    icon: iconUrl,
    badge: "/icons/badge-72x72.png",
    vibrate: [200, 100, 200],
    data: {
      url: clickUrl,
    },
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// The link will open when you click on the notification.
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const urlToOpen = event.notification.data?.url || "/";

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((windowClients) => {
        for (const client of windowClients) {
          if (client.url === urlToOpen && "focus" in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      }),
  );
});
