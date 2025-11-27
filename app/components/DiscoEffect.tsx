"use client";

import { useEffect, useRef, useState } from "react";
import { pusherClient } from "../pusher-client"; // relative import from app/components -> app/pusher-client.ts

export default function DiscoEffect() {
  const [active, setActive] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const tacoIntervalRef = useRef<number | null>(null);
  const beatIntervalRef = useRef<number | null>(null);

  // spawn single taco
  const spawnTaco = () => {
    const taco = document.createElement("div");
    taco.className = "taco-confetti";
    taco.innerText = "🌮";
    taco.style.left = Math.random() * 100 + "vw";
    taco.style.fontSize = Math.floor(Math.random() * 28 + 18) + "px";
    taco.style.opacity = String(Math.random() * 0.6 + 0.4);
    taco.style.transform = `rotate(${Math.random() * 360}deg)`;
    taco.style.animationDuration = Math.random() * 1.8 + 2.2 + "s";

    document.body.appendChild(taco);
    // remove after animation end (safe fallback)
    setTimeout(() => {
      taco.remove();
    }, 7000);
  };

  // start/stop taco rain
  const startTacoRain = () => {
    // spawn fast but not too heavy
    tacoIntervalRef.current = window.setInterval(spawnTaco, 120);
  };
  const stopTacoRain = () => {
    if (tacoIntervalRef.current) {
      clearInterval(tacoIntervalRef.current);
      tacoIntervalRef.current = null;
    }
  };

  // pusher subscribe
  useEffect(() => {
    const channel = pusherClient.subscribe("disco");

    channel.bind("toggle", (data: any) => {
      // expect { active: true/false }
      setActive(Boolean(data?.active));
    });

    // cleanup
    return () => {
      try {
        channel.unbind_all?.();
        pusherClient.unsubscribe("disco");
      } catch (e) {}
    };
  }, []);

  // audio + taco + beat handling
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio("/tacos.mp3"); // your file in public/tacos.mp3
      audioRef.current.volume = 0.6;
      audioRef.current.loop = false; // stop when finished
    }

    if (active) {
      // start audio
      audioRef.current.play().catch(() => {});

      // start taco rain
      startTacoRain();

      // soft beat shake synced roughly to tempo (~600ms)
      beatIntervalRef.current = window.setInterval(() => {
        document.body.classList.add("shake-beat");
        setTimeout(() => document.body.classList.remove("shake-beat"), 140);
      }, 600);

      // when audio ends -> stop everything
      audioRef.current.onended = () => {
        setActive(false);
      };
    } else {
      // stop playback & effects
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      stopTacoRain();
      if (beatIntervalRef.current) {
        clearInterval(beatIntervalRef.current);
        beatIntervalRef.current = null;
        document.body.classList.remove("shake-beat");
      }
    }

    return () => {
      // cleanup intervals on unmount
      stopTacoRain();
      if (beatIntervalRef.current) {
        clearInterval(beatIntervalRef.current);
        beatIntervalRef.current = null;
      }
    };
  }, [active]);

  if (!active) return null;

  return (
    <>
      {/* Soft flashes */}
      <div className="pointer-events-none fixed inset-0 z-[9999] disco-flash" />

      {/* Discobal */}
      <div className="fixed left-1/2 top-0 z-[10000] -translate-x-1/2 disco-ball-container">
        <div className="disco-ball" />
      </div>

      <style jsx>{`
        /* taco confetti (DOM nodes created dynamically) */
        .taco-confetti {
          position: fixed;
          top: -40px;
          will-change: transform, opacity;
          pointer-events: none;
          z-index: 12000;
          animation-name: tacoFall;
          animation-timing-function: linear;
        }
        @keyframes tacoFall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(120vh) rotate(360deg); opacity: 0; }
        }
        /* The dynamic items control duration inline via style.animationDuration */

        /* soft disco flash */
        @keyframes flashSmooth {
          0% { background: rgba(255, 0, 150, 0.12); }
          25% { background: rgba(0, 150, 255, 0.12); }
          50% { background: rgba(0, 255, 150, 0.12); }
          75% { background: rgba(255, 255, 0, 0.12); }
          100% { background: rgba(255, 0, 150, 0.12); }
        }
        .disco-flash {
          animation: flashSmooth 6s ease-in-out infinite;
          backdrop-filter: blur(0px); /* keep site visible */
        }

        /* disco ball */
        @keyframes ballDrop {
          0% { transform: translate(-50%, -200px) scale(0.6); opacity: 0; }
          70% { opacity: 1; }
          100% { transform: translate(-50%, 80px) scale(1); opacity: 1; }
        }
        @keyframes ballSpin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .disco-ball-container {
          width: 140px;
          height: 140px;
          animation: ballDrop 1.2s ease-out forwards;
          pointer-events: none;
        }
        .disco-ball {
          width: 140px;
          height: 140px;
          border-radius: 50%;
          background: radial-gradient(circle at 30% 30%, #fff, #cfcfcf 30%, #999 70%);
          background-image:
            linear-gradient(0deg, rgba(255,255,255,0.35) 50%, transparent 50%),
            linear-gradient(90deg, rgba(255,255,255,0.35) 50%, transparent 50%);
          background-size: 14px 14px;
          box-shadow:
            0 0 30px rgba(255,255,255,0.6),
            0 0 60px rgba(255, 0, 200, 0.18),
            0 0 80px rgba(0, 180, 255, 0.12);
          animation: ballSpin 4.5s linear infinite;
        }

        /* soft beat shake */
        @keyframes shakeSoft {
          0% { transform: translateX(0); }
          25% { transform: translateX(-6px); }
          50% { transform: translateX(6px); }
          75% { transform: translateX(-4px); }
          100% { transform: translateX(0); }
        }
        .shake-beat {
          animation: shakeSoft 0.15s ease;
        }
      `}</style>
    </>
  );
}
