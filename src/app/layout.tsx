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
    default: "EmployArmor - AI Hiring Compliance, Automated",
    template: "%s | EmployArmor",
  },
  description: "EmployArmor connects to your hiring tools and automates compliance with AI hiring laws in Colorado, Illinois, NYC, California and beyond. Track obligations, generate notices, monitor risks.",
  keywords: ["AI hiring law", "AI hiring compliance", "Colorado AI Act", "Illinois AIPA", "NYC Local Law 144", "automated employment decisions", "AEDT compliance", "AI compliance agent"],
  metadataBase: new URL("https://employarmor.com"),
  openGraph: {
    title: "EmployArmor - AI Hiring Compliance, Automated",
    description: "EmployArmor connects to your hiring tools and automates compliance with AI hiring laws in Colorado, Illinois, NYC, California and beyond.",
    url: "https://employarmor.com",
    siteName: "EmployArmor",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "EmployArmor - AI Hiring Compliance, Automated",
    description: "EmployArmor connects to your hiring tools and automates compliance with AI hiring laws in Colorado, Illinois, NYC, California and beyond.",
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
