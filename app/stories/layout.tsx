import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Stories",
  description: "Cultural stories from Tunisia — the blue doors of Sidi Bou Said, the underground houses of Matmata, the ancient olive groves of the Sahel, and the living traditions that make Tunisia unforgettable.",
};

export default function StoriesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
