import Link from "next/link";
import { Home, ArrowLeft, Search, Compass } from "lucide-react";

export default function NotFound() {
    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/5">
            <div className="flex-1 flex items-center justify-center px-4">
                <div className="max-w-2xl w-full text-center space-y-8">
                    {/* Animated 404 */}
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-64 h-64 bg-gradient-to-br from-primary/20 via-accent/20 to-primary/20 rounded-full blur-3xl animate-pulse"></div>
                        </div>
                        <div className="relative">
                            <h1 className="text-9xl md:text-[12rem] font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary animate-gradient">
                                404
                            </h1>
                        </div>
                    </div>

                    {/* Icon */}
                    <div className="flex justify-center">
                        <div className="p-4 rounded-full bg-primary/10 border-2 border-primary/20">
                            <Compass className="w-12 h-12 text-primary animate-spin-slow" />
                        </div>
                    </div>

                    {/* Message */}
                    <div className="space-y-4">
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                            Page Not Found
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-md mx-auto">
                            Oops! The page you're looking for seems to have wandered off.
                            Let's get you back on track.
                        </p>
                    </div>

                    {/* Search suggestion */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 text-sm text-muted-foreground">
                        <Search className="w-4 h-4" />
                        <span>Looking for something specific? Try the homepage</span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                        <Link
                            href="/"
                            className="inline-flex items-center justify-center h-12 px-8 rounded-lg bg-primary text-primary-foreground font-medium shadow-lg shadow-primary/25 hover:bg-primary/90 transition-all hover:shadow-xl hover:shadow-primary/30 group"
                        >
                            <Home className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                            Go Home
                        </Link>
                        <Link
                            href="/examples"
                            className="inline-flex items-center justify-center h-12 px-8 rounded-lg border border-input bg-background font-medium shadow-sm hover:bg-accent hover:text-accent-foreground transition-all group"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                            View Examples
                        </Link>
                    </div>

                    {/* Popular Links */}
                    <div className="pt-8 border-t border-border/50">
                        <p className="text-sm text-muted-foreground mb-4">Popular pages:</p>
                        <div className="flex flex-wrap justify-center gap-3">
                            <Link
                                href="/features"
                                className="px-4 py-2 rounded-full bg-card border border-border/50 text-sm font-medium hover:bg-accent/10 hover:border-accent/30 hover:text-accent transition-all"
                            >
                                Features
                            </Link>
                            <Link
                                href="/templates"
                                className="px-4 py-2 rounded-full bg-card border border-border/50 text-sm font-medium hover:bg-accent/10 hover:border-accent/30 hover:text-accent transition-all"
                            >
                                Templates
                            </Link>
                            <Link
                                href="/dashboard"
                                className="px-4 py-2 rounded-full bg-card border border-border/50 text-sm font-medium hover:bg-accent/10 hover:border-accent/30 hover:text-accent transition-all"
                            >
                                Dashboard
                            </Link>
                            <Link
                                href="/login"
                                className="px-4 py-2 rounded-full bg-card border border-border/50 text-sm font-medium hover:bg-accent/10 hover:border-accent/30 hover:text-accent transition-all"
                            >
                                Sign In
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="py-6 px-4 border-t">
                <p className="text-xs text-center text-muted-foreground">
                    © 2024 Zest Academy. All rights reserved.
                </p>
            </footer>
        </div>
    );
}
