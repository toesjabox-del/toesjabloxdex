"use client";

import Link from "next/link";
import { useWallet } from "../providers/WalletConnectProvider";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import Image from "next/image";

const erc20ABI = [
  "function balanceOf(address owner) view returns (uint)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)"
];

const tokens = [
  {
    address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    symbol: "USDC",
    logo: "https://cryptologos.cc/logos/usd-coin-usdc-logo.png"
  },
  {
    address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    symbol: "USDT",
    logo: "https://cryptologos.cc/logos/tether-usdt-logo.png"
  },
  {
    address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    symbol: "WETH",
    logo: "https://cryptologos.cc/logos/weth-weth-logo.png"
  }
];

export default function Navbar() {
  const { connect, session } = useWallet();
  const [address, setAddress] = useState<string | null>(null);
  const [balances, setBalances] = useState<
    { symbol: string; logo: string; amount: string }[]
  >([]);

  useEffect(() => {
    async function load() {
      if (!session) return;

      const account = session.namespaces.eip155.accounts[0].split(":")[2];
      setAddress(account);

      const provider = new ethers.JsonRpcProvider("https://rpc.ankr.com/eth");

      const results: { symbol: string; logo: string; amount: string }[] = [];

      for (let t of tokens) {
        const contract = new ethers.Contract(t.address, erc20ABI, provider);
        try {
          const bal = await contract.balanceOf(account);
          const dec = await contract.decimals();
          const amt = Number(ethers.formatUnits(bal, dec));

          if (amt > 0) {
            results.push({
              symbol: t.symbol,
              logo: t.logo,
              amount: amt.toFixed(2),
            });
          }
        } catch (err) {
          // ignore token errors
        }
      }

      setBalances(results);
    }

    load();
  }, [session]);

  const menu = [
    { href: "/", label: "Home" },
    { href: "/swap", label: "Swap" },
    { href: "/pools", label: "Pools" },
  ];

  return (
    <nav className="w-full bg-[#0f1d14] border-b border-green-700/30 py-4 px-6 flex justify-between items-center backdrop-blur-xl">
      {/* LOGO (clickable home) */}
      <Link
        href="/"
        className="text-2xl font-bold text-white hover:text-green-400 transition"
      >
        Toesjablox DEX
      </Link>

      {/* MENU */}
      <div className="flex gap-6 text-lg">
        {menu.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="relative group text-white transition"
          >
            {/* Main text (white by default, green on hover) */}
            <span className="relative z-10 group-hover:text-green-400 transition duration-200">
              {item.label}
            </span>

            {/* Hover underline */}
            <span className="absolute left-0 -bottom-1 w-full h-[2px] bg-green-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>

            {/* Glow on hover */}
            <span className="absolute inset-0 bg-green-500/20 blur-xl opacity-0 group-hover:opacity-40 transition duration-300"></span>
          </Link>
        ))}
      </div>

      {/* WALLET / BALANCES */}
      <div className="flex items-center gap-4">
        {!address ? (
          <button
            onClick={connect}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-xl text-white font-semibold shadow-lg shadow-green-700/30 transition"
          >
            Connect Wallet
          </button>
        ) : (
          <div className="flex items-center gap-3">
            <span className="text-green-400 font-semibold">
              {address.slice(0, 6)}...{address.slice(-4)}
            </span>

            <div className="flex gap-2">
              {balances.map((b) => (
                <div
                  key={b.symbol}
                  className="flex items-center gap-1 bg-[#12301e] px-2 py-1 rounded-lg"
                >
                  <Image
                    src={b.logo}
                    width={24}
                    height={24}
                    alt={b.symbol}
                    className="rounded-full"
                  />
                  <span className="text-green-300 text-sm">{b.amount}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
