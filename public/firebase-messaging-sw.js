importScripts(
  "https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js",
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js",
);

firebase.initializeApp({
  apiKey: "AIzaSyC6GoYHC6bF2DEK52p4lOpcImczFJmP6tk",
  authDomain: "yallachat-80a27.firebaseapp.com",
  projectId: "yallachat-80a27",
  storageBucket: "yallachat-80a27.firebasestorage.app",
  messagingSenderId: "1001268485161",
  appId: "1:1001268485161:web:af9fb0bc7ad5371c0e9038",
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
