import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  ReactNode,
} from "react";
import * as Notifications from "expo-notifications";
import { Subscription } from "expo-modules-core";
import { registerForPushNotificationsAsync } from "./notification";
import { useSession } from "./ctx";
import { setUserPushToken } from "./utils";

interface NotificationContextType {
  expoPushToken: string | null;
  notification: Notifications.Notification | null;
  error: Error | null;
  updateInitialized: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
}) => {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [notification, setNotification] =
    useState<Notifications.Notification | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [initialized, setInitialized] = useState(false);

  const session = useSession();
  const notificationListener = useRef<Subscription>();
  const responseListener = useRef<Subscription>();

  const registerPushToken = (pushToken: string) => {
    setExpoPushToken(pushToken);
    setUserPushToken(session, pushToken);
  };

  const initializeNotifications = () => {
    console.log("Registering for push notifications...", session.jwt_token || "No JWT token");
    if (!session.jwt_token) return;

    registerForPushNotificationsAsync().then(
      (token) => registerPushToken(token),
      (error) => setError(error)
    );

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        console.log("🔔 Notification Received: ", notification);
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(
          "🔔 Notification Response: ",
          JSON.stringify(response, null, 2),
          JSON.stringify(response.notification.request.content.data, null, 2)
        );
        // Handle the notification response here
      });

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }

  const updateInitialized = () => {
    console.log("NotificationProvider updateInitialized");
    setInitialized(!initialized);
  }

  useEffect(() => {
    console.log("NotificationProvider useEffect");
    initializeNotifications();
  }, []);

  useEffect(() => {
    console.log("NotificationProvider useEffect - session updated");
    initializeNotifications();
  }, [session]);

  useEffect(() => {
    console.log("NotificationProvider useEffect - initialized updated");
    initializeNotifications();
  }, [initialized]);


  return (
    <NotificationContext.Provider
      value={{ expoPushToken, notification, error, updateInitialized }}
    >
      {children}
    </NotificationContext.Provider>
  );
};