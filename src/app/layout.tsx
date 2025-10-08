import type { Metadata } from "next";
import { Noto_Sans, Noto_Sans_Mono } from "next/font/google";
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
        <nav className="w-full bg-neutral-900 text-white text-center py-3 px-6 shadow">
          <div className="max-w-xl mx-auto text-lg font-bold">Agrimonitor</div>
        </nav>
        <div className="container max-w-screen-xl mx-auto p-4 mb-16">
          {children}
        </div>
      </body>
    </html>
  );
}
