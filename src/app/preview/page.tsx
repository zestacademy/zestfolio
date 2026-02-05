'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft, Smartphone, Tablet, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { PortfolioData } from '@/types';

export default function PreviewPage() {
    const { user, profile } = useAuth();
    const [username, setUsername] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

    useEffect(() => {
        const fetchData = async () => {
            if (!user || !profile?.zestId) {
                if (!user) setLoading(false);
                return;
            }
            try {
                const docRef = doc(db, 'portfolios', profile.zestId);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    if (data.username) {
                        setUsername(data.username);
                    }
                }
            } catch (error) {
                console.error("Error fetching preview data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user, profile]);

    if (loading) {
        return <div className="h-screen w-full flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin" /></div>;
    }

    if (!username) {
        return (
            <div className="h-screen w-full flex flex-col items-center justify-center gap-4">
                <p className="text-muted-foreground">You need to set a username to preview your portfolio.</p>
                <Link href="/dashboard/profile">
                    <Button>Go to Profile</Button>
                </Link>
            </div>
        );
    }

    const previewUrl = `/api/portfolio/${username}`;

    return (
        <div className="min-h-screen flex flex-col">
            {/* Preview Toolbar */}
            <div className="h-16 bg-slate-900 border-b border-slate-800 flex items-center px-4 justify-between text-white sticky top-0 z-50">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard">
                        <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white hover:bg-slate-800">
                            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Helper
                        </Button>
                    </Link>
                    <div className="h-6 w-px bg-slate-800 mx-2"></div>
                    <span className="text-sm font-medium text-slate-400">Live Preview</span>
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={() => setViewport('desktop')} className={viewport === 'desktop' ? 'bg-slate-800 text-white' : 'text-slate-400'}>
                        Desktop
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setViewport('tablet')} className={viewport === 'tablet' ? 'bg-slate-800 text-white' : 'text-slate-400'}>
                        <Tablet className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setViewport('mobile')} className={viewport === 'mobile' ? 'bg-slate-800 text-white' : 'text-slate-400'}>
                        <Smartphone className="w-4 h-4" />
                    </Button>
                </div>

                <a href={previewUrl} target="_blank" rel="noopener noreferrer">
                    <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
                        Open Live <ExternalLink className="w-4 h-4" />
                    </Button>
                </a>
            </div>

            {/* Viewport Container */}
            <div className="flex-1 bg-slate-950 relative overflow-auto">
                {viewport === 'desktop' ? (
                    <iframe
                        src={previewUrl}
                        className="w-full h-full min-h-[850px] border-none"
                        title="Portfolio Preview"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center p-4 md:p-8 overflow-auto">
                        <div
                            className={`bg-white transition-all duration-300 ease-in-out shadow-2xl overflow-hidden shrink-0 ${viewport === 'mobile' ? 'w-[375px] h-[667px] rounded-3xl border-8 border-slate-800' :
                                'w-[768px] h-[1024px] rounded-xl border-4 border-slate-800'
                                }`}
                        >
                            <iframe
                                src={previewUrl}
                                className="w-full h-full border-none"
                                title="Portfolio Preview"
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
