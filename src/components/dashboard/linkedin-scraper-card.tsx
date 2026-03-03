'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Linkedin, CheckCircle2, XCircle, Link as LinkIcon, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

export function LinkedinScraperCard() {
    const { profile } = useAuth();
    const router = useRouter();

    const [scrapeUrl, setScrapeUrl] = useState('');
    const [isScraping, setIsScraping] = useState(false);
    const [scrapeStatus, setScrapeStatus] = useState<{ type: 'success' | 'error' | null, message: string }>({ type: null, message: '' });

    const handleScrapeLinkedIn = async () => {
        if (!scrapeUrl || !scrapeUrl.includes('linkedin.com/in/')) {
            setScrapeStatus({ type: 'error', message: 'Please enter a valid LinkedIn URL' });
            return;
        }

        setIsScraping(true);
        setScrapeStatus({ type: null, message: '' });

        try {
            const res = await fetch('/api/scrape-linkedin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ linkedinUrl: scrapeUrl })
            });
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to scrape profile');
            }

            if (profile?.zestId) {
                const docRef = doc(db, 'portfolios', profile.zestId);

                // Construct the payload mapping scraped data to the portfolio structure
                const updatePayload: any = {
                    updatedAt: new Date(),
                    skills: data.skills || [],
                    education: data.education || [],
                    projects: data.projects || [],
                    certifications: data.certifications || [],
                    socialLinks: data.socialLinks || {}
                };

                // Add basic info only if it exists so we don't wipe existing names if scrape misses it
                if (data.basicInformation?.fullName) updatePayload.fullName = data.basicInformation.fullName;
                if (data.basicInformation?.professionalTitle) updatePayload.professionalTitle = data.basicInformation.professionalTitle;
                if (data.basicInformation?.aboutMe) updatePayload.aboutMe = data.basicInformation.aboutMe;
                if (data.basicInformation?.domain) updatePayload.domain = data.basicInformation.domain;
                if (data.basicInformation?.email) updatePayload.email = data.basicInformation.email;
                if (data.generalInformation?.profilePhotoUrl) updatePayload.profilePhoto = data.generalInformation.profilePhotoUrl;

                await setDoc(docRef, updatePayload, { merge: true });
            }

            setScrapeStatus({ type: 'success', message: 'Profile details synced to database!' });
            setScrapeUrl('');

            // Wait 2 seconds and redirect to profile page so they can review their changes
            setTimeout(() => {
                router.push('/dashboard/profile');
            }, 2000);

        } catch (e: any) {
            console.error(e);
            setScrapeStatus({ type: 'error', message: e.message || 'Scraping error.' });
        } finally {
            setIsScraping(false);
        }
    };

    return (
        <div className="group p-8 rounded-[32px] border bg-gradient-to-br from-blue-500/10 via-background to-primary/5 dark:from-blue-900/20 dark:via-card dark:to-primary/10 text-card-foreground shadow-sm flex flex-col justify-between hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-500 hover:-translate-y-1 border-blue-500/20 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-350 fill-mode-both">
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-blue-500">Auto-Fill</h3>
                    <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
                        <Linkedin className="w-5 h-5" />
                    </div>
                </div>
                <h4 className="text-2xl font-black mb-3 italic">LinkedIn Sync</h4>
                <p className="text-sm text-muted-foreground leading-relaxed font-medium mb-6">
                    Paste your LinkedIn URL to instantly populate your entire portfolio, skills, and experiences.
                </p>
            </div>

            <div className="flex flex-col gap-3">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-muted-foreground/50">
                        <LinkIcon className="w-4 h-4" />
                    </div>
                    <Input
                        disabled={isScraping}
                        value={scrapeUrl}
                        onChange={(e) => setScrapeUrl(e.target.value)}
                        placeholder="https://linkedin.com/in/you"
                        className="pl-11 h-12 rounded-2xl bg-muted/50 border-border/40 text-sm font-medium focus-visible:ring-blue-500/20"
                    />
                </div>
                <Button
                    type="button"
                    disabled={isScraping || !scrapeUrl}
                    onClick={handleScrapeLinkedIn}
                    className="w-full h-12 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all disabled:opacity-50"
                >
                    {isScraping ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Scraping (10s-30s)...
                        </>
                    ) : (
                        "Sync Profile Details"
                    )}
                </Button>

                {(isScraping || scrapeStatus.message) && (
                    <p className={cn(
                        "text-xs font-bold flex items-center gap-1.5 mt-2",
                        scrapeStatus.type === 'success' ? "text-green-500" : (scrapeStatus.type === 'error' ? "text-red-500" : "text-blue-500")
                    )}>
                        {scrapeStatus.type === 'success' ? <CheckCircle2 className="w-3.5 h-3.5" /> : scrapeStatus.type === 'error' ? <XCircle className="w-3.5 h-3.5" /> : <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                        {isScraping ? "Processing Profile..." : scrapeStatus.message}
                    </p>
                )}
            </div>
        </div>
    );
}
