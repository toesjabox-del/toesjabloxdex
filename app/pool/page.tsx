"use client";

import Navbar from "../components/Navbar";

export default function PoolsPage() {
  return (
    <main className="min-h-screen bg-[#0b0f0c] text-white">
      <Navbar />

      <div className="flex flex-col items-center mt-20">
        <h1 className="text-4xl font-bold text-green-400 mb-4">
          Liquidity Pools
        </h1>

        <p className="text-green-200 text-lg">
          Pools functionaliteit komt hier later. 🔧
        </p>
      </div>
    </main>
  );
}
