import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Augmented Culture",
  description: "Where emerging tech meets fashion, beauty, and lifestyle — by Augmented Rarity",
};

export default function RadarLayout({ children }: { children: React.ReactNode }) {
  return children;
}
