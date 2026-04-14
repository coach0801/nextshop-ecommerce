import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";

export const metadata: Metadata = {
  title: "NextShop | Modern E-Commerce Platform",
  description:
    "A scalable e-commerce platform built with Next.js 14, PostgreSQL, Stripe, and Auth.js",
  keywords: ["e-commerce", "nextjs", "stripe", "online store"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="min-h-screen bg-white text-neutral-900 antialiased">
        {children}
      </body>
    </html>
  );
}
