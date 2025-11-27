// /lib/odos.ts
import axios from "axios";

const ODOS_API = "https://api.odos.xyz";

/**
 * Get quote from ODOS
 * chainId: number (56 = BSC)
 * from: tokenAddress or native placeholder
 * to: tokenAddress
 * amount: string (amount in base units, e.g. wei)
 */
export async function getQuote(chainId: number, from: string, to: string, amount: string) {
  const res = await axios.post(`${ODOS_API}/sor/quote`, {
    chainId,
    inputTokens: [{ tokenAddress: from, amount }],
    outputTokens: [{ tokenAddress: to, proportion: 1 }],
    slippageLimitPercent: 1,
  }, { headers: { "Content-Type": "application/json" } });

  return res.data;
}

/**
 * Build a transaction for execution
 * chainId: number
 * userAddr: string (your wallet)
 * pathId: string (from getQuote response)
 */
export async function buildTx(chainId: number, userAddr: string, pathId: string) {
  const res = await axios.post(`${ODOS_API}/sor/assemble`, {
    chainId,
    sender: userAddr,
    receiver: userAddr,
    pathId,
  }, { headers: { "Content-Type": "application/json" } });

  return res.data.transaction; // should contain { to, data, value, gas, ... }
}
