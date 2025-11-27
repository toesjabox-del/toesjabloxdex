import axios from "axios";

const API = "https://api.1inch.dev/swap/v6.0";
const CHAIN = 56; // BNB Chain

export async function getQuote(fromToken, toToken, amount) {
  const res = await axios.get(`${API}/${CHAIN}/quote`, {
    params: {
      src: fromToken,
      dst: toToken,
      amount,
    },
    headers: {
      Authorization: `Bearer YOUR_1INCH_API_KEY`,
    },
  });

  return res.data;
}

export async function buildSwap(fromToken, toToken, amount, wallet) {
  const res = await axios.get(`${API}/${CHAIN}/swap`, {
    params: {
      src: fromToken,
      dst: toToken,
      amount,
      from: wallet,
      slippage: 1,
    },
    headers: {
      Authorization: `Bearer YOUR_1INCH_API_KEY`,
    },
  });

  return res.data;
}
