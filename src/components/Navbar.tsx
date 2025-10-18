"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "./ui/Button";

export default function Navbar() {
  const isTopPage = usePathname() === "/";
  const title = process.env.NEXT_PUBLIC_TITLE || "Agrimonitor";

  return (
    <nav className="fixed top-0 left-0 w-full bg-foreground backdrop-blur-xs text-light py-2 px-4 shadow">
      <div className="max-w-screen-xl mx-auto md:px-4 flex items-center justify-between">
        <div className="flex items-center">
          {!isTopPage && (
            <Link
              href="/"
              className="text-sm hover:text-white transition-colors"
            >
              戻る
            </Link>
          )}
        </div>
        <div className="flex-1 flex items-center justify-center">
          <Link
            href="/"
            className="absolute left-1/2 transform -translate-x-1/2 text-lg font-bold"
          >
            {title}
          </Link>
        </div>
        <div className="flex items-center">
          <Button
            href="/admin/vegetables"
            className="px-4 py-2 bg-neutral-700 hover:bg-neutral-600 rounded text-sm font-medium transition-colors"
          >
            設定
          </Button>
        </div>
      </div>
    </nav>
  );
}
