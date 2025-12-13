import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { PWAInit } from "@/components/pwa-init";
import { Toaster } from "@/components/ui/sonner";

const poppins = Poppins({
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HealthScore - AI Food Analysis",
  description:
    "Upload food photos and get instant AI-powered nutritional analysis with health scores. Track your meals and improve your diet.",
  keywords: [
    "food",
    "nutrition",
    "health",
    "AI",
    "analysis",
    "diet",
    "calories",
  ],
  authors: [{ name: "HealthScore" }],
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "HealthScore",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    title: "HealthScore - AI Food Analysis",
    description: "Get instant AI-powered nutritional analysis for your meals",
    type: "website",
  },
  icons: {
    icon: [
      { url: "/icons/icon-72x72.png", sizes: "72x72", type: "image/png" },
      { url: "/icons/icon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/icons/icon-128x128.png", sizes: "128x128", type: "image/png" },
      { url: "/icons/icon-144x144.png", sizes: "144x144", type: "image/png" },
      { url: "/icons/icon-152x152.png", sizes: "152x152", type: "image/png" },
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-384x384.png", sizes: "384x384", type: "image/png" },
      { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icons/icon-152x152.png", sizes: "152x152", type: "image/png" },
    ],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#7c3aed",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} antialiased`}>
        <div className="relative flex min-h-screen flex-col bg-background">
          <PWAInit />
          <main className="flex-1">{children}</main>
        </div>
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
