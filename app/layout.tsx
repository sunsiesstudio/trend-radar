import type { Metadata, Viewport } from "next";
import { Inter, EB_Garamond, Instrument_Serif } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
const ebGaramond = EB_Garamond({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"], variable: "--font-serif" });
const instrumentSerif = Instrument_Serif({ subsets: ["latin"], weight: "400", variable: "--font-logo" });

export const metadata: Metadata = {
  title: "Martina Soles — UX Researcher & Interaction Designer",
  description: "Cultural intelligence and creative strategy for emerging tech, brands, and speculative projects.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${ebGaramond.variable} ${instrumentSerif.variable}`}>{children}</body>
    </html>
  );
}
