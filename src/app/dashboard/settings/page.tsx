'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Power, Eye, EyeOff, Settings, Sparkles, ShieldCheck, Globe, Trash2, Target } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function SettingsPage() {
    const { user, profile } = useAuth();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [status, setStatus] = useState<'active' | 'inactive'>('active');

    useEffect(() => {
        const fetchSettings = async () => {
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
                    const data = docSnap.data();
                    setStatus(data.status || 'active');
                }
            } catch (error) {
                console.error("Error fetching settings:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, [user, profile]);

    const handleStatusChange = async (newStatus: 'active' | 'inactive') => {
        if (!user || !profile?.zestId) return;
        setSaving(true);
        try {
            await updateDoc(doc(db, 'portfolios', profile.zestId), {
                status: newStatus
            });
            setStatus(newStatus);
        } catch (error) {
            console.error("Error updating status:", error);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center p-20 space-y-4">
                <Loader2 className="w-12 h-12 animate-spin text-primary" />
                <p className="text-xs font-black uppercase tracking-widest opacity-40 animate-pulse">Accessing Core Config...</p>
            </div>
        );
    }

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out fill-mode-both">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-primary flex items-center gap-3">
                        <div className="p-2 rounded-2xl bg-primary/10 text-primary group-hover:rotate-6 transition-transform">
                            <Settings className="w-8 h-8" />
                        </div>
                        Control Center
                    </h1>
                    <p className="text-muted-foreground mt-1 font-medium max-w-lg">
                        Manage your portfolio's deployment state, privacy configurations, and system preferences.
                    </p>
                </div>
                <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-2xl bg-primary/10 text-primary border border-primary/20 text-[10px] font-black uppercase tracking-widest">
                    <ShieldCheck className="w-4 h-4" />
                    Security Level: High
                </div>
            </div>

            <div className="grid gap-8">
                {/* Visibility Control Card */}
                <Card className={cn(
                    "rounded-[40px] border-border/40 overflow-hidden transition-all duration-500",
                    status === 'active' ? 'bg-emerald-500/5 border-emerald-500/30' : 'bg-card/40'
                )}>
                    <CardHeader className="p-8 pb-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className={cn(
                                    "p-3 rounded-2xl transition-all duration-500 shadow-lg",
                                    status === 'active' ? "bg-emerald-500 text-white" : "bg-muted text-muted-foreground"
                                )}>
                                    <Power className="w-6 h-6" />
                                </div>
                                <div>
                                    <CardTitle className="text-2xl font-black uppercase italic tracking-tight italic">Deployment Status</CardTitle>
                                    <CardDescription className="text-xs font-bold uppercase tracking-widest opacity-60">Control your global reach</CardDescription>
                                </div>
                            </div>
                            {status === 'active' && (
                                <div className="flex items-center gap-2 text-[10px] font-black text-emerald-600 bg-emerald-500/10 px-3 py-1 rounded-full animate-pulse">
                                    <Globe className="w-3 h-3" /> LIVE ON WEB
                                </div>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent className="p-8 pt-4">
                        <div className="flex flex-col md:flex-row md:items-center justify-between p-8 rounded-[32px] bg-background/50 border border-border/40 backdrop-blur-md gap-8 hover:shadow-xl transition-all duration-500 group">
                            <div className="space-y-3 flex-1">
                                <p className="text-lg font-black tracking-tight flex items-center gap-2">
                                    CURRENT STATE:
                                    <span className={cn(
                                        "uppercase italic",
                                        status === 'active' ? 'text-emerald-500 underline' : 'text-muted-foreground underline'
                                    )}>
                                        {status === 'active' ? 'Publicly Active' : 'System Paused'}
                                    </span>
                                </p>
                                <p className="text-sm font-medium text-muted-foreground leading-relaxed max-w-xl">
                                    {status === 'active'
                                        ? "Congratulations! Your digital legacy is accessible globally. Recruiter protocols are currently enabled and tracking view counts."
                                        : "Protocol paused. All traffic is being redirected to a secure maintenance terminal. You can still preview your changes in the laboratory."}
                                </p>
                            </div>
                            <div className="shrink-0 flex items-center justify-center">
                                {status === 'active' ? (
                                    <Button
                                        variant="outline"
                                        onClick={() => handleStatusChange('inactive')}
                                        disabled={saving}
                                        className="h-16 px-8 rounded-2xl border-red-200 text-red-600 font-black text-xs uppercase tracking-widest hover:bg-red-500 hover:text-white hover:border-red-500 transition-all shadow-lg active:scale-95 flex items-center gap-2"
                                    >
                                        {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <EyeOff className="w-5 h-5" />}
                                        Deactivate Node
                                    </Button>
                                ) : (
                                    <Button
                                        onClick={() => handleStatusChange('active')}
                                        disabled={saving}
                                        className="h-16 px-10 rounded-2xl bg-emerald-500 text-white font-black text-xs uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-500/20 active:scale-95 flex items-center gap-2 group/btn"
                                    >
                                        {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Eye className="w-5 h-5" />}
                                        Activate Global
                                        <Sparkles className="w-4 h-4 ml-1 group-hover/btn:rotate-12 transition-transform" />
                                    </Button>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Secondary Configs Placeholder */}
                <div className="grid md:grid-cols-2 gap-8 mt-4">
                    <Card className="rounded-[40px] border-border/40 bg-card/30 opacity-40 grayscale pointer-events-none">
                        <CardHeader className="p-8 pb-4">
                            <CardTitle className="text-lg font-black uppercase italic tracking-tight">Data Sovereignty</CardTitle>
                            <CardDescription className="text-xs font-bold uppercase tracking-widest">Wipe your digital footprint</CardDescription>
                        </CardHeader>
                        <CardContent className="p-8 pt-0 flex justify-between items-center">
                            <p className="text-xs font-medium text-muted-foreground">Coming Soon: Permanent Node Deletion</p>
                            <Button variant="ghost" size="icon" className="rounded-xl bg-destructive/10 text-destructive"><Trash2 className="w-5 h-5" /></Button>
                        </CardContent>
                    </Card>

                    <Card className="rounded-[40px] border-border/40 bg-card/30 opacity-40 grayscale pointer-events-none">
                        <CardHeader className="p-8 pb-4">
                            <CardTitle className="text-lg font-black uppercase italic tracking-tight">Analytic Engine</CardTitle>
                            <CardDescription className="text-xs font-bold uppercase tracking-widest">Google Tag & Meta Pixels</CardDescription>
                        </CardHeader>
                        <CardContent className="p-8 pt-0 flex justify-between items-center">
                            <p className="text-xs font-medium text-muted-foreground">Coming Soon: Third-party Tracking</p>
                            <Button variant="ghost" size="icon" className="rounded-xl bg-primary/10 text-primary"><Sparkles className="w-5 h-5" /></Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}


