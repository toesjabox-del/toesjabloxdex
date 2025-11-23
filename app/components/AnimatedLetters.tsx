"use client";

import { motion } from "framer-motion";

export default function AnimatedLetters({ text = "" }) {
  const safeText = typeof text === "string" ? text : "";
  const letters = safeText.split("");

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.9,
        ease: [0.16, 1, 0.3, 1], // Smooth Uniswap easing
      }}
      className="flex flex-wrap gap-1"
    >
      {letters.map((letter, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: index * 0.03, // sneller & meer wave
            duration: 0.45,
            ease: [0.16, 1, 0.3, 1], // zelfde easing als Uniswap
          }}
          className="text-green-300 drop-shadow-[0_0_8px_rgb(34,197,94)]"
        >
          {letter === " " ? "\u00A0" : letter}
        </motion.span>
      ))}
    </motion.div>
  );
}
