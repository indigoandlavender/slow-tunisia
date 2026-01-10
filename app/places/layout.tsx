import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Places",
  description: "Discover Tunisia's most captivating places — from the white-and-blue villages of the north to the desert oases of the south, the ancient medinas and the hidden corners that most visitors never find.",
};

export default function PlacesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
