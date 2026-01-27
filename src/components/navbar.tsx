"use client";

import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";

export function Navbar() {
    return (
        <header className="px-4 md:px-6 h-16 flex items-center border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
            <Link href="/" className="flex items-center gap-2 font-bold text-lg md:text-xl tracking-tight">
                <img src="/logo.png" alt="Zestfolio Logo" className="w-7 h-7 md:w-8 md:h-8 object-contain" />
                <span><span className="text-primary">Zest</span>folio</span>
            </Link>
            <nav className="ml-auto hidden sm:flex gap-4 sm:gap-6 text-sm font-medium">
                <Link href="/features" className="hover:text-primary transition-colors">Features</Link>
                <Link href="/templates" className="hover:text-primary transition-colors">Templates</Link>
                <Link href="/examples" className="hover:text-primary transition-colors">Examples</Link>
            </nav>
            <div className="ml-4 md:ml-6 flex items-center gap-2 md:gap-3">
                <ThemeToggle />
                <Link
                    href="/login"
                    className="px-3 md:px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-md hover:bg-primary/90 transition-colors"
                >
                    Sign In
                </Link>
            </div>
        </header>
    );
}
