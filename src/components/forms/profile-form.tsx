'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/lib/auth-context';
import { db, storage } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Save, Camera, User } from 'lucide-react';
import Image from 'next/image';

export default function ProfileForm() {
    const { user } = useAuth();
    const [saving, setSaving] = useState(false);
    const [initialized, setInitialized] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [profilePhotoURL, setProfilePhotoURL] = useState<string>('');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [formData, setFormData] = useState({
        username: '',
        fullName: '',
        professionalTitle: '',
        aboutMe: '',
        domain: '',
        email: '',
        publicEmail: '',
        linkedin: '',
        github: '',
        twitter: '',
        website: '',
        profilePhoto: '',
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
                    if (data.profilePhoto) {
                        setProfilePhotoURL(data.profilePhoto);
                    }
                } else {
                    setFormData(prev => ({ ...prev, fullName: user.displayName || '', email: user.email || '' }));
                }
            } catch (error) {
                console.error("Error fetching profile:", error);
            } finally {
                setInitialized(true);
            }
        };
        fetchProfile();
    }, [user]);

    // Auto-save effect
    useEffect(() => {
        if (!initialized || !user) return;

        const timer = setTimeout(async () => {
            setSaving(true);
            try {
                const { linkedin, github, twitter, website, ...profileData } = formData;
                const dataToSave = {
                    ...profileData,
                    socialLinks: { linkedin, github, twitter, website },
                    updatedAt: new Date(),
                    uid: user.uid,
                };
                await setDoc(doc(db, 'portfolios', user.uid), dataToSave, { merge: true });
            } catch (error) {
                console.error("Error auto-saving:", error);
            } finally {
                setSaving(false);
            }
        }, 2000); // 2 second debounce

        return () => clearTimeout(timer);
    }, [formData, user, initialized]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !user) return;

        if (!file.type.startsWith('image/')) {
            alert('Please upload an image file');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            alert('File size must be less than 5MB');
            return;
        }

        setUploading(true);
        try {
            const filename = `profile-photos/${user.uid}/${Date.now()}-${file.name}`;
            const storageRef = ref(storage, filename);
            await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(storageRef);

            setProfilePhotoURL(downloadURL);
            setFormData(prev => ({ ...prev, profilePhoto: downloadURL }));
        } catch (error) {
            console.error("Error uploading photo:", error);
            alert('Failed to upload photo. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Manual save is now just a duplicate action, but helps user confidence
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="fixed bottom-4 right-4 z-50">
                {saving && (
                    <div className="bg-primary text-primary-foreground px-4 py-2 rounded-full shadow-lg flex items-center gap-2 text-sm animate-in fade-in slide-in-from-bottom-5">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Saving changes...
                    </div>
                )}
            </div>

            {/* Profile Photo Card */}
            <Card>
                <CardHeader>
                    <CardTitle>Profile Photo</CardTitle>
                    <CardDescription>Upload a professional photo for your portfolio.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                        {/* Photo Preview */}
                        <div className="relative w-32 h-32 rounded-full overflow-hidden bg-muted border-4 border-border">
                            {profilePhotoURL ? (
                                <Image
                                    src={profilePhotoURL}
                                    alt="Profile"
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-primary/10">
                                    <User className="w-16 h-16 text-primary/30" />
                                </div>
                            )}
                            {uploading && (
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                    <Loader2 className="w-8 h-8 text-white animate-spin" />
                                </div>
                            )}
                        </div>

                        {/* Upload Button */}
                        <div className="flex-1 space-y-3">
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handlePhotoUpload}
                                className="hidden"
                            />
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={uploading}
                                className="gap-2"
                            >
                                <Camera className="w-4 h-4" />
                                {uploading ? 'Uploading...' : profilePhotoURL ? 'Change Photo' : 'Upload Photo'}
                            </Button>
                            <p className="text-xs text-muted-foreground">
                                Recommended: Square image, at least 400x400px, max 5MB
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Personal Information Card */}
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle>Personal Information</CardTitle>
                            <CardDescription>This will be displayed on your public portfolio header.</CardDescription>
                        </div>
                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                            {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                            {saving ? 'Auto-saving...' : 'Auto-saved'}
                        </div>
                    </div>
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

            {/* Social Links Card */}
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
                {/* Visual indicator mostly, since it's auto-saving */}
                <p className="text-sm text-muted-foreground mr-4 flex items-center">
                    {saving ? 'Saving changes...' : 'All changes saved'}
                </p>
            </div>
        </form>
    );
}
