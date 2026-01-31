import Link from "next/link";

export function Footer() {
    return (
        <footer className="py-8 w-full shrink-0 px-4 md:px-6 border-t bg-muted/20">
            <div className="container mx-auto">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex flex-col items-center md:items-start gap-2">
                        <p className="text-sm font-medium text-foreground">
                            <span className="text-primary font-bold">Zest</span>folio
                        </p>
                        <p className="text-xs text-muted-foreground">
                            Build your portfolio in 5 minutes
                        </p>
                    </div>
                    
                    <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 text-sm">
                        <Link href="/features" className="text-muted-foreground hover:text-primary transition-colors">
                            Features
                        </Link>
                        <Link href="/templates" className="text-muted-foreground hover:text-primary transition-colors">
                            Templates
                        </Link>
                        <Link href="/examples" className="text-muted-foreground hover:text-primary transition-colors">
                            Examples
                        </Link>
                        <Link href="#pricing" className="text-muted-foreground hover:text-primary transition-colors">
                            Pricing
                        </Link>
                    </div>
                </div>
                
                <div className="mt-6 pt-4 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-2">
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
            </div>
        </footer>
    );
}
