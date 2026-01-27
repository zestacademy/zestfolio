'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Loader2, Plus, Trash2, GraduationCap, Pencil, Save } from 'lucide-react';
import { Education } from '@/types';

export default function EducationForm() {
    const { user } = useAuth();
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
            if (editingIndex !== null) {
                // Update
                const updatedEducation = [...educations];
                updatedEducation[editingIndex] = newEdu;
                await updateDoc(doc(db, 'portfolios', user.uid), {
                    education: updatedEducation
                });
                setEducations(updatedEducation);
                setEditingIndex(null);
            } else {
                // Add
                const eduToAdd = { ...newEdu };
                await updateDoc(doc(db, 'portfolios', user.uid), {
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
        if (!user) return;
        if (confirm('Are you sure you want to delete this education entry?')) {
            try {
                await updateDoc(doc(db, 'portfolios', user.uid), {
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
        <div className="space-y-6">
            <Card className={editingIndex !== null ? "border-primary" : ""}>
                <CardHeader>
                    <CardTitle>{editingIndex !== null ? 'Edit Education' : 'Add Education'}</CardTitle>
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
                                <Input id="endDate" type="text" value={newEdu.endDate || ''} onChange={(e) => setNewEdu({ ...newEdu, endDate: e.target.value })} placeholder="e.g. 2024" />
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button type="submit" disabled={loading} className="flex-1">
                                {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : (editingIndex !== null ? <Save className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />)}
                                {editingIndex !== null ? 'Update Education' : 'Add Education'}
                            </Button>
                            {editingIndex !== null && (
                                <Button type="button" variant="outline" onClick={handleCancelEdit}>
                                    Cancel
                                </Button>
                            )}
                        </div>
                    </form>
                </CardContent>
            </Card>

            <div className="grid gap-4">
                {educations
                    .sort((a, b) => {
                        // Sort by start date in descending order (most recent first)
                        const yearA = parseInt(a.startDate) || 0;
                        const yearB = parseInt(b.startDate) || 0;
                        return yearB - yearA;
                    })
                    .map((edu, index) => (
                        <Card key={index} className={`relative ${editingIndex === index ? 'ring-2 ring-primary' : ''}`}>
                            <CardHeader className="pb-2">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle className="text-lg">{edu.institution}</CardTitle>
                                        <div className="text-sm font-medium text-muted-foreground mt-1">{edu.degree} in {edu.fieldOfStudy}</div>
                                    </div>
                                    <div className="flex gap-1">
                                        <Button variant="ghost" size="icon" onClick={() => handleEdit(edu, educations.indexOf(edu))}>
                                            <Pencil className="w-4 h-4 text-primary" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => handleDelete(edu)}>
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
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
