import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "@reactflow/core/dist/style.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NoCode AI Agent",
  description: "Build AI agents without coding",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
