"use client";

import React, { useState } from "react";

export default function SendNotificationPage() {
  // ----- SIMPLE PASSWORD GATE -----
  const [inputPw, setInputPw] = useState("");
  const [allowed, setAllowed] = useState(false);

  function checkPassword() {
    if (inputPw === "ADMINDEVROEL") {
      setAllowed(true);
    } else {
      alert("Incorrect password");
    }
  }

  // ----- ADMIN STATE -----
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function send() {
    setLoading(true);
    try {
      const res = await fetch("/api/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      const json = await res.json();
      console.log("/api/notify response", json);
      setMessage("");
    } catch (err) {
      console.error("send error", err);
      alert("Send failed: " + String(err));
    } finally {
      setLoading(false);
    }
  }

  async function startDisco() {
    setLoading(true);
    try {
      const res = await fetch("/api/disco/start", { method: "POST" });
      const json = await res.json();
      console.log("/api/disco/start", json);
    } catch (err) {
      console.error("startDisco error", err);
      alert("Start failed: " + String(err));
    } finally {
      setLoading(false);
    }
  }

  async function stopDisco() {
    setLoading(true);
    try {
      const res = await fetch("/api/disco/stop", { method: "POST" });
      const json = await res.json();
      console.log("/api/disco/stop", json);
    } catch (err) {
      console.error("stopDisco error", err);
      alert("Stop failed: " + String(err));
    } finally {
      setLoading(false);
    }
  }

  // ---------- PASSWORD SCREEN ----------
  if (!allowed) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="p-6 border rounded-lg shadow bg-white space-y-4">
          <h1 className="text-xl font-bold text-center">Admin Login</h1>
          <input
            type="password"
            placeholder="Password..."
            className="border p-2 w-full"
            value={inputPw}
            onChange={(e) => setInputPw(e.target.value)}
          />
          <button
            onClick={checkPassword}
            className="w-full bg-blue-500 text-white p-2 rounded"
          >
            Enter
          </button>
        </div>
      </div>
    );
  }

  // ---------- ADMIN PANEL ----------
  return (
    <div className="p-8 space-y-6">
      <h1 className="text-xl font-bold">Admin Dashboard</h1>

      <div>
        <h2 className="font-semibold mb-2">Send Global Notification</h2>

        <input
          className="border p-2 w-full"
          placeholder="Type message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <button
          className="mt-3 px-4 py-2 bg-blue-500 text-white rounded"
          onClick={send}
          disabled={loading}
        >
          {loading ? "Sending..." : "Send Notification"}
        </button>
      </div>

      <div className="pt-6 border-t">
        <h2 className="font-semibold mb-3">Disco Event</h2>

        <div className="flex gap-4">
          <button
            className="px-4 py-2 bg-pink-500 text-white rounded"
            onClick={startDisco}
            disabled={loading}
          >
            Start Disco
          </button>

          <button
            className="px-4 py-2 bg-gray-700 text-white rounded"
            onClick={stopDisco}
            disabled={loading}
          >
            Stop Disco
          </button>
        </div>
      </div>
    </div>
  );
}
