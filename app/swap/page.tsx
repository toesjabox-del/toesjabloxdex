"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar"; // jouw navbar
import { ethers } from "ethers";
import { useWallet } from "@/providers/WalletConnectProvider";

const CHAIN_ID = 56; // BSC
const NATIVE = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";

// ODOS: Quote
async function getQuote(chainId, fromToken, toToken, amount) {
  const res = await fetch("https://api.odos.xyz/sor/quote", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chainId,
      inputTokens: [{ tokenAddress: fromToken, amount }],
      outputTokens: [{ tokenAddress: toToken, proportion: 1 }],
      slippageLimitPercent: 1,
      userAddr: "0x0000000000000000000000000000000000000000",
    }),
  });

  return res.json();
}

// ODOS: Build TX
async function buildTx(chainId, pathId, userAddr) {
  const res = await fetch("https://api.odos.xyz/sor/build", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userAddr,
      pathId,
      chainId,
      simulate: false,
    }),
  });

  return res.json();
}

export default function SwapPage() {
  const { session } = useWallet();

  const [fromToken, setFromToken] = useState(NATIVE);
  const [toToken, setToToken] = useState(
    "0x55d398326f99059fF775485246999027B3197955" // USDT
  );
  const [amount, setAmount] = useState("0.1");
  const [quoteData, setQuoteData] = useState(null);

  // ------- GET WALLET ADDRESS -------
  const address = session
    ? session.namespaces.eip155.accounts[0].split(":")[2]
    : null;

  async function fetchQuote() {
    if (!amount) return alert("Vul een bedrag in.");

    const wei = ethers.parseEther(amount);

    const q = await getQuote(CHAIN_ID, fromToken, toToken, wei.toString());

    setQuoteData(q);
  }

  async function swap() {
    if (!quoteData) return alert("No quote yet.");
    if (!address) return alert("Connect je wallet.");

    const txData = await buildTx(CHAIN_ID, quoteData.pathId, address);

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    const tx = await signer.sendTransaction(txData.transaction);
    await tx.wait();

    alert("Swap Complete!");
  }

  return (
    <div className="min-h-screen bg-[#0a1510] text-white">
      <Navbar />

      <div className="max-w-lg mx-auto mt-16 bg-[#10251a] p-8 rounded-2xl shadow-xl border border-green-800/40">
        <h1 className="text-3xl font-bold text-green-300 mb-8">Swap Tokens</h1>

        {/* Amount Input */}
        <label className="block mb-2 text-green-300">Amount</label>
        <input
          type="text"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full mb-6 p-3 rounded-xl text-black"
        />

        {/* FROM */}
        <label className="block mb-2 text-green-300">From Token</label>
        <input
          type="text"
          value={fromToken}
          onChange={(e) => setFromToken(e.target.value)}
          className="w-full mb-6 p-3 rounded-xl text-black"
        />

        {/* TO */}
        <label className="block mb-2 text-green-300">To Token</label>
        <input
          type="text"
          value={toToken}
          onChange={(e) => setToToken(e.target.value)}
          className="w-full mb-6 p-3 rounded-xl text-black"
        />

        {/* GET QUOTE */}
        <button
          onClick={fetchQuote}
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-black py-3 rounded-xl font-bold mb-6"
        >
          Get Quote
        </button>

        {/* Quote Output */}
        {quoteData && (
          <div className="bg-black/30 p-4 rounded-xl mb-6 border border-green-700/40">
            <p className="text-green-300">
              Output:{" "}
              {quoteData.outAmounts?.length
                ? ethers.formatEther(quoteData.outAmounts[0])
                : "-"}
            </p>
          </div>
        )}

        {/* EXECUTE SWAP */}
        <button
          onClick={swap}
          className="w-full bg-green-600 hover:bg-green-700 py-3 rounded-xl font-bold"
        >
          Swap
        </button>
      </div>
    </div>
  );
}
