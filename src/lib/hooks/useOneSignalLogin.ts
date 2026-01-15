/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef } from "react";

declare global {
  interface Window {
    OneSignalDeferred?: Array<(OneSignal: any) => void>;
  }
}

export function useOneSignalLogin(userId?: string | null) {
  const hasLoggedIn = useRef(false);

  useEffect(() => {
    if (!userId) return;
    if (hasLoggedIn.current) return;
    if (typeof window === "undefined") return;

    hasLoggedIn.current = true;

    window.OneSignalDeferred = window.OneSignalDeferred || [];

    window.OneSignalDeferred.push(async (OneSignal) => {
      try {
        await OneSignal.login(userId);
    
        
        // Request push permission and subscribe
        if (OneSignal.Notifications.permission !== 'granted') {
          await OneSignal.Notifications.requestPermission();
        }
      } catch (err) {
        console.error("[OneSignal] login failed", err);
        hasLoggedIn.current = false; // allow retry
      }
    });
  }, [userId]);
}

// Non-hook function for direct calls (e.g., in event handlers)
export function oneSignalLogin(userId: string) {
  if (typeof window === "undefined") return;

  window.OneSignalDeferred = window.OneSignalDeferred || [];

  window.OneSignalDeferred.push(async (OneSignal) => {
    try {
      await OneSignal.login(userId);

      // Request push permission and subscribe
      if (OneSignal.Notifications.permission !== 'granted') {
        await OneSignal.Notifications.requestPermission();
      }
    } catch (err) {
      console.error("[OneSignal] login failed", err);
    }
  });
}
