'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import TemplateRenderer, { TemplateType } from '@/components/templates/template-renderer';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft, Monitor, Smartphone, Tablet } from 'lucide-react';
import Link from 'next/link';
import { PortfolioData } from '@/types';
import { mockPortfolioData } from '@/constants/mock-data';

export default function PreviewPage() {
    const { user } = useAuth();
    const [data, setData] = useState<PortfolioData | null>(null);
    const [loading, setLoading] = useState(true);
    const [template, setTemplate] = useState<TemplateType>('minimal');
    const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

    useEffect(() => {
        const fetchData = async () => {
            if (!user) {
                // If no user (dev mode?), use mock
                setData(mockPortfolioData);
                setLoading(false);
                return;
            }
            try {
                const docRef = doc(db, 'portfolios', user.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const portfolio = docSnap.data() as PortfolioData;
                    setData(portfolio);
                    if (portfolio.template) {
                        setTemplate(portfolio.template);
                    }
                } else {
                    // Fallback to mock if empty
                    setData(mockPortfolioData);
                }
            } catch (error) {
                console.error("Error fetching preview data:", error);
                setData(mockPortfolioData);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user]);

    if (loading) {
        return <div className="h-screen w-full flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin" /></div>;
    }

    if (!data) return <div>No data found.</div>;

    return (
        <div className="min-h-screen flex flex-col">
            {/* Preview Toolbar */}
            <div className="h-16 bg-slate-900 border-b border-slate-800 flex items-center px-4 justify-between text-white sticky top-0 z-50">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard">
                        <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white hover:bg-slate-800">
                            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Editor
                        </Button>
                    </Link>
                    <div className="h-6 w-px bg-slate-800 mx-2"></div>
                    <div className="flex bg-slate-800 rounded-md p-1">
                        <button
                            onClick={() => setTemplate('minimal')}
                            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${template === 'minimal' ? 'bg-white text-slate-900' : 'text-slate-400 hover:text-white'}`}
                        >
                            Minimal
                        </button>
                        <button
                            onClick={() => setTemplate('modern')}
                            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${template === 'modern' ? 'bg-indigo-500 text-white' : 'text-slate-400 hover:text-white'}`}
                        >
                            Modern
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => setViewport('desktop')} className={viewport === 'desktop' ? 'bg-slate-800 text-white' : 'text-slate-400'}>
                        <Monitor className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setViewport('tablet')} className={viewport === 'tablet' ? 'bg-slate-800 text-white' : 'text-slate-400'}>
                        <Tablet className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setViewport('mobile')} className={viewport === 'mobile' ? 'bg-slate-800 text-white' : 'text-slate-400'}>
                        <Smartphone className="w-4 h-4" />
                    </Button>
                </div>

                <Button
                    size="sm"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                    onClick={async () => {
                        if (!user) return;
                        try {
                            await import('firebase/firestore').then(({ doc, updateDoc }) =>
                                updateDoc(doc(db, 'portfolios', user.uid), {
                                    template: template
                                })
                            );
                            alert('Portfolio updated! Your site is live.');
                        } catch (err) {
                            console.error(err);
                            alert('Failed to publish');
                        }
                    }}
                >
                    Publish Changes
                </Button>
            </div>

            {/* Viewport Container */}
            <div className="flex-1 bg-slate-950 flex items-center justify-center p-4 md:p-8 overflow-hidden">
                <div
                    className={`bg-white transition-all duration-300 ease-in-out shadow-2xl overflow-y-auto ${viewport === 'mobile' ? 'w-[375px] h-[667px] rounded-3xl border-8 border-slate-800' :
                        viewport === 'tablet' ? 'w-[768px] h-[1024px] rounded-xl border-4 border-slate-800' :
                            'w-full h-full rounded-none border-none'
                        }`}
                >
                    <TemplateRenderer template={template} data={data} />
                </div>
            </div>
        </div>
    );
}
