import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Trend Radar",
  description: "Emerging signal intelligence for brand consulting",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} bg-gray-50 text-gray-900 h-full`}>
        <nav className="h-14 bg-white border-b flex items-center px-6 gap-8 sticky top-0 z-40">
          <Link href="/" className="flex items-center gap-1.5 font-bold text-indigo-600 text-sm">
            ⚡ Trend Radar
          </Link>
          <div className="flex items-center gap-6 text-sm font-medium">
            <Link href="/feed" className="text-gray-600 hover:text-gray-900 transition-colors">Feed</Link>
            <Link href="/canvas" className="text-gray-600 hover:text-gray-900 transition-colors">Canvas</Link>
            <Link href="/reports" className="text-gray-600 hover:text-gray-900 transition-colors">Reports</Link>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
