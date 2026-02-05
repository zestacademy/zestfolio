'use client';

import Link from "next/link";
import { ArrowRight, CheckCircle2, Zap, Shield, Loader2 } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { useAuth } from "@/lib/auth-context";

export default function Home() {
  const { user, loading } = useAuth();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 overflow-hidden">
        {/* Hero Section - Above the Fold CTA */}
        <section className="w-full py-16 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-b from-background via-background to-primary/5 relative overflow-hidden">
          {/* Animated Background Blobs */}
          <div className="absolute top-0 -left-4 w-72 h-72 bg-primary/10 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute top-0 -right-4 w-72 h-72 bg-blue-400/10 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-purple-400/10 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

          <div className="container px-4 md:px-6 mx-auto relative z-10">
            <div className="flex flex-col items-center space-y-8 text-center animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out">
              <div className="space-y-4">
                <div className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium bg-primary/10 text-primary border border-primary/20 mb-2 transition-transform hover:scale-105 active:scale-95 cursor-default">
                  Built for the New Era of Students
                </div>
                <h1 className="text-4xl font-extrabold tracking-tighter sm:text-6xl md:text-7xl lg:text-8xl/none bg-clip-text text-transparent bg-gradient-to-br from-foreground via-foreground/90 to-primary/80 pb-2">
                  Showcase Your Talent <br className="hidden sm:block" /> with Zestfolio
                </h1>
                <p className="mx-auto max-w-[750px] text-muted-foreground md:text-xl lg:text-2xl leading-relaxed">
                  The fastest way to build a professional portfolio. No coding, no hassle.
                  Just you, your projects, and your prospective employers.
                </p>
              </div>

              {/* Primary CTA with trust signals */}
              <div className="flex flex-col items-center gap-6 pt-4 w-full max-w-md mx-auto">
                {loading ? (
                  <div className="w-full inline-flex h-16 items-center justify-center rounded-2xl bg-primary/20 px-10 text-lg font-semibold text-primary/50 cursor-wait backdrop-blur-sm border border-primary/10">
                    <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                    Checking account...
                  </div>
                ) : user ? (
                  <Link
                    href="/dashboard"
                    className="w-full inline-flex h-16 items-center justify-center rounded-2xl bg-primary px-10 text-lg font-semibold text-primary-foreground shadow-[0_8px_30px_rgb(var(--primary-rgb),0.3)] hover:shadow-primary/40 hover:bg-primary/95 transition-all duration-300 hover:scale-[1.03] active:scale-95 focus-visible:outline-none"
                    prefetch={false}
                  >
                    Go to Dashboard
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                ) : (
                  <div className="flex flex-col sm:flex-row gap-4 w-full">
                    <Link
                      href="/signup"
                      className="flex-1 inline-flex h-16 items-center justify-center rounded-2xl bg-primary px-10 text-lg font-semibold text-primary-foreground shadow-[0_8px_30px_rgb(var(--primary-rgb),0.3)] hover:shadow-primary/40 hover:bg-primary/95 transition-all duration-300 hover:scale-[1.03] active:scale-95 focus-visible:outline-none"
                      prefetch={false}
                    >
                      Get Started Free
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                    <Link
                      href="/login"
                      className="flex-1 inline-flex h-16 items-center justify-center rounded-2xl bg-muted/50 backdrop-blur-sm px-10 text-lg font-semibold text-foreground border border-border shadow-sm hover:shadow-md hover:bg-muted/80 transition-all duration-300 hover:scale-[1.03] active:scale-95 focus-visible:outline-none"
                      prefetch={false}
                    >
                      Log In
                    </Link>
                  </div>
                )}

                {/* Trust signals */}
                <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-sm font-medium text-muted-foreground/80">
                  <div className="flex items-center gap-2 group transition-colors hover:text-primary">
                    <div className="p-1 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                    </div>
                    <span>No coding needed</span>
                  </div>
                  <div className="flex items-center gap-2 group transition-colors hover:text-primary">
                    <div className="p-1 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <Zap className="w-4 h-4 text-primary" />
                    </div>
                    <span>Instant deployment</span>
                  </div>
                </div>

                <Link
                  href="/examples"
                  className="text-sm text-primary hover:text-primary/80 underline decoration-primary/30 underline-offset-8 font-semibold transition-all hover:gap-1 flex items-center gap-1 group"
                  prefetch={false}
                >
                  See user examples <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-20 bg-background relative">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  icon: <Zap className="w-7 h-7" />,
                  title: "Lightning Fast",
                  desc: "Optimized for speed. Your portfolio loads in milliseconds worldwide.",
                  color: "bg-amber-500/10 text-amber-500"
                },
                {
                  icon: <Shield className="w-7 h-7" />,
                  title: "Always Protected",
                  desc: "Enterprise-grade SSL and secure hosting for every single portfolio.",
                  color: "bg-blue-500/10 text-blue-500"
                },
                {
                  icon: <CheckCircle2 className="w-7 h-7" />,
                  title: "Resume Ready",
                  desc: "Templates designed by recruiters to help you get hired faster.",
                  color: "bg-green-500/10 text-green-500"
                }
              ].map((feat, i) => (
                <div key={i} className="group relative flex flex-col items-center space-y-4 text-center p-8 border rounded-3xl bg-card transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-2 border-border/60">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl" />
                  <div className={`p-4 rounded-2xl ${feat.color} relative z-10 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6`}>
                    {feat.icon}
                  </div>
                  <h3 className="text-2xl font-bold relative z-10">{feat.title}</h3>
                  <p className="text-muted-foreground relative z-10 leading-relaxed">{feat.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="w-full py-24 bg-muted/20 relative">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
                From Sign-up to <span className="text-primary italic">Live</span> in Minutes
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                No complex builders. No design decisions. Just your content on a beautiful page.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto relative">
              {/* Connector lines for desktop */}
              <div className="hidden md:block absolute top-[60px] left-[20%] right-[20%] h-0.5 bg-gradient-to-r from-primary/10 via-primary/40 to-primary/10 -z-0" />

              {[
                { step: "1", title: "Sign Up", desc: "Start for free with Google or Email." },
                { step: "2", title: "Add Content", desc: "Input projects, skills and experience." },
                { step: "3", title: "Share URL", desc: "One-click deploy to a clean custom URL." }
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center text-center space-y-6 relative z-10 group">
                  <div className="w-20 h-20 rounded-3xl bg-primary flex items-center justify-center text-primary-foreground text-3xl font-black shadow-[0_10px_30px_rgb(var(--primary-rgb),0.3)] transition-all duration-500 group-hover:scale-110 group-hover:rotate-6">
                    {item.step}
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold">{item.title}</h3>
                    <p className="text-muted-foreground max-w-[200px]">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-20">
              <Link
                href="/dashboard"
                className="inline-flex h-14 items-center justify-center rounded-2xl bg-foreground text-background px-10 text-lg font-bold shadow-xl hover:scale-105 transition-all duration-300 active:scale-95"
              >
                Start Building Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="w-full py-24">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
                Simple Pricing
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                All features included for free. Forever.
              </p>
            </div>

            <div className="max-w-xl mx-auto">
              <div className="rounded-[40px] p-1 bg-gradient-to-br from-primary via-primary/50 to-blue-400">
                <div className="rounded-[38px] p-8 md:p-12 bg-card shadow-2xl flex flex-col items-center">
                  <div className="inline-flex items-center rounded-full px-4 py-1.5 text-sm font-bold bg-primary/10 text-primary mb-6">
                    MOST POPULAR
                  </div>
                  <h3 className="text-3xl font-black mb-2">Free Forever</h3>
                  <div className="flex items-baseline gap-2 mb-8">
                    <span className="text-7xl font-black">$0</span>
                    <span className="text-xl text-muted-foreground font-medium">/ forever</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full mb-10">
                    {[
                      "9 Premium Templates",
                      "Custom URL Link",
                      "Unlimited Skills",
                      "Project Gallery",
                      "Mobile Optimized",
                      "SEO Optimized"
                    ].map((feat, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                        <span className="font-medium">{feat}</span>
                      </div>
                    ))}
                  </div>

                  <Link
                    href="/dashboard"
                    className="w-full inline-flex h-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground text-lg font-bold shadow-[0_10px_40px_rgba(var(--primary-rgb),0.3)] hover:scale-[1.02] active:scale-95 transition-all duration-300"
                  >
                    Get Started Free
                  </Link>
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
