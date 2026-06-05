import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GARAGE",
  description:
    "GARAGE is an advertising agency built from the original startup-room spirit: scrappy, sharp, and ready to build iconic work."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
