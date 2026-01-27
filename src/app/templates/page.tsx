import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { CheckCircle2, Sparkles, Layout } from "lucide-react";

export default function Templates() {
    const templates = [
        {
            name: "Modern Minimalist",
            description: "Clean, professional design perfect for tech-focused portfolios",
            features: ["Dark mode support", "Project grid layout", "Smooth animations"],
            color: "from-slate-600 to-slate-800",
            preview: "bg-gradient-to-br from-slate-100 to-slate-200"
        },
        {
            name: "Creative Bold",
            description: "Eye-catching design ideal for designers and creative professionals",
            features: ["Vibrant colors", "Image galleries", "Custom typography"],
            color: "from-purple-600 to-pink-600",
            preview: "bg-gradient-to-br from-purple-100 to-pink-100"
        },
        {
            name: "Academic Classic",
            description: "Traditional yet modern layout for research and academic work",
            features: ["Publication lists", "Citation support", "Timeline view"],
            color: "from-blue-600 to-cyan-600",
            preview: "bg-gradient-to-br from-blue-100 to-cyan-100"
        },
        {
            name: "Tech Developer",
            description: "Code-centric design with syntax highlighting and GitHub integration",
            features: ["Code snippets", "GitHub stats", "Tech stack badges"],
            color: "from-green-600 to-emerald-600",
            preview: "bg-gradient-to-br from-green-100 to-emerald-100"
        },
        {
            name: "Business Professional",
            description: "Corporate-style portfolio for business and finance students",
            features: ["Timeline layout", "Achievement cards", "Contact forms"],
            color: "from-indigo-600 to-blue-600",
            preview: "bg-gradient-to-br from-indigo-100 to-blue-100"
        },
        {
            name: "Artistic Showcase",
            description: "Visual-first design for artists, photographers, and multimedia creators",
            features: ["Full-screen images", "Video support", "Masonry grid"],
            color: "from-rose-600 to-orange-600",
            preview: "bg-gradient-to-br from-rose-100 to-orange-100"
        }
    ];

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />

            <main className="flex-1">
                {/* Hero Section */}
                <section className="w-full py-16 md:py-24 lg:py-32 bg-gradient-to-br from-secondary/20 via-background to-accent/10 relative overflow-hidden">
                    <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
                    <div className="container px-4 md:px-6 mx-auto relative">
                        <div className="flex flex-col items-center text-center space-y-6 max-w-3xl mx-auto">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 text-accent-foreground text-sm font-medium border border-accent/30">
                                <Layout className="w-4 h-4" />
                                Premium Templates
                            </div>
                            <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none">
                                Choose Your Perfect <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent via-primary to-accent">Template</span>
                            </h1>
                            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
                                Each template is carefully crafted, fully responsive, and customizable.
                                Pick the one that matches your style and goals.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Templates Grid */}
                <section className="w-full py-16 md:py-24">
                    <div className="container px-4 md:px-6 mx-auto">
                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {templates.map((template, index) => (
                                <div
                                    key={index}
                                    className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
                                >
                                    {/* Preview Area */}
                                    <div className={`relative h-48 ${template.preview} overflow-hidden`}>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className={`w-32 h-32 rounded-lg bg-gradient-to-br ${template.color} opacity-40 blur-2xl group-hover:scale-150 transition-transform duration-500`}></div>
                                        </div>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className={`px-6 py-3 rounded-lg bg-gradient-to-r ${template.color} text-white font-semibold shadow-lg`}>
                                                Preview
                                            </div>
                                        </div>
                                        {/* Sparkle Effect */}
                                        <Sparkles className="absolute top-4 right-4 w-6 h-6 text-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>

                                    {/* Content */}
                                    <div className="p-6 space-y-4">
                                        <div>
                                            <h3 className="text-xl font-bold mb-2">{template.name}</h3>
                                            <p className="text-sm text-muted-foreground leading-relaxed">
                                                {template.description}
                                            </p>
                                        </div>

                                        {/* Features */}
                                        <div className="space-y-2">
                                            {template.features.map((feature, idx) => (
                                                <div key={idx} className="flex items-center gap-2 text-sm">
                                                    <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0" />
                                                    <span className="text-foreground/80">{feature}</span>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Action Button */}
                                        <Link
                                            href="/dashboard"
                                            className={`w-full inline-flex items-center justify-center px-4 py-2.5 rounded-lg bg-gradient-to-r ${template.color} text-white font-medium shadow-md hover:shadow-lg transition-all`}
                                        >
                                            Use This Template
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="w-full py-16 md:py-24 bg-muted/30">
                    <div className="container px-4 md:px-6 mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">
                                All Templates Include
                            </h2>
                            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                                Every template comes loaded with professional features out of the box
                            </p>
                        </div>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
                            {[
                                { title: "Mobile Responsive", desc: "Perfect on any screen size" },
                                { title: "SEO Optimized", desc: "Better search rankings" },
                                { title: "Fast Loading", desc: "Optimized performance" },
                                { title: "Easy Customization", desc: "No coding needed" }
                            ].map((item, index) => (
                                <div key={index} className="text-center p-6 rounded-xl bg-card border border-border/50">
                                    <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                                        <CheckCircle2 className="w-6 h-6 text-primary" />
                                    </div>
                                    <h3 className="font-semibold mb-2">{item.title}</h3>
                                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="w-full py-16 md:py-24">
                    <div className="container px-4 md:px-6 mx-auto">
                        <div className="flex flex-col items-center text-center space-y-6 max-w-2xl mx-auto">
                            <h2 className="text-3xl md:text-4xl font-bold">
                                Can't Decide? Try Them All!
                            </h2>
                            <p className="text-lg text-muted-foreground">
                                Switch between templates anytime. Your content stays the same, just the design changes.
                            </p>
                            <Link
                                href="/dashboard"
                                className="inline-flex h-12 items-center justify-center rounded-lg bg-primary px-8 text-base font-medium text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30"
                            >
                                Start Building Now
                                <Sparkles className="ml-2 h-4 w-4" />
                            </Link>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
