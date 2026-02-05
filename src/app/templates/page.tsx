"use client";

import { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { CheckCircle2, Sparkles, Layout, X, Maximize2, ArrowRight, Zap, Target } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Templates() {
    const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

    const templates = [
        {
            id: "template01",
            name: "Tech Systems",
            description: "Dark theme with neon green accents, perfect for systems engineers and tech professionals",
            features: ["Neon glow effects", "Dark cyberpunk theme", "Profile photo showcase"],
            color: "from-green-600 to-emerald-600",
            preview: "/api/templates/template01"
        },
        {
            id: "template02",
            name: "Professional Clean",
            description: "Clean, centered layout ideal for all professionals seeking a polished online presence",
            features: ["Centered design", "Stats cards", "Professional styling"],
            color: "from-teal-600 to-green-600",
            preview: "/api/templates/template02"
        },
        {
            id: "template03",
            name: "Data Analyst",
            description: "Modern data-focused design with blue accents for data scientists and analysts",
            features: ["Data visualization ready", "Modern blue theme", "Clean typography"],
            color: "from-blue-600 to-cyan-600",
            preview: "/api/templates/template03"
        },
        {
            id: "template04",
            name: "Modern Universal",
            description: "Light/dark mode support with flexible design suitable for any field",
            features: ["Dark mode toggle", "Adaptive colors", "Universal appeal"],
            color: "from-indigo-600 to-purple-600",
            preview: "/api/templates/template04"
        },
        {
            id: "template05",
            name: "Minimal Blue",
            description: "Simple, compact layout with blue accents for minimalist professionals",
            features: ["Minimal design", "Compact layout", "Blue color scheme"],
            color: "from-sky-600 to-blue-600",
            preview: "/api/templates/template05"
        },
        {
            id: "template06",
            name: "Hardware Engineer",
            description: "Retro-inspired design perfect for hardware engineers and tech enthusiasts",
            features: ["Retro aesthetic", "Technical vibe", "Engineering focus"],
            color: "from-orange-600 to-red-600",
            preview: "/api/templates/template06"
        },
        {
            id: "template07",
            name: "Creative Bold",
            description: "Bold, artistic layout designed for creative professionals and designers",
            features: ["Vibrant colors", "Artistic flair", "Creative expression"],
            color: "from-purple-600 to-pink-600",
            preview: "/api/templates/template07"
        },
        {
            id: "template08",
            name: "Architecture Pro",
            description: "Professional architecture theme showcasing projects and design work",
            features: ["Project gallery", "Professional layout", "Architecture focus"],
            color: "from-slate-600 to-gray-600",
            preview: "/api/templates/template08"
        },
        {
            id: "template09",
            name: "Research Scholar",
            description: "Academic/scholarly design ideal for researchers and academics",
            features: ["Publication lists", "Academic styling", "Research focus"],
            color: "from-blue-700 to-indigo-700",
            preview: "/api/templates/template09"
        },
        {
            id: "template10",
            name: "Sentinel Security",
            description: "Cyberpunk-inspired security focused design with terminal aesthetics",
            features: ["Security Focus", "Cyberpunk", "Terminal Aesthetics"],
            color: "from-cyan-900 to-blue-900",
            preview: "/api/templates/template10"
        },
        {
            id: "template11",
            name: "Systems Architect",
            description: "Clean, grid-based layout designed for systems engineers and architects",
            features: ["Grid Layout", "Minimalist", "Systems Engineering"],
            color: "from-slate-700 to-zinc-700",
            preview: "/api/templates/template11"
        },
        {
            id: "template12",
            name: "Terra Ledger",
            description: "Sophisticated editorial feel with natural tones and paper textures",
            features: ["Editorial Style", "Paper Texture", "Serif Fonts"],
            color: "from-stone-500 to-amber-700",
            preview: "/api/templates/template12"
        },
        {
            id: "template13",
            name: "Frost Developer",
            description: "Modern dark theme with blue accents and subtle glassmorphism",
            features: ["Blue Accents", "Glassmorphism", "Clean UI"],
            color: "from-sky-400 to-blue-500",
            preview: "/api/templates/template13"
        },
        {
            id: "template14",
            name: "Zenith Module",
            description: "High-tech industrial design with technical borders and metadata details",
            features: ["Industrial Design", "Technical Borders", "Monospace"],
            color: "from-slate-800 to-indigo-900",
            preview: "/api/templates/template14"
        },
        {
            id: "template15",
            name: "Warm Terracotta",
            description: "Elegant design with warm tones and serif headings, perfect for designers",
            features: ["Warm Tones", "Serif Headings", "Elegant"],
            color: "from-orange-400 to-rose-400",
            preview: "/api/templates/template15"
        }
    ];

    const currentTemplate = templates.find(t => t.id === selectedTemplate);

    return (
        <div className="flex flex-col min-h-screen selection:bg-primary selection:text-primary-foreground">
            <Navbar />

            <main className="flex-1 overflow-hidden">
                {/* Hero Section */}
                <section className="w-full py-20 bg-gradient-to-b from-background via-background to-primary/5 relative">
                    {/* Background elements */}
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px] opacity-30 animate-pulse"></div>
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-[100px] opacity-30 animate-pulse animation-delay-2000"></div>

                    <div className="container px-4 md:px-6 mx-auto relative z-10">
                        <div className="flex flex-col items-center text-center space-y-8 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-primary/10 text-primary text-xs font-black uppercase tracking-widest border border-primary/20 backdrop-blur-md">
                                <Layout className="w-4 h-4" />
                                Premium Selection
                            </div>
                            <h1 className="text-5xl md:text-7xl font-black tracking-tighter sm:leading-tight">
                                Pick Your <span className="text-primary italic">Signature</span> Look.
                            </h1>
                            <p className="text-lg md:text-2xl text-muted-foreground max-w-3xl leading-relaxed font-medium">
                                15+ professionally designed templates ready to launch.
                                <span className="text-foreground"> Switch anytime without losing your data.</span>
                            </p>
                        </div>
                    </div>
                </section>

                {/* Templates Grid Container */}
                <section className="w-full py-12 md:py-24">
                    <div className="container px-4 md:px-6 mx-auto">
                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {templates.map((template, index) => (
                                <div
                                    key={template.id}
                                    className="group relative flex flex-col rounded-[32px] border border-border/60 bg-card transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] hover:-translate-y-2 overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-both"
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    {/* Preview Area */}
                                    <div
                                        className="relative h-64 bg-slate-900 overflow-hidden cursor-pointer group-hover:h-72 transition-all duration-500"
                                        onClick={() => setSelectedTemplate(template.id)}
                                    >
                                        <div className="absolute inset-0 z-10 bg-gradient-to-b from-transparent to-black/20 pointer-events-none" />
                                        <iframe
                                            src={template.preview}
                                            className="w-full h-full pointer-events-none scale-50 origin-top-left transition-transform duration-700 group-hover:scale-[0.55]"
                                            style={{ width: '200%', height: '200%' }}
                                            title={`${template.name} Preview`}
                                        />

                                        {/* Hover Interaction Overlay */}
                                        <div className="absolute inset-0 z-20 bg-primary/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col items-center justify-center">
                                            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center scale-90 group-hover:scale-100 transition-transform duration-500">
                                                <Maximize2 className="w-8 h-8 text-white" />
                                            </div>
                                            <p className="mt-4 text-white font-black text-sm uppercase tracking-widest translate-y-2 group-hover:translate-y-0 transition-transform duration-500">Instant Preview</p>
                                        </div>

                                        {/* Template Badge */}
                                        <div className="absolute top-4 left-4 z-20 px-3 py-1 rounded-xl bg-white/80 dark:bg-black/80 backdrop-blur-md text-[10px] font-black uppercase tracking-tighter border border-white/20">
                                            {template.id}
                                        </div>
                                    </div>

                                    {/* Content Info */}
                                    <div className="p-8 space-y-6 flex-1 flex flex-col">
                                        <div className="space-y-2">
                                            <h3 className="text-2xl font-black tracking-tight group-hover:text-primary transition-colors">{template.name}</h3>
                                            <p className="text-sm text-muted-foreground font-medium leading-relaxed italic">
                                                "{template.description}"
                                            </p>
                                        </div>

                                        {/* Tech Pills */}
                                        <div className="flex flex-wrap gap-2">
                                            {template.features.slice(0, 2).map((feat, i) => (
                                                <span key={i} className="px-3 py-1 rounded-lg bg-muted text-[10px] font-bold text-muted-foreground border border-border/40">
                                                    {feat}
                                                </span>
                                            ))}
                                            <span className="px-3 py-1 rounded-lg bg-primary/5 text-[10px] font-bold text-primary border border-primary/10">
                                                RESPONSIVE
                                            </span>
                                        </div>

                                        {/* Action Button */}
                                        <div className="mt-auto pt-4">
                                            <Link
                                                href="/dashboard/templates"
                                                className={cn(
                                                    "w-full inline-flex items-center justify-center h-14 rounded-2xl bg-foreground text-background font-black text-sm uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-95 group/btn",
                                                    "shadow-[0_4px_15px_rgba(0,0,0,0.1)] group-hover:shadow-primary/20 group-hover:bg-primary group-hover:text-white"
                                                )}
                                            >
                                                Launch Designer
                                                <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Features Inclusion Section */}
                <section className="w-full py-24 bg-muted/30">
                    <div className="container px-4 md:px-6 mx-auto">
                        <div className="text-center mb-16 space-y-4">
                            <h2 className="text-3xl md:text-5xl font-black tracking-tight uppercase">
                                Standard in <span className="text-primary">Every</span> Built
                            </h2>
                            <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-medium">
                                We've handled the boring stuff so you can focus on yours.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
                            {[
                                { icon: <Zap className="w-6 h-6" />, title: "Turbo Loading", desc: "Built with Next.js for sub-second page loads." },
                                { icon: <Target className="w-6 h-6" />, title: "SEO Mastered", desc: "Rank higher on Google with built-in metadata." },
                                { icon: <Layout className="w-6 h-6" />, title: "Fluid Design", desc: "Looks stunning on iPhone, Android, and Desktop." },
                                { icon: <Sparkles className="w-6 h-6" />, title: "AI Generation", desc: "Auto-generate sections with smart parsing." }
                            ].map((item, index) => (
                                <div key={index} className="flex flex-col items-center text-center space-y-4 p-8 rounded-[32px] bg-card border border-border/50 group hover:border-primary/20 transition-all duration-500">
                                    <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center transition-transform group-hover:rotate-12 duration-500">
                                        {item.icon}
                                    </div>
                                    <h3 className="text-xl font-bold italic">{item.title}</h3>
                                    <p className="text-sm text-muted-foreground font-medium leading-relaxed">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Secondary CTA */}
                <section className="w-full py-24 border-t">
                    <div className="container px-4 md:px-6 mx-auto">
                        <div className="bg-foreground text-background rounded-[48px] p-10 md:p-20 text-center relative overflow-hidden group">
                            {/* Background animation for CTA */}
                            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-primary/20 to-transparent -z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>

                            <div className="relative z-10 max-w-3xl mx-auto space-y-8">
                                <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-tight">
                                    Ready to Build Your <br /> Digital Legacy?
                                </h2>
                                <p className="text-xl text-background/70 font-medium">
                                    Join 5,000+ students and launch your portfolio in under 5 minutes.
                                </p>
                                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4">
                                    <Link
                                        href="/dashboard"
                                        className="h-16 px-12 rounded-2xl bg-primary text-white font-black text-lg uppercase tracking-widest shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2 group"
                                    >
                                        Get Started Now
                                        <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-2" />
                                    </Link>
                                    <div className="flex items-center gap-6">
                                        <div className="flex -space-x-3">
                                            {[1, 2, 3, 4].map(i => (
                                                <div key={i} className="w-10 h-10 rounded-full border-2 border-foreground bg-muted overflow-hidden">
                                                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=user${i}`} alt="" />
                                                </div>
                                            ))}
                                        </div>
                                        <p className="text-xs font-bold text-background/50 italic">Join 5k+ students</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />

            {/* Premium Preview Modal */}
            {selectedTemplate && currentTemplate && (
                <div
                    className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300"
                    onClick={() => setSelectedTemplate(null)}
                >
                    <div
                        className="relative w-full h-full max-w-7xl max-h-[92vh] bg-background rounded-[40px] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)] border border-white/5 flex flex-col animate-in zoom-in-95 duration-500"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Premium Modal Header */}
                        <div className="p-8 flex items-center justify-between border-b border-white/5 bg-background/50 backdrop-blur-xl">
                            <div className="flex items-center gap-6">
                                <div className={cn("w-12 h-12 rounded-2xl bg-gradient-to-br flex items-center justify-center shadow-lg transform rotate-3", currentTemplate.color)}>
                                    <Layout className="w-6 h-6 text-white" />
                                </div>
                                <div className="hidden sm:block">
                                    <h3 className="text-2xl font-black italic uppercase leading-none mb-1">{currentTemplate.name}</h3>
                                    <p className="text-xs font-bold text-muted-foreground tracking-widest uppercase">Live Interactive Preview</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <Link
                                    href="/dashboard/templates"
                                    className="px-8 py-3 rounded-2xl bg-primary text-white font-black text-sm uppercase tracking-widest shadow-xl hover:scale-[1.02] active:scale-95 transition-all"
                                >
                                    Select Design
                                </Link>
                                <button
                                    onClick={() => setSelectedTemplate(null)}
                                    className="p-3 bg-muted hover:bg-muted-foreground/10 rounded-2xl transition-all active:scale-90"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                        </div>

                        {/* Full Screen Iframe Preview */}
                        <div className="flex-1 bg-white relative">
                            <div className="absolute inset-0 flex items-center justify-center bg-muted -z-10">
                                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
                            </div>
                            <iframe
                                src={currentTemplate.preview}
                                className="w-full h-full"
                                title={`${currentTemplate.name} Full Preview`}
                            />
                        </div>

                        {/* Info Footer */}
                        <div className="p-6 bg-muted/30 border-t border-white/5 flex items-center justify-center gap-8 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">
                            <span>Fully Customizable</span>
                            <div className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                            <span>Mobile Optimized</span>
                            <div className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                            <span>SEO Ready</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
