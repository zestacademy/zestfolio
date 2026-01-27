"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/lib/theme-context";

export function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="relative p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors group"
            aria-label="Toggle theme"
        >
            <Sun className="w-5 h-5 text-foreground rotate-0 scale-100 transition-all dark:rotate-90 dark:scale-0" />
            <Moon className="absolute inset-0 m-auto w-5 h-5 text-foreground rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
        </button>
    );
}
