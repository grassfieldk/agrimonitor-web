"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const isTopPage = pathname === "/";

  return (
    <nav className="fixed top-0 left-0 w-full bg-neutral-900/80 backdrop-blur-xs text-white py-3 px-6 shadow z-50">
      <div className="max-w-screen-xl mx-auto md:px-4 flex items-center justify-between">
        <div className="flex-1 flex items-center">
          {!isTopPage && (
            <Link
              href="/"
              className="text-sm text-neutral-300 hover:text-white transition-colors"
            >
              トップに戻る
            </Link>
          )}
        </div>
        <div className="flex-1 flex items-center justify-center">
          <Link href="/" className="text-lg font-bold hover:text-neutral-300">
            Agrimonitor
          </Link>
        </div>
        <div className="flex-1 flex items-center justify-end">
          <Link
            href="/admin/vegetables"
            className="px-4 py-2 bg-neutral-700 hover:bg-neutral-600 rounded text-sm font-medium transition-colors"
          >
            設定
          </Link>
        </div>
      </div>
    </nav>
  );
}
