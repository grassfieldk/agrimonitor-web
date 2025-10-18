import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import "./globals.css";

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
      <body>
        <Navbar />
        <div className="container max-w-screen-xl mx-auto p-4 mb-16 pt-20">
          {children}
        </div>
      </body>
    </html>
  );
}
