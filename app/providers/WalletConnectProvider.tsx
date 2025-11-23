"use client";

import { createContext, useContext, useEffect, useState } from "react";
import SignClient from "@walletconnect/sign-client";
import { WalletConnectModal } from "@walletconnect/modal";

const projectId = "e11ddbfd74ee9b14a4b56b3912340bb5";

// Wallet metadata = belangrijk voor Metamask/OKX
const metadata = {
  name: "Toesjablox DEX",
  description: "De snelste en eerlijkste DEX",
  url: "https://toesjablox.dex", // kan nep zijn
  icons: ["https://avatars.githubusercontent.com/u/37784886?v=4"],
};

const modal = new WalletConnectModal({
  projectId,
  walletConnectVersion: 2,
  metadata,
});

const WalletContext = createContext(null);

export function WalletConnectProvider({ children }) {
  const [client, setClient] = useState(null);
  const [session, setSession] = useState(null);

  useEffect(() => {
    async function init() {
      const _client = await SignClient.init({
        projectId,
        metadata,
      });

      setClient(_client);
    }
    init();
  }, []);

  async function connect() {
    if (!client) return;

    const { uri, approval } = await client.connect({
      requiredNamespaces: {
        eip155: {
          methods: [
            "eth_sendTransaction",
            "personal_sign",
            "eth_sign",
            "eth_signTypedData",
          ],
          chains: ["eip155:1"], // Ethereum Mainnet
          events: ["chainChanged", "accountsChanged"],
        },
      },
    });

    if (uri) {
      modal.openModal({ uri });
    }

    const sess = await approval();
    modal.closeModal();
    setSession(sess);

    return sess;
  }

  return (
    <WalletContext.Provider value={{ connect, session }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  return useContext(WalletContext);
}
