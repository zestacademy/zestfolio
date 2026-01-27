import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { AuthProvider } from "@/lib/auth-context";

const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "Zestfolio | Student Portfolio Builder",
  description: "Build a professional, shareable portfolio in minutes. Powered by Zest Academy.",
  icons: {
    icon: '/logo.png',
    shortcut: '/favicon.ico',
    apple: '/logo.png',
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
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
