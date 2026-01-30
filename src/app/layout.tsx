import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { AuthProvider } from "@/lib/auth-context";
import { ThemeProvider } from "@/lib/theme-context";

const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "Zestfolio | Student Portfolio Builder",
  description: "Build a professional, shareable portfolio in minutes. Powered by Zest Academy.",
  metadataBase: new URL("https://zestfolio.zestacademy.tech"),
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
  openGraph: {
    title: "Zestfolio | Student Portfolio Builder",
    description: "Build a professional, shareable portfolio in minutes. Powered by Zest Academy.",
    url: "https://zestfolio.zestacademy.tech",
    siteName: "Zestfolio",
    images: [
      {
        url: "/og-image.jpg", // Assuming this exists or will be added
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Zestfolio | Student Portfolio Builder",
    description: "Build a professional, shareable portfolio in minutes. Powered by Zest Academy.",
    creator: "@zestacademy", // Assuming this handle
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={cn("min-h-screen bg-background font-sans antialiased", outfit.className)}>
        <ThemeProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
