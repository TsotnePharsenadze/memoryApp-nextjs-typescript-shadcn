import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { SessionProvider } from "next-auth/react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// openGraph: {
//   title: "MemoryApp - Train Your Brain",
//   description:
//     "Challenge yourself with MemoryApp, the ultimate tool for enhancing memory skills with customizable options.",
//   url: "https://your-app-url.com",
//   siteName: "MemoryApp",
//   images: [
//     {
//       url: "https://your-app-url.com/og-image.jpg",
//       width: 1200,
//       height: 630,
//       alt: "MemoryApp - Train Your Brain",
//     },
//   ],
//   locale: "en_US",
//   type: "website",
// },
// twitter: {
//   card: "summary_large_image",
//   title: "MemoryApp - Train Your Brain",
//   description:
//     "Train your brain with MemoryApp by memorizing random numbers, cards, images, and words. Customize challenges for endless fun!",
//   images: ["https://your-app-url.com/twitter-image.jpg"],
// },

export const metadata: Metadata = {
  title: "MemoryApp - Train Your Brain",
  description:
    "MemoryApp helps you improve your memory by training with random numbers, cards, images, and words. Customize your challenges and track your progress.",
  keywords: [
    "memory training",
    "brain games",
    "memory improvement",
    "random numbers",
    "memorization",
    "cognitive skills",
    "custom challenges",
  ],
  authors: [
    { name: "Tsotne Pharsenadze", url: "https://github.com/TsotnePharsenadze" },
  ],
  applicationName: "MemoryApp",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
  robots: "index, follow",
  themeColor: "#3b82f6",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-blue-50`}
      >
        <SessionProvider>
          <Header homeHref="/" />
          <div className="min-h-screen p-2 sm:p-6">{children}</div>
        </SessionProvider>
      </body>
    </html>
  );
}
