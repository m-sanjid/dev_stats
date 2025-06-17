import type { Metadata } from "next";
import "./globals.css";
import Providers from "./provider";
import Navbar from "@/components/Navbar";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Footer } from "@/components/Footer";
import { Inter } from "next/font/google";
import { ViewTransitions } from "next-view-transitions";
import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  title: "DevStats",
  description: "Track your development activity",
};

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ViewTransitions>
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
          <ThemeProvider>
            <Providers>
              <Navbar />
              <div className="mx-auto max-w-6xl">{children}</div>
              <Footer />
            </Providers>
            <Toaster />
          </ThemeProvider>
        <Analytics />
        </body>
      </html>
    </ViewTransitions>
  );
}
