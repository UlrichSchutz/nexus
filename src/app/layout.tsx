import type { Metadata } from "next";
import { DM_Serif_Display, Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const dmSerif = DM_Serif_Display({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-dm-serif",
});

export const metadata: Metadata = {
  title: "Nexus Tech CH | Crypto Recovery & Wealth Management",
  description:
    "Blockchain forensics, crypto recovery assistance and wealth management from Bern, Switzerland.",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className="scroll-smooth">
      <body className={`${inter.variable} ${dmSerif.variable} font-sans`}>{children}</body>
    </html>
  );
}
