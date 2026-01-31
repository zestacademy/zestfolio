import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Zap, Globe, Palette, Code, Share2, Sparkles, CheckCircle2, Rocket } from "lucide-react";

export default function Features() {
    const features = [
        {
            icon: Zap,
            title: "Lightning Fast Setup",
            description: "Create your professional portfolio in under 10 minutes. No coding knowledge required.",
            color: "from-yellow-400 to-orange-500"
        },
        {
            icon: Palette,
            title: "Beautiful Templates",
            description: "Choose from multiple stunning, modern templates designed specifically for students.",
            color: "from-purple-400 to-pink-500"
        },
        {
            icon: Globe,
            title: "Responsive Design",
            description: "Your portfolio looks perfect on every device - mobile, tablet, and desktop.",
            color: "from-blue-400 to-cyan-500"
        },
        {
            icon: Share2,
            title: "Easy Sharing",
            description: "Get a clean, professional URL to share on LinkedIn, GitHub, and your resume.",
            color: "from-green-400 to-emerald-500"
        },
        {
            icon: Code,
            title: "Showcase Projects",
            description: "Display your coding projects, research work, and academic achievements beautifully.",
            color: "from-indigo-400 to-purple-500"
        },
        {
            icon: Sparkles,
            title: "Live Preview",
            description: "See changes in real-time as you build your portfolio. What you see is what you get.",
            color: "from-pink-400 to-rose-500"
        }
    ];

    const benefits = [
        "No coding required - drag and drop interface",
        "SEO optimized for better visibility",
        "Custom domain support",
        "Regular updates and new features",
        "Integrated with Zest Academy ecosystem",
        "Free hosting and SSL certificate",
        "Analytics dashboard to track visitors",
        "Export your data anytime"
    ];

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />

            <main className="flex-1">
                {/* Hero Section */}
                <section className="w-full py-16 md:py-24 lg:py-32 bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/10 relative overflow-hidden">
                    <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
                    <div className="container px-4 md:px-6 mx-auto relative">
                        <div className="flex flex-col items-center text-center space-y-6 max-w-3xl mx-auto">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                                <Rocket className="w-4 h-4" />
                                Powerful Features
                            </div>
                            <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none">
                                Everything You Need to <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary">Shine Online</span>
                            </h1>
                            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
                                Build a stunning student portfolio that showcases your skills, projects, and achievements.
                                Stand out to recruiters and universities.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Features Grid */}
                <section className="w-full py-16 md:py-24">
                    <div className="container px-4 md:px-6 mx-auto">
                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {features.map((feature, index) => {
                                const Icon = feature.icon;
                                return (
                                    <div
                                        key={index}
                                        className="group relative p-8 border border-border/50 rounded-2xl bg-card hover:bg-card/80 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                        <div className="relative">
                                            <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.color} mb-4`}>
                                                <Icon className="w-6 h-6 text-white" />
                                            </div>
                                            <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                                            <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* Benefits Section */}
                <section className="w-full py-16 md:py-24 bg-muted/30">
                    <div className="container px-4 md:px-6 mx-auto">
                        <div className="grid lg:grid-cols-2 gap-12 items-center">
                            <div>
                                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                                    Built for <span className="text-primary">Students</span>, By Students
                                </h2>
                                <p className="text-lg text-muted-foreground mb-8">
                                    We understand what students need. Zestfolio is designed to help you succeed in your
                                    academic journey and career goals.
                                </p>
                                <div className="space-y-4">
                                    {benefits.map((benefit, index) => (
                                        <div key={index} className="flex items-start gap-3">
                                            <CheckCircle2 className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                                            <span className="text-foreground">{benefit}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="relative">
                                <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary via-accent to-secondary p-1">
                                    <div className="w-full h-full rounded-xl bg-background flex items-center justify-center">
                                        <div className="text-center space-y-4 p-8">
                                            <div className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                                                10+
                                            </div>
                                            <p className="text-xl font-semibold">Premium Features</p>
                                            <p className="text-muted-foreground">All completely free for students</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="w-full py-16 md:py-24">
                    <div className="container px-4 md:px-6 mx-auto">
                        <div className="flex flex-col items-center text-center space-y-6 max-w-2xl mx-auto">
                            <h2 className="text-3xl md:text-4xl font-bold">
                                Ready to Showcase Your Skills?
                            </h2>
                            <p className="text-lg text-muted-foreground">
                                Join thousands of students who are already getting noticed with Zestfolio.
                            </p>
                            <div className="flex flex-col sm:flex-row items-center gap-4">
                                <Link
                                    href="/dashboard"
                                    className="inline-flex h-12 items-center justify-center rounded-lg bg-primary px-8 text-base font-semibold text-primary-foreground shadow-lg hover:shadow-xl hover:bg-primary/90 transition-all hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                >
                                    Build Your Portfolio Now
                                    <Rocket className="ml-2 h-4 w-4" />
                                </Link>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-1.5">
                                        <CheckCircle2 className="w-4 h-4 text-primary" />
                                        <span>Free forever</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <CheckCircle2 className="w-4 h-4 text-primary" />
                                        <span>No credit card</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
