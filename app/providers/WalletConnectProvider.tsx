"use client";

import { createContext, useContext, useEffect, useState } from "react";

const projectId = "e11ddbfd74ee9b14a4b56b3912340bb5";

const metadata = {
  name: "Toesjablox DEX",
  description: "De snelste en eerlijkste DEX",
  url: "https://toesjabloxdex.netlify.app",
  icons: ["https://avatars.githubusercontent.com/u/37784886?v=4"],
};

const WalletContext = createContext(null);

export function WalletConnectProvider({ children }) {
  const [client, setClient] = useState(null);
  const [modal, setModal] = useState(null);
  const [session, setSession] = useState(null);

  // Load WalletConnect libraries CLIENT-SIDE ONLY
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const SignClientModule = await import("@walletconnect/sign-client");
        const ModalModule = await import("@walletconnect/modal");

        const SignClient = SignClientModule.default || SignClientModule.SignClient;
        const WalletConnectModal = ModalModule.WalletConnectModal;

        const _client = await SignClient.init({
          projectId,
          metadata,
        });

        const _modal = new WalletConnectModal({
          projectId,
          walletConnectVersion: 2,
          metadata,
        });

        if (mounted) {
          setClient(_client);
          setModal(_modal);
        }
      } catch (err) {
        console.error("WalletConnect failed to load dynamically:", err);
      }
    })();

    return () => {
      mounted = false;
    };
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
