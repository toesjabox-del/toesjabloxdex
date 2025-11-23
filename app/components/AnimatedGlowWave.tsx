"use client";

import { motion } from "framer-motion";

export default function AnimatedGlowWave({ text }) {
  const letters = text.split("");

  return (
    <div className="flex flex-wrap gap-[2px]">
      {letters.map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 25 }}
          animate={{
            opacity: 1,
            y: [0, -8, 0],
            textShadow: [
              "0px 0px 0px rgba(34,197,94,0)",
              "0px 0px 12px rgba(34,197,94,0.8)",
              "0px 0px 0px rgba(34,197,94,0)"
            ]
          }}
          transition={{
            delay: i * 0.06,
            duration: 1.2,
            repeat: Infinity,
            repeatType: "loop",
            ease: "easeInOut"
          }}
          className="text-green-300 text-4xl font-bold"
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </div>
  );
}
