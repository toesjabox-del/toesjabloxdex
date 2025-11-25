"use client";

import { createContext, useContext, useEffect, useState } from "react";

const projectId = "e11ddbfd74ee9b14a4b56b3912340bb5";

const metadata = {
  name: "Toesjablox DEX",
  description: "De snelste en eerlijkste DEX",
  url: "https://toesjablox.dex",
  icons: ["https://avatars.githubusercontent.com/u/37784886?v=4"],
};

const WalletContext = createContext<any>(null);

export function WalletConnectProvider({ children }: { children: React.ReactNode }) {
  const [client, setClient] = useState<any>(null);
  const [modal, setModal] = useState<any>(null);
  const [session, setSession] = useState<any>(null);

  // 🟢 Dynamically load BOTH: WalletConnectModal AND SignClient
  useEffect(() => {
    async function init() {
      // Load SignClient dynamically
      const { default: SignClient } = await import("@walletconnect/sign-client");

      // Load WalletConnectModal dynamically (to avoid bundling issues)
      const { WalletConnectModal } = await import("@walletconnect/modal");

      const _modal = new WalletConnectModal({
        projectId,
        walletConnectVersion: 2,
        metadata,
      });
      setModal(_modal);

      const _client = await SignClient.init({
        projectId,
        metadata,
      });

      setClient(_client);
    }

    init();
  }, []);

  async function connect() {
    if (!client || !modal) return;

    const { uri, approval } = await client.connect({
      requiredNamespaces: {
        eip155: {
          methods: [
            "eth_sendTransaction",
            "personal_sign",
            "eth_sign",
            "eth_signTypedData",
          ],
          chains: ["eip155:1"],
          events: ["chainChanged", "accountsChanged"],
        },
      },
    });

    if (uri) modal.openModal({ uri });

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
