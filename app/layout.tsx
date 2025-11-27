import "./globals.css";
import { WalletConnectProvider } from "./providers/WalletConnectProvider";
import { NotificationProvider } from "./providers/NotificationProvider";
import BackgroundGlow from "./components/BackgroundGlow";
import PageAnimation from "./components/PageAnimation";
import DiscoEffect from "@/components/DiscoEffect";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="relative">
        <BackgroundGlow />
        <DiscoEffect />   {/* ← HIER TOEVOEGEN */}

        <WalletConnectProvider>
          <NotificationProvider>
            <PageAnimation>
              {children}
            </PageAnimation>
          </NotificationProvider>
        </WalletConnectProvider>
      </body>
    </html>
  );
}
