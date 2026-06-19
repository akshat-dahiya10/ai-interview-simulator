import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import Background from "@/components/Background";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "MockMind — Crack Interviews with AI",
  description:
    "Practice real interview questions and get instant, expert-level AI feedback. Land your next offer.",
  keywords: [
    "AI interview simulator",
    "mock interview",
    "interview prep",
    "AI feedback",
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased selection:bg-brand-600/40">
        <Background />
        {children}
      </body>
    </html>
  );
}
