'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { ExternalLink, Edit, Eye, Sparkles, Rocket, Zap } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

import { ResumeParser } from '@/components/dashboard/resume-parser';
import { UserProfile } from '@/components/dashboard/user-profile';

export default function DashboardPage() {
    const { user, profile } = useAuth();
    const [portfolio, setPortfolio] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStatus = async () => {
            if (!user || !profile?.zestId) return;
            try {
                const docRef = doc(db, 'portfolios', profile.zestId);
                let docSnap = await getDoc(docRef);

                if (!docSnap.exists()) {
                    // Fallback to UID for migration
                    const oldDocRef = doc(db, 'portfolios', user.uid);
                    docSnap = await getDoc(oldDocRef);
                }

                if (docSnap.exists()) {
                    setPortfolio(docSnap.data());
                }
            } catch (error) {
                console.error("Error fetching status:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStatus();
    }, [user, profile]);

    const username = portfolio?.username;
    const isLive = !!username;

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out fill-mode-both">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-primary flex items-center gap-3">
                        <Sparkles className="w-8 h-8 text-amber-500 animate-pulse" />
                        Dashboard
                    </h1>
                    <p className="text-muted-foreground mt-1 font-medium">Manage your professional presence everywhere.</p>
                </div>
                {isLive && (
                    <div className="flex flex-wrap gap-3 animate-in fade-in slide-in-from-right-4 duration-700 delay-300 fill-mode-both">
                        <Link href="/preview">
                            <Button variant="outline" className="h-11 px-6 rounded-2xl gap-2 font-bold transition-all hover:bg-muted/80 hover:scale-[1.02] active:scale-95">
                                <Eye className="w-4 h-4" /> Preview
                            </Button>
                        </Link>
                        <a href={`/u/${username}`} target="_blank" rel="noopener noreferrer">
                            <Button className="h-11 px-6 rounded-2xl gap-2 bg-primary text-primary-foreground font-bold shadow-[0_8px_20px_rgba(var(--primary-rgb),0.3)] hover:shadow-primary/40 transition-all hover:scale-[1.02] active:scale-95">
                                View Live <ExternalLink className="w-4 h-4" />
                            </Button>
                        </a>
                    </div>
                )}
            </div>

            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100 fill-mode-both">
                <UserProfile />
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {/* Status Card */}
                <div className="group p-8 rounded-[32px] border bg-card text-card-foreground shadow-sm flex flex-col justify-between hover:shadow-xl hover:shadow-primary/5 transition-all duration-500 hover:-translate-y-1 border-border/60 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200 fill-mode-both">
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">System Status</h3>
                            <div className={cn(
                                "p-2 rounded-xl transition-colors",
                                isLive ? "bg-green-500/10 text-green-500" : "bg-muted text-muted-foreground"
                            )}>
                                <Rocket className="w-5 h-5" />
                            </div>
                        </div>
                        <div className="mt-2 text-3xl font-black flex items-center gap-3">
                            {isLive ? (
                                <span className="flex items-center gap-2 text-green-600 dark:text-green-400">
                                    <span className="relative flex h-3 w-3">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                                    </span>
                                    LIVE SITE
                                </span>
                            ) : (
                                <span className="text-muted-foreground/50">DRAFT MODE</span>
                            )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-4 leading-relaxed font-medium">
                            {isLive
                                ? `Your portfolio is active and visible to the world at your custom URL.`
                                : "Finish setting up your basic profile to publish your site."}
                        </p>
                    </div>
                    {!isLive ? (
                        <Link href="/dashboard/profile" className="mt-8">
                            <Button size="lg" className="w-full h-12 rounded-2xl font-black bg-foreground text-background hover:bg-foreground/90 transition-transform active:scale-95">GO LIVE NOW</Button>
                        </Link>
                    ) : (
                        <div className="mt-8 p-3 rounded-2xl bg-muted/50 border text-[10px] font-mono break-all text-muted-foreground">
                            zestfolio.zestacademy.tech/u/{username}
                        </div>
                    )}
                </div>

                {/* Smart Import Card */}
                <div className="group p-8 rounded-[32px] border bg-gradient-to-br from-primary/10 via-background to-blue-500/5 dark:from-primary/20 dark:via-card dark:to-blue-900/10 text-card-foreground shadow-sm flex flex-col justify-between hover:shadow-xl hover:shadow-primary/5 transition-all duration-500 hover:-translate-y-1 border-primary/20 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300 fill-mode-both">
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-primary">Automation</h3>
                            <div className="p-2 rounded-xl bg-primary/10 text-primary">
                                <Zap className="w-5 h-5" />
                            </div>
                        </div>
                        <h4 className="text-2xl font-black mb-3 italic">Smart Import</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed font-medium mb-6">
                            Upload your existing resume and let our AI handle the data entry for you in seconds.
                        </p>
                    </div>
                    <div className="pt-2">
                        <ResumeParser />
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="group p-8 rounded-[32px] border bg-card text-card-foreground shadow-sm flex flex-col hover:shadow-xl transition-all duration-500 hover:-translate-y-1 border-border/60 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-400 fill-mode-both">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-6">Quick Edit</h3>
                    <div className="flex flex-col gap-3">
                        <Link href="/dashboard/projects">
                            <Button variant="ghost" className="w-full justify-between h-14 rounded-2xl px-6 group/btn border border-transparent hover:border-primary/20 hover:bg-primary/5 transition-all">
                                <span className="font-bold">Manage Projects</span>
                                <div className="p-2 rounded-xl bg-primary/10 text-primary group-hover/btn:scale-110 transition-transform">
                                    <Edit className="w-4 h-4" />
                                </div>
                            </Button>
                        </Link>
                        <Link href="/dashboard/skills">
                            <Button variant="ghost" className="w-full justify-between h-14 rounded-2xl px-6 group/btn border border-transparent hover:border-amber-500/20 hover:bg-amber-500/5 transition-all">
                                <span className="font-bold">Update Skills</span>
                                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500 group-hover/btn:scale-110 transition-transform">
                                    <Zap className="w-4 h-4" />
                                </div>
                            </Button>
                        </Link>
                    </div>
                    <div className="mt-auto pt-6 text-center">
                        <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground/50 italic">More coming soon</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

