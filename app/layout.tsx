import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const detroit = localFont({
  src: "./fonts/Detroit-05Base.otf",
  variable: "--font-detroit",
  display: "swap"
});

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
      <body className={detroit.variable}>{children}</body>
    </html>
  );
}
