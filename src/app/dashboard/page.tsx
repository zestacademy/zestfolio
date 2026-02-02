'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { ExternalLink, Edit, Eye } from 'lucide-react';
import Link from 'next/link';

import { ResumeParser } from '@/components/dashboard/resume-parser';

export default function DashboardPage() {
    const { user } = useAuth();
    const [portfolio, setPortfolio] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStatus = async () => {
            if (!user) return;
            try {
                const docRef = doc(db, 'portfolios', user.uid);
                const docSnap = await getDoc(docRef);
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
    }, [user]);

    const username = portfolio?.username;
    const isLive = !!username; // Simplified check: if username exists, it's viewable

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-primary">Dashboard</h1>
                    <p className="text-muted-foreground">Manage your portfolio and view your stats.</p>
                </div>
                {isLive && (
                    <div className="flex gap-3">
                        <Link href="/preview">
                            <Button variant="outline" className="gap-2">
                                <Eye className="w-4 h-4" /> Preview
                            </Button>
                        </Link>
                        <a href={`/u/${username}`} target="_blank" rel="noopener noreferrer">
                            <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
                                View Live <ExternalLink className="w-4 h-4" />
                            </Button>
                        </a>
                    </div>
                )}
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Status Card */}
                <div className="p-6 rounded-xl border bg-card text-card-foreground shadow-sm flex flex-col justify-between">
                    <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Portfolio Status</h3>
                        <div className="mt-2 text-2xl font-bold flex items-center gap-2">
                            {isLive ? (
                                <span className="flex items-center gap-2 text-green-600 dark:text-green-400">
                                    <span className="relative flex h-3 w-3">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                                    </span>
                                    Live
                                </span>
                            ) : (
                                <span className="text-muted-foreground">Draft</span>
                            )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                            {isLive ? `Accessible at zestfolio.zestacademy.tech/u/${username}` : "Complete your profile to go live."}
                        </p>
                    </div>
                    {!isLive && (
                        <Link href="/dashboard/profile" className="mt-4">
                            <Button size="sm" variant="secondary" className="w-full">Set Username</Button>
                        </Link>
                    )}
                </div>

                {/* Smart Import Card */}
                <div className="p-6 rounded-xl border bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20 text-card-foreground shadow-sm flex flex-col justify-between">
                    <div>
                        <h3 className="text-sm font-medium text-indigo-600 dark:text-indigo-400 mb-2">Smart Import</h3>
                        <h4 className="text-lg font-bold mb-2">Import from Resume</h4>
                        <p className="text-xs text-muted-foreground mb-4">
                            Auto-fill your portfolio automatically by parsing your PDF, DOCX, or TXT resume.
                        </p>
                    </div>
                    <div className="pt-2">
                        <ResumeParser />
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="p-6 rounded-xl border bg-card text-card-foreground shadow-sm">
                    <h3 className="text-sm font-medium text-muted-foreground mb-4">Quick Actions</h3>
                    <div className="space-y-2">
                        <Link href="/dashboard/projects">
                            <Button variant="ghost" className="w-full justify-start gap-2 h-9">
                                <Edit className="w-4 h-4 text-primary" /> Add New Project
                            </Button>
                        </Link>
                        <Link href="/dashboard/skills">
                            <Button variant="ghost" className="w-full justify-start gap-2 h-9">
                                <Edit className="w-4 h-4 text-accent" /> Update Skills
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
