"use client";

import { PrivyProvider } from "@privy-io/react-auth";
import React from "react";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ""}
      config={{
        loginMethods: ["email", "google", "wallet"],
        appearance: {
          theme: "dark",
          accentColor: "#DD1A21",
          logo: "/PathTrick.png",
        },
      }}
    >
      {children}
    </PrivyProvider>
  );
}
