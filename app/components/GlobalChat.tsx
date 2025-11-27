"use client";

import { useEffect, useState } from "react";
import { pusherClient } from "@/app/pusher-client";

export default function GlobalChat() {
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    const channel = pusherClient.subscribe("global");

    channel.bind("new_message", (data: any) => {
      setMessages((prev) => [...prev, data.message]);
    });

    return () => {
      pusherClient.unsubscribe("global");
    };
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-[99999] w-64 bg-black/60 text-white p-3 rounded-xl backdrop-blur-md">
      <h2 className="font-bold text-sm mb-2">Global Chat</h2>

      <div className="h-32 overflow-y-auto text-xs space-y-1">
        {messages.map((msg, i) => (
          <div key={i} className="p-1 bg-white/10 rounded">
            {msg}
          </div>
        ))}
      </div>
    </div>
  );
}
