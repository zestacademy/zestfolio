'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Loader2, Plus, Trash2, GraduationCap } from 'lucide-react';
import { Education } from '@/types';

export default function EducationForm() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [educations, setEducations] = useState<Education[]>([]);
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
            if (!user) return;
            try {
                const docRef = doc(db, 'portfolios', user.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setEducations(data.education || []);
                }
            } catch (error) {
                console.error("Error fetching education:", error);
            }
        };
        fetchEducation();
    }, [user]);

    const handleAddEducation = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        setLoading(true);
        try {
            const eduToAdd = { ...newEdu };
            await updateDoc(doc(db, 'portfolios', user.uid), {
                education: arrayUnion(eduToAdd)
            });
            setEducations(prev => [...prev, eduToAdd]);
            setNewEdu({
                institution: '',
                degree: '',
                fieldOfStudy: '',
                startDate: '',
                endDate: '',
                current: false,
            });
        } catch (error) {
            console.error("Error adding education:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (edu: Education) => {
        if (!user) return;
        try {
            await updateDoc(doc(db, 'portfolios', user.uid), {
                education: arrayRemove(edu)
            });
            setEducations(prev => prev.filter(item => item !== edu)); // Basic filter, might need ID for robustness
        } catch (error) {
            console.error("Error deleting education:", error);
        }
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Add Education</CardTitle>
                    <CardDescription>Add your degrees and schools.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleAddEducation} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="institution">Institution / University</Label>
                                <Input id="institution" value={newEdu.institution} onChange={(e) => setNewEdu({ ...newEdu, institution: e.target.value })} placeholder="e.g. Stanford University" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="degree">Degree</Label>
                                <Input id="degree" value={newEdu.degree} onChange={(e) => setNewEdu({ ...newEdu, degree: e.target.value })} placeholder="e.g. Bachelor of Science" required />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="fieldOfStudy">Field of Study</Label>
                            <Input id="fieldOfStudy" value={newEdu.fieldOfStudy} onChange={(e) => setNewEdu({ ...newEdu, fieldOfStudy: e.target.value })} placeholder="e.g. Computer Science" required />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="startDate">Start Date</Label>
                                <Input id="startDate" type="text" value={newEdu.startDate} onChange={(e) => setNewEdu({ ...newEdu, startDate: e.target.value })} placeholder="e.g. 2020" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="endDate">End Date (or Expected)</Label>
                                <Input id="endDate" type="text" value={newEdu.endDate} onChange={(e) => setNewEdu({ ...newEdu, endDate: e.target.value })} placeholder="e.g. 2024" />
                            </div>
                        </div>
                        <Button type="submit" disabled={loading} className="w-full">
                            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                            Add Education
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <div className="grid gap-4">
                {educations.map((edu, index) => (
                    <Card key={index} className="relative">
                        <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle className="text-lg">{edu.institution}</CardTitle>
                                    <div className="text-sm font-medium text-muted-foreground mt-1">{edu.degree} in {edu.fieldOfStudy}</div>
                                </div>
                                <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => handleDelete(edu)}>
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center text-sm text-muted-foreground">
                                <GraduationCap className="mr-2 h-4 w-4" />
                                {edu.startDate} - {edu.endDate || 'Present'}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
