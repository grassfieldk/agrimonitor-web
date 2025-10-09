import type { Metadata } from "next";
import { Noto_Sans, Noto_Sans_Mono } from "next/font/google";
import Navbar from "@/components/Navbar";
import "./globals.css";

const notoSans = Noto_Sans({
  variable: "--font-noto-sans",
  subsets: ["latin"],
});

const notoMono = Noto_Sans_Mono({
  variable: "--font-noto-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Agrimonitor",
  description: "Agrimonitor",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${notoSans.variable} ${notoMono.variable} antialiased`}>
        <Navbar />
        <div className="container max-w-screen-xl mx-auto p-4 mb-16 pt-20">
          {children}
        </div>
      </body>
    </html>
  );
}
