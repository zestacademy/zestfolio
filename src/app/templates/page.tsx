"use client";

import { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { CheckCircle2, Sparkles, Layout, X, Maximize2 } from "lucide-react";

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
        }
    ];

    const currentTemplate = templates.find(t => t.id === selectedTemplate);

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
                                    {/* Preview Area with Iframe - Clickable */}
                                    <div
                                        className="relative h-64 bg-slate-900 overflow-hidden group-hover:h-80 transition-all duration-300 cursor-pointer"
                                        onClick={() => setSelectedTemplate(template.id)}
                                    >
                                        <iframe
                                            src={template.preview}
                                            className="w-full h-full pointer-events-none scale-50 origin-top-left"
                                            style={{ width: '200%', height: '200%' }}
                                            title={`${template.name} Preview`}
                                        />
                                        {/* Hover Overlay */}
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                            <div className="text-white text-center">
                                                <Maximize2 className="w-12 h-12 mx-auto mb-2 opacity-80" />
                                                <p className="text-sm font-medium">Click to preview</p>
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
                                            href="/dashboard/templates"
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

            {/* Full Screen Preview Modal */}
            {selectedTemplate && currentTemplate && (
                <div
                    className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
                    onClick={() => setSelectedTemplate(null)}
                >
                    <div
                        className="relative w-full h-full max-w-7xl max-h-[90vh] bg-white rounded-xl overflow-hidden shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/80 to-transparent p-4 flex items-center justify-between">
                            <div className="text-white">
                                <h3 className="text-lg font-bold">{currentTemplate.name}</h3>
                                <p className="text-sm text-white/80">{currentTemplate.description}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Link
                                    href="/dashboard/templates"
                                    className={`px-4 py-2 rounded-lg bg-gradient-to-r ${currentTemplate.color} text-white font-semibold shadow-md hover:shadow-lg transition-all`}
                                    onClick={() => setSelectedTemplate(null)}
                                >
                                    Use This Template
                                </Link>
                                <button
                                    onClick={() => setSelectedTemplate(null)}
                                    className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                                    aria-label="Close preview"
                                >
                                    <X className="w-6 h-6 text-white" />
                                </button>
                            </div>
                        </div>

                        {/* Iframe Preview */}
                        <iframe
                            src={currentTemplate.preview}
                            className="w-full h-full"
                            title={`${currentTemplate.name} Full Preview`}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
