'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Save, X, Plus, Award, Zap, Sparkles, ShieldCheck, Target } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function SkillsForm() {
    const { user, profile } = useAuth();
    const [saving, setSaving] = useState(false);
    const [initialized, setInitialized] = useState(false);
    const [skills, setSkills] = useState<string[]>([]);
    const [certifications, setCertifications] = useState<string[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [certInputValue, setCertInputValue] = useState('');

    useEffect(() => {
        const fetchSkills = async () => {
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
                    setSkills(data.skills || []);
                    setCertifications(data.certifications || []);
                }
            } catch (error) {
                console.error("Error fetching skills:", error);
            } finally {
                setInitialized(true);
            }
        };
        fetchSkills();
    }, [user, profile]);

    // Auto-save effect
    useEffect(() => {
        if (!initialized || !user || !profile?.zestId) return;
        const formZestId = profile.zestId;

        const timer = setTimeout(async () => {
            setSaving(true);
            try {
                await updateDoc(doc(db, 'portfolios', formZestId), {
                    skills: skills,
                    certifications: certifications
                });
            } catch (error) {
                console.error("Error auto-saving skills:", error);
            } finally {
                setSaving(false);
            }
        }, 2000);

        return () => clearTimeout(timer);
    }, [skills, certifications, user, profile, initialized]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && inputValue.trim()) {
            e.preventDefault();
            if (!skills.includes(inputValue.trim().toUpperCase())) {
                setSkills([...skills, inputValue.trim().toUpperCase()]);
            }
            setInputValue('');
        }
    };

    const addSkill = () => {
        if (inputValue.trim()) {
            if (!skills.includes(inputValue.trim().toUpperCase())) {
                setSkills([...skills, inputValue.trim().toUpperCase()]);
            }
            setInputValue('');
        }
    };

    const removeSkill = (skill: string) => {
        setSkills(skills.filter(s => s !== skill));
    };

    const handleCertKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && certInputValue.trim()) {
            e.preventDefault();
            if (!certifications.includes(certInputValue.trim())) {
                setCertifications([...certifications, certInputValue.trim()]);
            }
            setCertInputValue('');
        }
    };

    const addCertification = () => {
        if (certInputValue.trim()) {
            if (!certifications.includes(certInputValue.trim())) {
                setCertifications([...certifications, certInputValue.trim()]);
            }
            setCertInputValue('');
        }
    };

    const removeCertification = (cert: string) => {
        setCertifications(certifications.filter(c => c !== cert));
    };

    return (
        <div className="space-y-8">
            {/* Auto-save Status Indicator */}
            <div className="fixed bottom-6 right-6 z-50">
                <div className={cn(
                    "flex items-center gap-3 px-6 py-3 rounded-2xl shadow-2xl transition-all duration-500 border backdrop-blur-md",
                    saving
                        ? "bg-primary text-white border-primary/20 translate-y-0"
                        : "bg-background/80 text-muted-foreground border-border translate-y-20 opacity-0"
                )}>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm font-black uppercase tracking-widest">Updating Arsenal</span>
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Skills Section */}
                <Card className="rounded-[40px] border-border/40 bg-card/30 overflow-hidden flex flex-col">
                    <CardHeader className="p-8 pb-4">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-xl bg-primary/10 text-primary">
                                    <Zap className="w-5 h-5" />
                                </div>
                                <CardTitle className="text-xl font-black uppercase italic tracking-tight">Core Competencies</CardTitle>
                            </div>
                        </div>
                        <CardDescription className="text-xs font-bold uppercase tracking-widest opacity-60">Add technologies you've mastered</CardDescription>
                    </CardHeader>
                    <CardContent className="p-8 pt-4 space-y-6 flex-1 flex flex-col">
                        <div className="space-y-3">
                            <Label className="text-[10px] font-black uppercase tracking-widest ml-1">Input Mastery</Label>
                            <div className="flex gap-3">
                                <Input
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="e.g. REACT, NODE.JS, PYTHON"
                                    className="h-14 rounded-2xl bg-muted/40 border-border/40 text-sm font-black focus-visible:ring-primary/20"
                                />
                                <Button onClick={addSkill} className="h-14 w-14 rounded-2xl bg-foreground text-background hover:bg-primary hover:text-white transition-all active:scale-95 shadow-lg">
                                    <Plus className="w-6 h-6" />
                                </Button>
                            </div>
                        </div>

                        <div className="flex-1 min-h-[250px] rounded-3xl border border-dashed border-border/60 p-6 flex flex-wrap gap-3 content-start group hover:border-primary/20 transition-colors">
                            {skills.length === 0 ? (
                                <div className="w-full h-full flex flex-col items-center justify-center text-center space-y-2 opacity-30 select-none">
                                    <Sparkles className="w-8 h-8" />
                                    <p className="text-xs font-black uppercase tracking-widest italic">No skills cataloged yet</p>
                                </div>
                            ) : (
                                skills.map(skill => (
                                    <div
                                        key={skill}
                                        className="group/tag flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-primary/5 text-primary border border-primary/20 text-xs font-black tracking-widest hover:bg-primary transition-all hover:text-white hover:scale-105"
                                    >
                                        {skill}
                                        <button
                                            onClick={() => removeSkill(skill)}
                                            className="opacity-40 group-hover/tag:opacity-100 hover:text-red-200 transition-all active:scale-90"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Certifications Section */}
                <Card className="rounded-[40px] border-border/40 bg-card/30 overflow-hidden flex flex-col">
                    <CardHeader className="p-8 pb-4">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600">
                                    <Award className="w-5 h-5" />
                                </div>
                                <CardTitle className="text-xl font-black uppercase italic tracking-tight">Accreditations</CardTitle>
                            </div>
                        </div>
                        <CardDescription className="text-xs font-bold uppercase tracking-widest opacity-60">Verified credentials & awards</CardDescription>
                    </CardHeader>
                    <CardContent className="p-8 pt-4 space-y-6 flex-1 flex flex-col">
                        <div className="space-y-3">
                            <Label className="text-[10px] font-black uppercase tracking-widest ml-1">Add Credential</Label>
                            <div className="flex gap-3">
                                <Input
                                    value={certInputValue}
                                    onChange={(e) => setCertInputValue(e.target.value)}
                                    onKeyDown={handleCertKeyDown}
                                    placeholder="e.g. AWS CERTIFIED ARCHITECT"
                                    className="h-14 rounded-2xl bg-muted/40 border-border/40 text-sm font-black focus-visible:ring-primary/20"
                                />
                                <Button onClick={addCertification} className="h-14 w-14 rounded-2xl bg-foreground text-background hover:bg-emerald-500 hover:text-white transition-all active:scale-95 shadow-lg">
                                    <Plus className="w-6 h-6" />
                                </Button>
                            </div>
                        </div>

                        <div className="flex-1 min-h-[250px] rounded-3xl border border-dashed border-border/60 p-6 flex flex-col gap-4 group hover:border-emerald-500/20 transition-colors">
                            {certifications.length === 0 ? (
                                <div className="w-full h-full flex flex-col items-center justify-center text-center space-y-2 opacity-30 select-none">
                                    <ShieldCheck className="w-8 h-8" />
                                    <p className="text-xs font-black uppercase tracking-widest italic">No credentials logged yet</p>
                                </div>
                            ) : (
                                certifications.map(cert => (
                                    <div
                                        key={cert}
                                        className="group/cert flex items-center justify-between p-4 rounded-2xl bg-emerald-500/5 text-emerald-700 dark:text-emerald-400 border border-emerald-500/10 hover:bg-emerald-500 hover:text-white transition-all duration-300"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="p-2 rounded-lg bg-emerald-500/20 group-hover/cert:bg-white/20 transition-colors">
                                                <Award className="w-4 h-4" />
                                            </div>
                                            <span className="text-sm font-black tracking-tight">{cert}</span>
                                        </div>
                                        <button
                                            onClick={() => removeCertification(cert)}
                                            className="p-2 opacity-40 group-hover/cert:opacity-100 hover:bg-white/20 rounded-xl transition-all active:scale-90"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Hint Panel */}
            <div className="bg-foreground text-background rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                    <div className="p-4 rounded-2xl bg-white/10">
                        <Target className="w-8 h-8 text-primary group-hover:rotate-12 transition-transform" />
                    </div>
                    <div>
                        <h4 className="text-lg font-black italic tracking-tight italic">PRO TIP: MASTER THE LIST</h4>
                        <p className="text-xs font-bold opacity-60 uppercase tracking-widest">Adding 5+ skills increases profile visibility by 40%</p>
                    </div>
                </div>
                <div className="flex items-center gap-4 px-6 py-2 rounded-full border border-white/20 text-[10px] font-black uppercase tracking-widest animate-pulse">
                    <Save className="w-4 h-4" />
                    Real-time Synchronization Active
                </div>
            </div>
        </div>
    );
}


