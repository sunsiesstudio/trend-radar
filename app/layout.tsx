import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Trend Radar",
  description: "Emerging signal intelligence for brand consulting",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full flex`}>
        <Sidebar />
        <main className="flex-1 min-h-full overflow-auto">{children}</main>
      </body>
    </html>
  );
}
