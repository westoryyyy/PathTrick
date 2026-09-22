import type { Metadata } from "next";
import { Press_Start_2P, Inter, Pixelify_Sans, VT323 } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

const pressStart2P = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-pixel",
});

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const pixelifySans = Pixelify_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-pixelify",
});

const vt323 = VT323({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-vt323",
});

export const metadata: Metadata = {
  title: "PathTrick — Discover Your Path, Build Your Future",
  description: "Explore, master skills, and unlock new career opportunities with PathTrick — the gamified AI-powered career roadmap platform.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${pressStart2P.variable} ${inter.variable} ${pixelifySans.variable} ${vt323.variable}`}>
      <body style={{ fontFamily: "var(--font-inter), sans-serif" }}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
