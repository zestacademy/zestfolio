"use client";

import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";
import { ArrowRight } from "lucide-react";

export function Navbar() {
    return (
        <header className="px-4 md:px-6 h-16 flex items-center border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 shadow-sm">
            <Link href="/" className="flex items-center gap-2 font-bold text-lg md:text-xl tracking-tight">
                <img src="/logo.png" alt="Zestfolio Logo" className="w-7 h-7 md:w-8 md:h-8 object-contain" />
                <span><span className="text-primary">Zest</span>folio</span>
            </Link>
            <nav className="ml-auto hidden md:flex gap-6 lg:gap-8 text-sm font-medium">
                <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                <Link href="/templates" className="hover:text-primary transition-colors">Templates</Link>
                <Link href="/features" className="hover:text-primary transition-colors">Features</Link>
                <Link href="/examples" className="hover:text-primary transition-colors">How It Works</Link>
                <Link href="#pricing" className="hover:text-primary transition-colors">Pricing</Link>
            </nav>
            <div className="ml-4 md:ml-6 flex items-center gap-2 md:gap-3">
                <ThemeToggle />
                <Link
                    href="/login"
                    className="hidden sm:inline-flex px-3 md:px-4 py-2 text-sm font-medium hover:text-primary transition-colors"
                >
                    Login
                </Link>
                <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-1.5 px-4 md:px-5 py-2 text-sm font-semibold text-primary-foreground bg-primary rounded-lg hover:bg-primary/90 transition-all shadow-md hover:shadow-lg hover:scale-105"
                >
                    Get Started
                    <ArrowRight className="w-3.5 h-3.5" />
                </Link>
            </div>
        </header>
    );
}
