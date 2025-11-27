"use client";

import { useState } from "react";
import { ethers } from "ethers";
import { getQuote, buildTx } from "@/lib/odos";

const CHAIN = 56; // BNB Chain
const BNB = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";
const BUSD = "0xe9e7cea3dedca5984780bafc599bd69add087d56";

export default function Swap() {
  const [amount, setAmount] = useState("");
  const [wallet, setWallet] = useState("");

  async function connect() {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const accounts = await provider.send("eth_requestAccounts", []);
    setWallet(accounts[0]);
  }

  async function handleSwap() {
    if (!wallet) return alert("Connect wallet first");

    const amountWei = ethers.parseUnits(amount, 18);

    // 1. Get best route
    const quote = await getQuote(CHAIN, BNB, BUSD, amountWei.toString());

    // 2. Build transaction
    const txData = await buildTx(CHAIN, wallet, quote.pathId);

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    // 3. Send swap
    const tx = await signer.sendTransaction(txData);
    alert("Swap sent! TX hash: " + tx.hash);
  }

  return (
    <div className="p-4 bg-zinc-900 rounded-xl">
      <button
        onClick={connect}
        className="px-4 py-2 mb-4 bg-blue-600 rounded-lg"
      >
        {wallet ? "Connected" : "Connect Wallet"}
      </button>

      <input
        className="block w-full p-2 mb-3 bg-black"
        placeholder="Amount in BNB"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <button
        onClick={handleSwap}
        className="px-4 py-2 bg-green-600 rounded-lg"
      >
        Swap
      </button>
    </div>
  );
}
