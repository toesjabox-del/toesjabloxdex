"use client";

import { useEffect } from "react";
import Pusher from "pusher-js";
import { Toaster, toast } from "react-hot-toast";

const pingSound = typeof Audio !== "undefined"
  ? new Audio("/ping.mp3")
  : null;

export function NotificationProvider({ children }) {
  useEffect(() => {
    console.log("📡 Connecting to Pusher...");

    const pusher = new Pusher("a0ca769eea1d4c26d81f", {
      cluster: "eu",
      forceTLS: true,
    });

    const channel = pusher.subscribe("global-channel");

    channel.bind("notification", (data) => {
      console.log("📩 Notification received:", data);

      if (pingSound) {
        pingSound.currentTime = 0;
        pingSound.play().catch(() => {});
      }

      toast(data.message, { duration: 8000 });
    });

    return () => pusher.unsubscribe("global-channel");
  }, []);

  return (
    <>
      <Toaster position="top-right" />
      {children}
    </>
  );
}
