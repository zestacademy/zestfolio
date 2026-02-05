"use client";

import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";
import { ArrowRight, User, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

export function Navbar() {
    const { user, profile, loading } = useAuth();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header className={cn(
            "h-20 flex items-center px-6 sticky top-0 z-50 transition-all duration-300",
            scrolled
                ? "bg-background/80 backdrop-blur-xl border-b border-border/40 shadow-sm h-16"
                : "bg-transparent h-24"
        )}>
            <div className="container mx-auto flex items-center">
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="relative overflow-hidden rounded-2xl transition-transform duration-500 group-hover:rotate-12">
                        <img src="/logo.png" alt="Zestfolio Logo" className="w-10 h-10 md:w-12 md:h-12 object-contain" />
                    </div>
                    <span className="font-black text-xl md:text-2xl tracking-tight transition-colors group-hover:text-primary">
                        <span className="text-primary group-hover:text-foreground transition-colors">Zest</span>folio
                    </span>
                </Link>

                <nav className="ml-12 hidden md:flex items-center gap-8 text-sm font-bold tracking-wide uppercase text-muted-foreground">
                    <Link href="/" className="hover:text-primary transition-all hover:-translate-y-0.5">Home</Link>
                    <Link href="/templates" className="hover:text-primary transition-all hover:-translate-y-0.5">Templates</Link>
                    <Link href="/examples" className="hover:text-primary transition-all hover:-translate-y-0.5">Examples</Link>
                    <Link href="/#pricing" className="hover:text-primary transition-all hover:-translate-y-0.5">Pricing</Link>
                </nav>

                <div className="ml-auto flex items-center gap-4">
                    <ThemeToggle />

                    <div className="h-8 w-[1px] bg-border/60 mx-1 hidden sm:block" />

                    {loading ? (
                        <div className="w-10 h-10 flex items-center justify-center">
                            <Loader2 className="w-5 h-5 animate-spin text-primary" />
                        </div>
                    ) : user ? (
                        <Link
                            href="/dashboard"
                            className="flex items-center gap-2.5 px-6 py-2.5 text-sm font-bold text-primary-foreground bg-primary rounded-2xl hover:bg-primary/95 transition-all shadow-[0_4px_15px_rgba(var(--primary-rgb),0.3)] hover:shadow-primary/40 hover:-translate-y-0.5 active:scale-95"
                        >
                            {profile?.photoURL ? (
                                <img src={profile.photoURL} alt="" className="w-6 h-6 rounded-full object-cover border-2 border-primary-foreground/20" />
                            ) : (
                                <div className="p-1 rounded-full bg-primary-foreground/10">
                                    <User className="w-3.5 h-3.5" />
                                </div>
                            )}
                            <span className="hidden sm:inline">Dashboard</span>
                        </Link>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link
                                href="/login"
                                className="hidden sm:inline-flex px-5 py-2.5 text-sm font-bold text-muted-foreground hover:text-primary transition-all"
                            >
                                Login
                            </Link>
                            <Link
                                href="/signup"
                                className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-black text-primary-foreground bg-primary rounded-2xl hover:bg-primary/95 transition-all shadow-[0_4px_15px_rgba(var(--primary-rgb),0.3)] hover:shadow-primary/40 hover:-translate-y-0.5 active:scale-95"
                            >
                                Get Started
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
