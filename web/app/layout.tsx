import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Marketing Agent",
  description: "Your AI Growth Partner for MiniGames",
};

import { BottomNav } from "@/components/ui/bottom-nav";
import { CommandPalette } from "@/components/ui/command-palette";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased bg-obsidian text-white min-h-screen selection:bg-indigo-500/30`}
      >
        <div className="fixed inset-0 pointer-events-none z-[-1]">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-obsidian to-cyan-900/20 opacity-50 blur-3xl animate-pulse" />
        </div>
        <CommandPalette />
        {children}
        <BottomNav />
      </body>
    </html>
  );
}
