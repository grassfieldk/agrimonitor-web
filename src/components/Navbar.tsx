"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "./ui/Button";

export default function Navbar() {
  const isTopPage = usePathname() === "/";
  const title = process.env.NEXT_PUBLIC_TITLE || "Agrimonitor";

  return (
    <nav className="fixed top-0 left-0 w-full bg-foreground backdrop-blur-xs text-light shadow z-10">
      <div className="max-w-screen-xl mx-auto flex items-center px-4 py-2">
        <div className="w-16">
          {!isTopPage && (
            <Button
              href="/"
              variant="text"
              icon="prev"
              className="text-light hover:text-light-sub"
            >
              戻る
            </Button>
          )}
        </div>
        <div className="flex-1">
          <h1 className="flex items-center justify-center">
            <Link href="/">{title}</Link>
          </h1>
        </div>
        <div className="w-16">
          <Button href="/admin/vegetables">設定</Button>
        </div>
      </div>
    </nav>
  );
}
