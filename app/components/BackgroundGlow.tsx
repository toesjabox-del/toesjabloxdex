"use client";
import { useEffect, useState } from "react";

export default function BackgroundGlow() {
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const move = (e: MouseEvent) => {
      setPos({
        x: e.clientX,
        y: e.clientY,
      });
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      {/* Grote groene glow die de muis volgt */}
      <div
        className="absolute w-[500px] h-[500px] bg-green-600 opacity-20 blur-[180px] rounded-full transition-transform duration-300"
        style={{
          transform: `translate(${pos.x - 250}px, ${pos.y - 250}px)`,
        }}
      />

      {/* Zachte floating glow */}
      <div className="absolute top-1/2 left-1/3 w-[600px] h-[600px] bg-emerald-500 opacity-10 blur-[200px] rounded-full animate-pulse" />

      {/* Onderkant glow */}
      <div className="absolute -bottom-40 right-0 w-[400px] h-[400px] bg-green-700 opacity-20 blur-[150px] rounded-full animate-pulse" />
    </div>
  );
}
