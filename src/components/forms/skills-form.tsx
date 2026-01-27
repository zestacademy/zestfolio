'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Save, X, Plus } from 'lucide-react';

export default function SkillsForm() {
    const { user } = useAuth();
    const [saving, setSaving] = useState(false);
    const [initialized, setInitialized] = useState(false);
    const [skills, setSkills] = useState<string[]>([]);
    const [certifications, setCertifications] = useState<string[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [certInputValue, setCertInputValue] = useState('');

    useEffect(() => {
        const fetchSkills = async () => {
            if (!user) return;
            try {
                const docRef = doc(db, 'portfolios', user.uid);
                const docSnap = await getDoc(docRef);
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
    }, [user]);

    // Auto-save effect
    useEffect(() => {
        if (!initialized || !user) return;

        // Debounce to avoid excessive writes while adding/removing rapidly
        const timer = setTimeout(async () => {
            setSaving(true);
            try {
                await updateDoc(doc(db, 'portfolios', user.uid), {
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
    }, [skills, certifications, user, initialized]);

    const handleManualSave = async () => {
        if (!user) return;
        setSaving(true);
        try {
            await updateDoc(doc(db, 'portfolios', user.uid), {
                skills: skills,
                certifications: certifications
            });
        } catch (error) {
            console.error("Error saving skills:", error);
        } finally {
            setSaving(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && inputValue.trim()) {
            e.preventDefault();
            if (!skills.includes(inputValue.trim())) {
                setSkills([...skills, inputValue.trim()]);
            }
            setInputValue('');
        }
    };

    const addSkill = () => {
        if (inputValue.trim()) {
            if (!skills.includes(inputValue.trim())) {
                setSkills([...skills, inputValue.trim()]);
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
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle>Skills</CardTitle>
                            <CardDescription>Add your technical skills and tools.</CardDescription>
                        </div>
                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                            {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                            {saving ? 'Saving...' : 'All saved'}
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Add Skills</Label>
                        <div className="flex gap-2">
                            <Input
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="e.g. React, Python, AWS"
                            />
                            <Button onClick={addSkill} size="icon">
                                <Plus className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-2 min-h-[100px] border rounded-md p-4 bg-muted/10">
                        {skills.length === 0 && <p className="text-sm text-muted-foreground italic">No skills added yet.</p>}
                        {skills.map(skill => (
                            <div key={skill} className="bg-primary/10 text-primary border border-primary/20 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                                {skill}
                                <button onClick={() => removeSkill(skill)} className="hover:text-destructive transition-colors">
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Certifications Card */}
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle>Certifications</CardTitle>
                            <CardDescription>Add your professional certifications and credentials.</CardDescription>
                        </div>
                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                            {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                            {saving ? 'Saving...' : 'All saved'}
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Add Certification</Label>
                        <div className="flex gap-2">
                            <Input
                                value={certInputValue}
                                onChange={(e) => setCertInputValue(e.target.value)}
                                onKeyDown={handleCertKeyDown}
                                placeholder="e.g. AWS Certified Solutions Architect"
                            />
                            <Button onClick={addCertification} size="icon">
                                <Plus className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-2 min-h-[100px] border rounded-md p-4 bg-muted/10">
                        {certifications.length === 0 && <p className="text-sm text-muted-foreground italic">No certifications added yet.</p>}
                        {certifications.map(cert => (
                            <div key={cert} className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                                {cert}
                                <button onClick={() => removeCertification(cert)} className="hover:text-destructive transition-colors">
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Single Save Button for entire section */}
            <div className="flex justify-end">
                <Button onClick={handleManualSave} disabled={saving} size="lg">
                    {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                    Save All Changes
                </Button>
            </div>
        </div>
    );
}
