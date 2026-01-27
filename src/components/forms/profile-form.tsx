'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Save } from 'lucide-react';

export default function ProfileForm() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        fullName: '',
        professionalTitle: '',
        aboutMe: '',
        domain: '',
        email: '', // Read-only usually, but editable field for portfolio display
        publicEmail: '',
        linkedin: '',
        github: '',
        twitter: '',
        website: '',
    });

    useEffect(() => {
        const fetchProfile = async () => {
            if (!user) return;
            try {
                const docRef = doc(db, 'portfolios', user.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setFormData(prev => ({ ...prev, ...data, ...data.socialLinks }));
                } else {
                    // Init with auth data
                    setFormData(prev => ({ ...prev, fullName: user.displayName || '', email: user.email || '' }));
                }
            } catch (error) {
                console.error("Error fetching profile:", error);
            }
        };
        fetchProfile();
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        setLoading(true);
        try {
            const { linkedin, github, twitter, website, ...profileData } = formData;
            const dataToSave = {
                ...profileData,
                socialLinks: { linkedin, github, twitter, website },
                updatedAt: new Date(),
                uid: user.uid, // Ensure UID is saved
            };

            await setDoc(doc(db, 'portfolios', user.uid), dataToSave, { merge: true });
            // You might want to show a toast here
        } catch (error) {
            console.error("Error saving profile:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>This will be displayed on your public portfolio header.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="username">Username (URL)</Label>
                        <div className="flex">
                            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground text-sm">
                                zestfolio.vercel.app/u/
                            </span>
                            <Input
                                id="username"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                placeholder="john.doe"
                                className="rounded-l-none"
                                required
                            />
                        </div>
                        <p className="text-xs text-muted-foreground">This will be your unique portfolio link.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="fullName">Full Name</Label>
                            <Input id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="e.g. John Doe" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="professionalTitle">Professional Title</Label>
                            <Input id="professionalTitle" name="professionalTitle" value={formData.professionalTitle} onChange={handleChange} placeholder="e.g. Frontend Developer" required />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="aboutMe">About Me (Short Bio)</Label>
                        <textarea
                            id="aboutMe"
                            name="aboutMe"
                            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[100px]"
                            value={formData.aboutMe}
                            onChange={handleChange}
                            placeholder="Briefly describe your passion and goals..."
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="domain">Domain / Field</Label>
                            <Input id="domain" name="domain" value={formData.domain} onChange={handleChange} placeholder="e.g. Web Development" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="publicEmail">Public Email</Label>
                            <Input id="publicEmail" name="publicEmail" value={formData.publicEmail} onChange={handleChange} placeholder="Email for contact form" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Social Links</CardTitle>
                    <CardDescription>Where can people find you online?</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="linkedin">LinkedIn URL</Label>
                            <Input id="linkedin" name="linkedin" value={formData.linkedin} onChange={handleChange} placeholder="https://linkedin.com/in/..." />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="github">GitHub URL</Label>
                            <Input id="github" name="github" value={formData.github} onChange={handleChange} placeholder="https://github.com/..." />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="twitter">Twitter / X URL</Label>
                            <Input id="twitter" name="twitter" value={formData.twitter} onChange={handleChange} placeholder="https://x.com/..." />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="website">Personal Website / Blog</Label>
                            <Input id="website" name="website" value={formData.website} onChange={handleChange} placeholder="https://..." />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-end">
                <Button type="submit" disabled={loading} className="min-w-[120px]">
                    {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                    Save Changes
                </Button>
            </div>
        </form>
    );
}
