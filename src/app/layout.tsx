import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  variable: "--font-inter",
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
  openGraph: {
    title: "HealthScore - AI Food Analysis",
    description: "Get instant AI-powered nutritional analysis for your meals",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <div className="relative flex min-h-screen flex-col bg-background">
          <Navbar />
          <main className="flex-1">{children}</main>
          <footer className="border-t py-6 md:py-0">
            <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 md:h-16 md:flex-row">
              <p className="text-muted-foreground text-sm">
                Powered by{" "}
                <span className="bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text font-semibold text-transparent">
                  Google Gemini AI
                </span>
              </p>
              <p className="text-muted-foreground text-sm">
                © 2024 HealthScore. All rights reserved.
              </p>
            </div>
          </footer>
        </div>
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
