import Link from "next/link";
import { ArrowRight, CheckCircle2, Zap, Shield } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section - Above the Fold CTA */}
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-b from-background to-muted/20">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center space-y-6 text-center">
              <div className="space-y-4">
                <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
                  Build Your Portfolio <br /> in 5 Minutes
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Create a professional portfolio that showcases your projects, skills, and education. 
                  Perfect for students and freshers looking to stand out.
                </p>
              </div>
              
              {/* Primary CTA with trust signals */}
              <div className="flex flex-col items-center gap-4 pt-2">
                <Link
                  href="/dashboard"
                  className="inline-flex h-14 items-center justify-center rounded-lg bg-primary px-10 text-lg font-semibold text-primary-foreground shadow-lg hover:shadow-xl hover:bg-primary/90 transition-all hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  prefetch={false}
                >
                  Generate My Portfolio
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                
                {/* Trust signals - micro-copy */}
                <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                    <span>No coding required</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-primary" />
                    <span>Free to start</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Shield className="w-4 h-4 text-primary" />
                    <span>Built for students</span>
                  </div>
                </div>
                
                <Link
                  href="/examples"
                  className="text-sm text-primary hover:underline underline-offset-4 font-medium"
                  prefetch={false}
                >
                  See what others have built →
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-center space-y-3 text-center p-6 border rounded-xl bg-card shadow-sm hover:shadow-md transition-all">
                <div className="p-3 rounded-full bg-primary/10 text-primary">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                </div>
                <h3 className="text-xl font-bold">Fast & Easy</h3>
                <p className="text-muted-foreground">Fill in your details and get a live site in under 10 minutes.</p>
              </div>
              <div className="flex flex-col items-center space-y-3 text-center p-6 border rounded-xl bg-card shadow-sm hover:shadow-md transition-all">
                <div className="p-3 rounded-full bg-primary/10 text-primary">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                </div>
                <h3 className="text-xl font-bold">Responsive Design</h3>
                <p className="text-muted-foreground">Templates tailored for mobile, tablet, and desktop screens.</p>
              </div>
              <div className="flex flex-col items-center space-y-3 text-center p-6 border rounded-xl bg-card shadow-sm hover:shadow-md transition-all">
                <div className="p-3 rounded-full bg-primary/10 text-primary">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                </div>
                <h3 className="text-xl font-bold">Share Anywhere</h3>
                <p className="text-muted-foreground">Get a clean URL to share on LinkedIn, GitHub, and resumes.</p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="w-full py-16 md:py-24 bg-muted/30">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Simple 3-Step Process
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Get your professional portfolio live in minutes, not hours
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="flex flex-col items-center text-center space-y-4 p-6">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold">
                  1
                </div>
                <h3 className="text-xl font-bold">Sign Up Free</h3>
                <p className="text-muted-foreground">
                  Create your account in seconds. No credit card required.
                </p>
              </div>

              <div className="flex flex-col items-center text-center space-y-4 p-6">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold">
                  2
                </div>
                <h3 className="text-xl font-bold">Add Your Info</h3>
                <p className="text-muted-foreground">
                  Fill in your projects, skills, and education. Choose a template.
                </p>
              </div>

              <div className="flex flex-col items-center text-center space-y-4 p-6">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold">
                  3
                </div>
                <h3 className="text-xl font-bold">Go Live</h3>
                <p className="text-muted-foreground">
                  Get your shareable portfolio URL and start impressing recruiters.
                </p>
              </div>
            </div>

            {/* Secondary CTA */}
            <div className="text-center mt-12">
              <Link
                href="/dashboard"
                className="inline-flex h-12 items-center justify-center rounded-lg bg-primary px-8 text-base font-semibold text-primary-foreground shadow-lg hover:shadow-xl hover:bg-primary/90 transition-all hover:scale-105"
              >
                Start Building Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="w-full py-16 md:py-24">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Simple, Transparent Pricing
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Everything you need to build a stunning portfolio, completely free
              </p>
            </div>

            <div className="max-w-md mx-auto">
              <div className="border-2 border-primary rounded-2xl p-8 bg-card shadow-lg">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2">Free Forever</h3>
                  <div className="flex items-baseline justify-center gap-2 mb-4">
                    <span className="text-5xl font-extrabold">$0</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                  <p className="text-muted-foreground">
                    Perfect for students and early professionals
                  </p>
                </div>

                <ul className="space-y-3 mb-8">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Unlimited portfolios</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>9 professional templates</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Custom domain support</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Free hosting & SSL</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>No coding required</span>
                  </li>
                </ul>

                <Link
                  href="/dashboard"
                  className="w-full inline-flex h-12 items-center justify-center rounded-lg bg-primary text-primary-foreground font-semibold shadow-lg hover:shadow-xl hover:bg-primary/90 transition-all hover:scale-105"
                >
                  Get Started Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
