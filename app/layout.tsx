import type { Metadata } from "next";
import { Space_Mono } from "next/font/google";
import "./globals.css";

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  variable: "--font-space-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DRUCKER.NG",
  description: "Personal portfolio of Drucker Nguyen",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${spaceMono.variable} h-full`}>
      <body
        className="h-full bg-white text-black overflow-hidden"
        style={{ fontFamily: "var(--font-space-mono), 'Courier New', monospace" }}
      >
        {children}
      </body>
    </html>
  );
}
