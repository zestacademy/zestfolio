'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Plus, Trash2, GraduationCap, Pencil, Save, X, Calendar, BookOpen, School } from 'lucide-react';
import { Education } from '@/types';
import { cn } from '@/lib/utils';

export default function EducationForm() {
    const { user, profile } = useAuth();
    const [loading, setLoading] = useState(false);
    const [educations, setEducations] = useState<Education[]>([]);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [newEdu, setNewEdu] = useState<Education>({
        institution: '',
        degree: '',
        fieldOfStudy: '',
        startDate: '',
        endDate: '',
        current: false,
    });

    useEffect(() => {
        const fetchEducation = async () => {
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
                    setEducations(data.education || []);
                }
            } catch (error) {
                console.error("Error fetching education:", error);
            }
        };
        fetchEducation();
    }, [user, profile]);

    const handleAddEducation = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !profile?.zestId) return;
        setLoading(true);
        try {
            if (editingIndex !== null) {
                const updatedEducation = [...educations];
                updatedEducation[editingIndex] = newEdu;
                await updateDoc(doc(db, 'portfolios', profile.zestId), {
                    education: updatedEducation
                });
                setEducations(updatedEducation);
                setEditingIndex(null);
            } else {
                const eduToAdd = { ...newEdu };
                await updateDoc(doc(db, 'portfolios', profile.zestId), {
                    education: arrayUnion(eduToAdd)
                });
                setEducations(prev => [...prev, eduToAdd]);
            }

            setNewEdu({
                institution: '',
                degree: '',
                fieldOfStudy: '',
                startDate: '',
                endDate: '',
                current: false,
            });
        } catch (error) {
            console.error("Error saving education:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (edu: Education) => {
        if (!user || !profile?.zestId) return;
        if (confirm('Are you sure you want to delete this education entry?')) {
            try {
                await updateDoc(doc(db, 'portfolios', profile.zestId), {
                    education: arrayRemove(edu)
                });
                setEducations(prev => prev.filter(item => item !== edu));
                if (editingIndex !== null) setEditingIndex(null);
            } catch (error) {
                console.error("Error deleting education:", error);
            }
        }
    }

    const handleEdit = (edu: Education, index: number) => {
        setNewEdu(edu);
        setEditingIndex(index);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        setEditingIndex(null);
        setNewEdu({
            institution: '',
            degree: '',
            fieldOfStudy: '',
            startDate: '',
            endDate: '',
            current: false,
        });
    };

    return (
        <div className="space-y-12">
            {/* Entry Form Card */}
            <Card className={cn(
                "rounded-[40px] border-border/40 bg-card/30 overflow-hidden transition-all duration-500",
                editingIndex !== null ? "border-primary/40 shadow-[0_0_50px_rgba(var(--primary-rgb),0.1)]" : ""
            )}>
                <CardHeader className="p-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className={cn("p-2 rounded-xl transition-colors", editingIndex !== null ? "bg-primary text-white" : "bg-primary/10 text-primary")}>
                                {editingIndex !== null ? <Pencil className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                            </div>
                            <div>
                                <CardTitle className="text-2xl font-black uppercase italic tracking-tight italic">
                                    {editingIndex !== null ? 'Modify Entry' : 'New Academic Chapter'}
                                </CardTitle>
                                <CardDescription className="text-xs font-bold uppercase tracking-widest opacity-60">
                                    {editingIndex !== null ? `Updating records for entry #${editingIndex + 1}` : 'Insert your latest qualification'}
                                </CardDescription>
                            </div>
                        </div>
                        {editingIndex !== null && (
                            <Button variant="ghost" size="sm" onClick={handleCancelEdit} className="rounded-xl hover:bg-destructive/10 text-destructive font-black text-[10px] uppercase tracking-widest">
                                <X className="w-4 h-4 mr-2" /> DISCARD CHANGES
                            </Button>
                        )}
                    </div>
                </CardHeader>
                <CardContent className="p-8 pt-0">
                    <form onSubmit={handleAddEducation} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3 font-bold">
                                <Label className="text-[11px] font-black uppercase tracking-wider ml-1 flex items-center gap-2">
                                    <School className="w-3.5 h-3.5" /> Institution Name
                                </Label>
                                <Input value={newEdu.institution} onChange={(e) => setNewEdu({ ...newEdu, institution: e.target.value })} placeholder="e.g. STANFORD UNIVERSITY" className="h-14 rounded-2xl bg-muted/40 border-border/40 text-base font-black italic tracking-tight" required />
                            </div>
                            <div className="space-y-3 font-bold">
                                <Label className="text-[11px] font-black uppercase tracking-wider ml-1 flex items-center gap-2">
                                    <BookOpen className="w-3.5 h-3.5" /> Qualification Type
                                </Label>
                                <Input value={newEdu.degree} onChange={(e) => setNewEdu({ ...newEdu, degree: e.target.value })} placeholder="e.g. BACHELOR OF SCIENCE" className="h-14 rounded-2xl bg-muted/40 border-border/40 text-base font-black italic tracking-tight" required />
                            </div>
                        </div>

                        <div className="space-y-3 font-bold">
                            <Label className="text-[11px] font-black uppercase tracking-wider ml-1">Field of Specialist Mastery</Label>
                            <Input value={newEdu.fieldOfStudy} onChange={(e) => setNewEdu({ ...newEdu, fieldOfStudy: e.target.value })} placeholder="e.g. COMPUTATIONAL MATHEMATICS" className="h-14 rounded-2xl bg-muted/40 border-border/40 text-base font-black italic tracking-tight" required />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3 font-bold">
                                <Label className="text-[11px] font-black uppercase tracking-wider ml-1 flex items-center gap-2">
                                    <Calendar className="w-3.5 h-3.5" /> Entry Year
                                </Label>
                                <Input type="text" value={newEdu.startDate} onChange={(e) => setNewEdu({ ...newEdu, startDate: e.target.value })} placeholder="e.g. 2021" className="h-14 rounded-2xl bg-muted/40 border-border/40 text-base font-black italic tracking-tight" required />
                            </div>
                            <div className="space-y-3 font-bold">
                                <Label className="text-[11px] font-black uppercase tracking-wider ml-1 flex items-center gap-2">
                                    <Calendar className="w-3.5 h-3.5" /> Projected / Exit Year
                                </Label>
                                <Input type="text" value={newEdu.endDate || ''} onChange={(e) => setNewEdu({ ...newEdu, endDate: e.target.value })} placeholder="e.g. 2025" className="h-14 rounded-2xl bg-muted/40 border-border/40 text-base font-black italic tracking-tight" />
                            </div>
                        </div>

                        <Button type="submit" disabled={loading} className="w-full h-16 rounded-3xl bg-foreground text-background font-black text-lg uppercase tracking-widest hover:bg-primary hover:text-white transition-all active:scale-[0.98] shadow-2xl">
                            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (editingIndex !== null ? <Save className="w-6 h-6 mr-3" /> : <Plus className="w-6 h-6 mr-3" />)}
                            {editingIndex !== null ? 'SYNC RECORD UPDATE' : 'DEPLOY ACADEMIC RECORD'}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {/* List Section */}
            <div className="space-y-6">
                <div className="flex items-center gap-4 px-2">
                    <h3 className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground/50">Stored Academic History</h3>
                    <div className="flex-1 h-[1px] bg-border/40" />
                </div>

                {educations.length === 0 ? (
                    <div className="py-20 flex flex-col items-center justify-center text-center space-y-4 rounded-[40px] border border-dashed border-border/40 bg-muted/20 opacity-40">
                        <GraduationCap className="w-16 h-16 text-primary/20" />
                        <div className="space-y-1">
                            <p className="font-black uppercase tracking-widest italic tracking-tight">Zero Academic Logs Found</p>
                            <p className="text-xs font-bold">Initiate your first record using the vault above.</p>
                        </div>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {educations
                            .sort((a, b) => (parseInt(b.startDate) || 0) - (parseInt(a.startDate) || 0))
                            .map((edu, idx) => (
                                <div
                                    key={idx}
                                    className={cn(
                                        "group relative flex flex-col md:flex-row md:items-center justify-between p-8 rounded-[36px] border bg-card/60 transition-all duration-500 hover:shadow-2xl hover:bg-card hover:-translate-y-1",
                                        editingIndex === educations.indexOf(edu) ? "border-primary/60 bg-primary/5 ring-4 ring-primary/5" : "border-border/40"
                                    )}
                                >
                                    <div className="flex items-center gap-6">
                                        <div className="hidden sm:flex w-16 h-16 rounded-2xl bg-background border border-border/40 items-center justify-center text-primary transform group-hover:rotate-6 transition-transform">
                                            <GraduationCap className="w-8 h-8" />
                                        </div>
                                        <div>
                                            <h4 className="text-2xl font-black tracking-tight italic uppercase group-hover:text-primary transition-colors leading-none mb-2">{edu.institution}</h4>
                                            <div className="flex flex-wrap items-center gap-2 text-sm font-bold text-muted-foreground">
                                                <span className="text-foreground">{edu.degree}</span>
                                                <div className="w-1 h-1 rounded-full bg-border" />
                                                <span>{edu.fieldOfStudy}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-6 md:mt-0 flex items-center justify-between md:justify-end gap-6">
                                        <div className="text-right">
                                            <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 mb-1">Timeframe</div>
                                            <div className="text-sm font-black italic">{edu.startDate} — {edu.endDate || 'PRESENT'}</div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button variant="ghost" size="icon" onClick={() => handleEdit(edu, educations.indexOf(edu))} className="w-12 h-12 rounded-xl bg-primary/5 text-primary hover:bg-primary hover:text-white transition-all">
                                                <Pencil className="w-5 h-5" />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => handleDelete(edu)} className="w-12 h-12 rounded-xl bg-destructive/5 text-destructive hover:bg-destructive hover:text-white transition-all">
                                                <Trash2 className="w-5 h-5" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </div>
                )}
            </div>
        </div>
    );
}

