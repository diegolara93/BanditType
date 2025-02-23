import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/ui/navbar";
import { AuthProvider } from "@/utils/authContext";
import { Atkinson_Hyperlegible } from "next/font/google";
import { MonteCarlo } from "next/font/google";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const atkinsonHyperlegible = Atkinson_Hyperlegible({
  variable: "--font-atkinson-hyperlegible",
  subsets: ["latin"],
  weight: "400"
});

const monteCarlo = MonteCarlo({
  variable: "--font-monte-carlo",
  subsets: ["latin"],
  weight: "400"
});

export const metadata: Metadata = {
  title: "BanditType",
  description: "Typing game",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${atkinsonHyperlegible.className} antialiased bg-[#1e1e2e]`}
      >
       <AuthProvider>
       <NavBar />
       {children}
       </AuthProvider>
      </body>
    </html>
  );
}
