import Link from "next/link";

export function Footer() {
    return (
        <footer className="py-6 w-full shrink-0 px-4 md:px-6 border-t">
            <div className="flex flex-col md:flex-row items-center justify-between gap-2">
                <p className="text-xs text-center md:text-left text-muted-foreground">
                    © 2024 Zest Academy. All rights reserved.
                </p>
                <p className="text-xs text-center md:text-right text-muted-foreground">
                    From the creators of{" "}
                    <Link
                        href="https://zestacademyonline.vercel.app"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:text-accent transition-colors font-medium underline decoration-primary/30 hover:decoration-accent/50 underline-offset-2"
                    >
                        Zest Academy
                    </Link>
                </p>
            </div>
        </footer>
    );
}
