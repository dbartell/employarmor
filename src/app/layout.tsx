import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "EmployArmor - Your AI Compliance Agent",
    template: "%s | EmployArmor",
  },
  description: "Your AI compliance agent that monitors your hiring tools and keeps you compliant with Colorado, Illinois, NYC, and beyond. 24/7 protection from AI hiring law violations.",
  keywords: ["AI hiring law", "AI hiring compliance", "Colorado AI Act", "Illinois AIPA", "NYC Local Law 144", "automated employment decisions", "AEDT compliance", "AI compliance agent"],
  metadataBase: new URL("https://employarmor.com"),
  openGraph: {
    title: "EmployArmor - Your AI Compliance Agent",
    description: "Your AI compliance agent that monitors your hiring tools and keeps you compliant. 24/7 protection from AI hiring law violations.",
    url: "https://employarmor.com",
    siteName: "EmployArmor",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "EmployArmor - Your AI Compliance Agent",
    description: "Your AI compliance agent that monitors your hiring tools and keeps you compliant. 24/7 protection from AI hiring law violations.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <GoogleAnalytics />
        {children}
      </body>
    </html>
  );
}
