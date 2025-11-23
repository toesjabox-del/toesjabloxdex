import "./globals.css";
import { WalletConnectProvider } from "./providers/WalletConnectProvider";
import BackgroundGlow from "./components/BackgroundGlow";
import PageAnimation from "./components/PageAnimation";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="relative">
        <BackgroundGlow />

        <WalletConnectProvider>
          <PageAnimation>{children}</PageAnimation>
        </WalletConnectProvider>
      </body>
    </html>
  );
}
