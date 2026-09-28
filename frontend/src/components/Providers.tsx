"use client";

import { PrivyProvider } from "@privy-io/react-auth";
import { WagmiProvider } from "@privy-io/wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { wagmiConfig } from "@/config/wagmi";
import DevPanel from "@/components/ui/DevPanel";
import { useAuthSync } from "@/hooks/useAuthSync";

import { bscTestnet } from "viem/chains";

const queryClient = new QueryClient();

// Must be inside PrivyProvider to call usePrivy hooks
function AuthSyncMounter() {
  useAuthSync();
  return null;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ""}
      config={{
        defaultChain: bscTestnet,
        supportedChains: [bscTestnet],
        loginMethods: ["email", "google", "wallet"],
        appearance: {
          theme: "dark",
          accentColor: "#DD1A21",
          logo: "/PathTrick.png",
        },
        embeddedWallets: {
          ethereum: {
            createOnLogin: "users-without-wallets",
          },
        },
      }}
    >
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={wagmiConfig}>
          <>
            <AuthSyncMounter />
            {children}
            <DevPanel />
          </>
        </WagmiProvider>
      </QueryClientProvider>
    </PrivyProvider>
  );
}
