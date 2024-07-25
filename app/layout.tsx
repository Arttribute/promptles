import type { Metadata } from "next";
import { Chakra_Petch } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import MagicProvider from "@/components/providers/MagicProvider";
import MinipayProvider from "@/components/providers/MinipayProvider";

const chakra_petch = Chakra_Petch({
  weight: ["300", "400", "500", "600"],
  subsets: ["latin"],
  display: "swap",
  fallback: ["Helvetica", "Arial", "sans-serif"],
});

export const metadata: Metadata = {
  title: "Promptles",
  description: "The AI Art guessing game",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={chakra_petch.className}>
        <MagicProvider>
          <MinipayProvider>
            {" "}
            {children} <Analytics />
          </MinipayProvider>
        </MagicProvider>
      </body>
    </html>
  );
}
