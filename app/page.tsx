"use client";

import Navbar from "./components/Navbar";
import AnimatedLetters from "./components/AnimatedLetters";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0b0f0c]">
      <Navbar />

      <div className="flex flex-col items-center mt-24 px-6">

        {/* Animated Title */}
        <AnimatedLetters text="Welkom bij Toesjablox DEX" />

        {/* Animated Subtitle */}
        <AnimatedLetters 
          text="De snelste, goedkoopste en eerlijkste DEX met pools, swaps en bridging."
          className="text-gray-300 max-w-xl text-center mt-4 text-xl"
        />

      </div>
    </main>
  );
}
