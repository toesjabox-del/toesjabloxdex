"use client";

import Navbar from "../components/Navbar";
import { useState, useEffect } from "react";
import { useWallet } from "../providers/WalletConnectProvider";
import Image from "next/image";

const TOKENS = [

  {
    symbol: "ETH",
    address: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
    logo: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
    decimals: 18,
  },
  {
    symbol: "USDT",
    address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    logo: "https://cryptologos.cc/logos/tether-usdt-logo.png",
    decimals: 6,
  },
  {
    symbol: "USDC",
    address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    logo: "https://cryptologos.cc/logos/usd-coin-usdc-logo.png",
    decimals: 6,
  },
];

export default function SwapPage() {
  const { session } = useWallet();
  const [tokenIn, setTokenIn] = useState(TOKENS[0]);
  const [tokenOut, setTokenOut] = useState(TOKENS[1]);
  const [amount, setAmount] = useState("");
  const [quote, setQuote] = useState(null);
  const [mode, setMode] = useState("aggregator"); // later → “pools”

  const address = session
    ? session.namespaces.eip155.accounts[0].split(":")[2]
    : null;
async function executeSwap() {
  if (!session) return alert("Connect your wallet first");
  if (!quote) return alert("No quote available");

  const chainId = session.namespaces.eip155.chains[0].split(":")[1];

  const from = address;

  const tx = {
    from,
    to: quote.to,               // 0x swap contract
    data: quote.data,           // encoded calldata
    value: quote.value || "0",  // ETH value if needed
    gas: quote.gas || undefined
  };

  try {
    const result = await window.ethereum.request({
      method: "eth_sendTransaction",
      params: [tx],
    });

   alert("Swap sent! Tx hash: " + result);
} catch (err) {
  console.error(err);
  alert("Swap failed: " + err.message);
}
} //  ← DEZE SLOOT JE FUNCTIE NIET AF!

// Get 0x Quote
useEffect(() => {
  async function fetchQuote() {
    if (!amount || !address || mode !== "aggregator") return;

    const amountWei = BigInt(
      Number(amount) * 10 ** tokenIn.decimals
    ).toString();

    const url = `https://api.0x.org/swap/v1/quote?sellToken=${tokenIn.address}&buyToken=${tokenOut.address}&sellAmount=${amountWei}`;

    try {
      const res = await fetch(url);
      const data = await res.json();
      setQuote(data);
    } catch (err) {
      console.log("quote error:", err);
    }
  }

  fetchQuote();
}, [amount, tokenIn, tokenOut, mode, address]);

  
     return (
    <main className="bg-[#0b0f0c] min-h-screen text-white">
      <Navbar />

      <div className="flex justify-center mt-20">
        <div className="bg-[#122018] p-6 rounded-2xl w-[420px] shadow-lg border border-green-700/30">

          {/* MODE SELECTOR */}
          <div className="flex justify-between mb-4">
            <button
              onClick={() => setMode("aggregator")}
              className={`px-3 py-1 rounded-xl ${
                mode === "aggregator"
                  ? "bg-green-600 text-white"
                  : "bg-[#1a2e22] text-green-300"
              }`}
            >
              Aggregator
            </button>

            <button
              onClick={() => setMode("pools")}
              className={`px-3 py-1 rounded-xl ${
                mode === "pools"
                  ? "bg-green-600 text-white"
                  : "bg-[#1a2e22] text-green-300"
              }`}
            >
              Pools
            </button>
          </div>

          {/* TITLE */}
          <h1 className="text-2xl font-bold text-green-300 mb-6 text-center">
            Swap
          </h1>

          {/* INPUT BOX */}
          <div className="bg-[#0f1a14] p-4 rounded-xl border border-green-700/30 mb-4">
            <div className="flex justify-between mb-1 text-gray-400 text-sm">
              <span>From</span>
            </div>

            <div className="flex items-center justify-between">
              <input
                type="number"
                placeholder="0.0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="bg-transparent outline-none text-2xl w-full"
              />

              <select
                value={tokenIn.symbol}
                onChange={(e) =>
                  setTokenIn(TOKENS.find((t) => t.symbol === e.target.value))
                }
                className="bg-[#1c3227] border border-green-700/40 px-2 py-1 rounded-lg"
              >
                {TOKENS.map((t) => (
                  <option key={t.symbol}>{t.symbol}</option>
                ))}
              </select>
            </div>
          </div>

          {/* OUTPUT BOX */}
          <div className="bg-[#0f1a14] p-4 rounded-xl border border-green-700/30 mb-6">
            <div className="flex justify-between mb-1 text-gray-400 text-sm">
              <span>To</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-2xl">
                {quote ? Number(quote.buyAmount / 10 ** tokenOut.decimals).toFixed(6) : "0.0"}
              </div>

              <select
                value={tokenOut.symbol}
                onChange={(e) =>
                  setTokenOut(TOKENS.find((t) => t.symbol === e.target.value))
                }
                className="bg-[#1c3227] border border-green-700/40 px-2 py-1 rounded-lg"
              >
                {TOKENS.map((t) => (
                  <option key={t.symbol}>{t.symbol}</option>
                ))}
              </select>
            </div>
          </div>

          {/* SWAP BUTTON */}
          <button
            onClick={executeSwap}
            disabled={!quote}
            className={`w-full py-3 rounded-xl text-lg font-semibold transition ${
              quote
                ? "bg-green-600 hover:bg-green-700 text-white"
                : "bg-gray-600 text-gray-400 cursor-not-allowed"
            }`}
          >
            {quote ? "Swap" : "Enter amount"}
          </button>
        </div>
      </div>
    </main>
  );
}
