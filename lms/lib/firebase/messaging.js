import { getMessaging, getToken, onMessage, isSupported } from "firebase/messaging";
import { app } from "./client";

export const requestNotificationPermission = async () => {
  try {
    const supported = await isSupported();
    if (!supported) {
      console.warn("Push notifications are not supported in this browser.");
      return null;
    }
    
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      const messaging = getMessaging(app);
      const currentToken = await getToken(messaging, { 
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY 
      });
      
      if (currentToken) {
        // We have the FCM token. Usually, we would send this to our backend/firestore to associate it with the user.
        return currentToken;
      } else {
        console.warn("No registration token available. Request permission to generate one.");
        return null;
      }
    } else {
      console.warn("Notification permission denied.");
      return null;
    }
  } catch (error) {
    console.error("An error occurred while retrieving token: ", error);
    return null;
  }
};

export const onMessageListener = () => {
  return new Promise((resolve) => {
    isSupported().then((supported) => {
      if (supported) {
        const messaging = getMessaging(app);
        onMessage(messaging, (payload) => {
          resolve(payload);
        });
      }
    });
  });
};
