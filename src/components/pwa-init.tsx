"use client";

import { useEffect } from "react";

declare global {
  // biome-ignore lint/style/useConsistentTypeDefinitions: <use interface>
  interface Window {
    workbox: unknown;
  }
}

export function PWAInit() {
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      "serviceWorker" in navigator &&
      window.workbox === undefined
    ) {
      const registerServiceWorker = async () => {
        try {
          const registration = await navigator.serviceWorker.register(
            "/sw.js",
            {
              scope: "/",
              updateViaCache: "none",
            }
          );
          console.log(
            "Service Worker registered with scope:",
            registration.scope
          );
        } catch (error) {
          console.error("Service Worker registration failed:", error);
        }
      };

      registerServiceWorker();
    }
  }, []);

  return null;
}
