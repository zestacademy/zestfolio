'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/lib/auth-context';
import { db, storage } from '@/lib/firebase';
import { doc, getDoc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Save, Camera, User, CheckCircle2, XCircle, Globe, Mail, Phone, MapPin, Linkedin, Github, Twitter, Link as LinkIcon, Sparkles } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export default function ProfileForm() {
    const { user, profile } = useAuth();
    const [saving, setSaving] = useState(false);
    const [initialized, setInitialized] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [profilePhotoURL, setProfilePhotoURL] = useState<string>('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Username handling
    const [usernameError, setUsernameError] = useState('');
    const [isCheckingUsername, setIsCheckingUsername] = useState(false);
    const [isUsernameAvailable, setIsUsernameAvailable] = useState(false);

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
        phone: '',
        location: '',
        zestId: '',
    });

    useEffect(() => {
        const fetchProfile = async () => {
            if (!user || !profile?.zestId) return;
            try {
                // Use Zest ID as Document ID
                const docRef = doc(db, 'portfolios', profile.zestId);
                const docSnap = await getDoc(docRef);

                const userRef = doc(db, 'users', user.uid);
                const userSnap = await getDoc(userRef);
                const userData = userSnap.exists() ? userSnap.data() : {};

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setFormData(prev => ({
                        ...prev,
                        ...data,
                        ...data.socialLinks,
                        zestId: profile.zestId || '',
                        fullName: data.fullName || userData.displayName || '',
                        email: data.email || userData.email || '',
                        profilePhoto: data.profilePhoto || userData.photoURL || '',
                    }));
                    if (data.profilePhoto || userData.photoURL) {
                        setProfilePhotoURL(data.profilePhoto || userData.photoURL);
                    }
                    if (data.username) {
                        setIsUsernameAvailable(true);
                    }
                } else {
                    // Fallback to OLD UID Document ID for migration
                    const oldDocRef = doc(db, 'portfolios', user.uid);
                    const oldDocSnap = await getDoc(oldDocRef);

                    if (oldDocSnap.exists()) {
                        const data = oldDocSnap.data();
                        setFormData(prev => ({
                            ...prev,
                            ...data,
                            ...data.socialLinks,
                            zestId: profile.zestId || '',
                            fullName: data.fullName || userData.displayName || '',
                            email: data.email || userData.email || '',
                            profilePhoto: data.profilePhoto || userData.photoURL || '',
                        }));
                        if (data.profilePhoto || userData.photoURL) {
                            setProfilePhotoURL(data.profilePhoto || userData.photoURL);
                        }
                        if (data.username) {
                            setIsUsernameAvailable(true);
                        }
                    } else {
                        setFormData(prev => ({
                            ...prev,
                            fullName: userData.displayName || '',
                            email: userData.email || '',
                            profilePhoto: userData.photoURL || '',
                            zestId: profile.zestId || '',
                        }));
                        if (userData.photoURL) {
                            setProfilePhotoURL(userData.photoURL);
                        }
                    }
                }
            } catch (error) {
                console.error("Error fetching profile:", error);
            } finally {
                setInitialized(true);
            }
        };
        fetchProfile();
    }, [user, profile]);

    // Check Username Availability
    useEffect(() => {
        if (!initialized || !user || !profile?.zestId) return;

        const checkUsername = async () => {
            const username = formData.username;

            if (!username) {
                setUsernameError('Username is required');
                setIsUsernameAvailable(false);
                return;
            }
            if (username.length < 3) {
                setUsernameError('Username must be at least 3 characters');
                setIsUsernameAvailable(false);
                return;
            }
            if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
                setUsernameError('Only letters, numbers, hyphens and underscores allowed');
                setIsUsernameAvailable(false);
                return;
            }

            setIsCheckingUsername(true);
            try {
                const portfoliosRef = collection(db, 'portfolios');
                const q = query(portfoliosRef, where('username', '==', username));
                const querySnapshot = await getDocs(q);

                let isTaken = false;
                querySnapshot.forEach((doc) => {
                    // Check against Zest ID
                    if (doc.id !== profile.zestId) {
                        isTaken = true;
                    }
                });

                if (isTaken) {
                    setUsernameError('This username is already taken');
                    setIsUsernameAvailable(false);
                } else {
                    setUsernameError('');
                    setIsUsernameAvailable(true);
                }
            } catch (error) {
                console.error("Error checking username:", error);
            } finally {
                setIsCheckingUsername(false);
            }
        };

        const timer = setTimeout(checkUsername, 500);
        return () => clearTimeout(timer);
    }, [formData.username, user, profile, initialized]);

    // Auto-save effect
    useEffect(() => {
        if (!initialized || !user || !profile?.zestId) return;
        const currentZestId = profile.zestId;

        if (usernameError || !isUsernameAvailable) return;

        const timer = setTimeout(async () => {
            setSaving(true);
            try {
                const { linkedin, github, twitter, website, ...profileData } = formData;
                const dataToSave = {
                    ...profileData,
                    socialLinks: { linkedin, github, twitter, website },
                    updatedAt: new Date(),
                    uid: user.uid,
                    zestId: currentZestId
                };
                await setDoc(doc(db, 'portfolios', currentZestId), dataToSave, { merge: true });
            } catch (error) {
                console.error("Error auto-saving:", error);
            } finally {
                setSaving(false);
            }
        }, 2000);

        return () => clearTimeout(timer);
    }, [formData, user, profile, initialized, usernameError, isUsernameAvailable]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-12">
            {/* Auto-save Status Indicator */}
            <div className="fixed bottom-6 right-6 z-50">
                <div className={cn(
                    "flex items-center gap-3 px-6 py-3 rounded-2xl shadow-2xl transition-all duration-500 border backdrop-blur-md",
                    saving
                        ? "bg-primary text-white border-primary/20 translate-y-0"
                        : "bg-background/80 text-muted-foreground border-border translate-y-20 opacity-0"
                )}>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm font-black uppercase tracking-widest">Saving Engine Active</span>
                </div>
            </div>

            {/* Top Grid: Photo & Essential IDs */}
            <div className="grid lg:grid-cols-12 gap-10">
                {/* Photo Column */}
                <div className="lg:col-span-4 space-y-6">
                    <Card className="rounded-[40px] border-border/40 overflow-hidden bg-card/30">
                        <CardHeader className="text-center pb-2">
                            <CardTitle className="text-xl font-black uppercase tracking-tight">Identity Image</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center gap-8 pb-10">
                            <div className="relative group">
                                <div className="absolute -inset-1 bg-gradient-to-tr from-primary to-blue-500 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
                                <div className="relative w-48 h-48 rounded-full overflow-hidden bg-muted border-8 border-background shadow-2xl transition-transform group-hover:scale-[1.02] duration-500">
                                    {profilePhotoURL ? (
                                        <Image
                                            src={profilePhotoURL}
                                            alt="Profile"
                                            fill
                                            className="object-cover"
                                            unoptimized
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-primary/5">
                                            <User className="w-24 h-24 text-primary/10" />
                                        </div>
                                    )}
                                </div>
                                <div className="absolute bottom-2 right-2 p-3 rounded-2xl bg-primary text-white shadow-xl scale-90 group-hover:scale-100 transition-transform cursor-pointer">
                                    <Camera className="w-5 h-5" />
                                </div>
                            </div>

                            <div className="w-full space-y-4">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Photo Reference URL</Label>
                                <Input
                                    value={formData.profilePhoto}
                                    onChange={(e) => {
                                        setFormData(prev => ({ ...prev, profilePhoto: e.target.value }));
                                        setProfilePhotoURL(e.target.value);
                                    }}
                                    placeholder="Paste premium image link..."
                                    className="h-12 rounded-2xl bg-muted/30 border-border/40 focus-visible:ring-primary/20 text-sm font-medium"
                                />
                                <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 space-y-2">
                                    <p className="text-[10px] font-bold text-primary uppercase flex items-center gap-2">
                                        <Sparkles className="w-3 h-3" /> Recommended Hosts
                                    </p>
                                    <div className="flex gap-4 text-[11px] font-medium opacity-60">
                                        <a href="https://postimages.org" target="_blank" className="hover:text-primary transition-colors">PostImage</a>
                                        <a href="https://imgbb.com" target="_blank" className="hover:text-primary transition-colors">ImgBB</a>
                                        <a href="https://imgur.com" target="_blank" className="hover:text-primary transition-colors">Imgur</a>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="rounded-[40px] border-border/40 bg-primary/5 border-primary/10">
                        <CardContent className="p-8 space-y-4">
                            <div className="flex justify-between items-center">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-primary">System Fingerprint</Label>
                                <div className="px-2 py-0.5 rounded-lg bg-primary/20 text-primary text-[9px] font-black">LOCKED</div>
                            </div>
                            <div className="text-3xl font-black text-primary tracking-tighter italic">
                                {formData.zestId || 'PENDING'}
                            </div>
                            <p className="text-[11px] font-medium text-muted-foreground leading-relaxed">
                                This is your immutable Zestfolio handle. It cannot be modified as it's linked to your security protocols.
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Info Column */}
                <div className="lg:col-span-8 space-y-8">
                    {/* Primary Identity */}
                    <Card className="rounded-[40px] border-border/40 bg-card/30">
                        <CardHeader className="p-8 pb-4">
                            <div className="flex justify-between items-center">
                                <CardTitle className="text-2xl font-black uppercase italic tracking-tight">Main Identity</CardTitle>
                                <div className="flex items-center gap-2 text-[10px] font-black text-muted-foreground/50">
                                    {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                                    AUTO-ENGAGED
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-8 pt-4 space-y-8">
                            {/* URL Handle */}
                            <div className="space-y-4">
                                <Label className="text-[11px] font-black uppercase tracking-wider ml-1">Universal Handle (URL)</Label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-5 pointer-events-none text-muted-foreground/40 font-bold text-sm">
                                        zestfolio.zestacademy.tech/u/
                                    </div>
                                    <Input
                                        name="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        placeholder="your.handle"
                                        className={cn(
                                            "h-14 pl-[198px] rounded-2xl bg-muted/50 border-border/40 text-base font-black tracking-tight focus-visible:ring-primary/20",
                                            usernameError && "border-red-500/50 focus-visible:ring-red-500/10 text-red-600",
                                            isUsernameAvailable && "border-green-500/50 focus-visible:ring-green-500/10 text-green-600"
                                        )}
                                    />
                                    <div className="absolute right-5 top-1/2 -translate-y-1/2 flex items-center gap-3">
                                        {isCheckingUsername && <Loader2 className="w-4 h-4 animate-spin text-primary" />}
                                        {!isCheckingUsername && usernameError && <XCircle className="w-5 h-5 text-red-500" />}
                                        {!isCheckingUsername && isUsernameAvailable && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                                    </div>
                                </div>
                                {usernameError ? (
                                    <p className="text-xs text-red-500 font-black ml-2 animate-in fade-in slide-in-from-left-2">{usernameError.toUpperCase()}</p>
                                ) : (
                                    <p className="text-[10px] text-muted-foreground/60 font-bold uppercase tracking-widest ml-1">This is your permanent public link. Choose wisely.</p>
                                )}
                            </div>

                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-3 font-bold">
                                    <Label className="text-[11px] font-black uppercase tracking-wider ml-1 flex items-center gap-2">
                                        <User className="w-3.5 h-3.5" /> Full Legal Name
                                    </Label>
                                    <Input name="fullName" value={formData.fullName} onChange={handleChange} placeholder="First Last" className="h-14 rounded-2xl bg-muted/40 border-border/40 text-base font-black" required />
                                </div>
                                <div className="space-y-3 font-bold">
                                    <Label className="text-[11px] font-black uppercase tracking-wider ml-1 flex items-center gap-2">
                                        <Sparkles className="w-3.5 h-3.5" /> Professional Title
                                    </Label>
                                    <Input name="professionalTitle" value={formData.professionalTitle} onChange={handleChange} placeholder="e.g. Systems Architect" className="h-14 rounded-2xl bg-muted/40 border-border/40 text-base font-black" required />
                                </div>
                            </div>

                            <div className="space-y-3 font-bold">
                                <Label className="text-[11px] font-black uppercase tracking-wider ml-1">Executive Summary (About Me)</Label>
                                <textarea
                                    name="aboutMe"
                                    value={formData.aboutMe}
                                    onChange={handleChange}
                                    className="flex w-full rounded-3xl border border-border/40 bg-muted/30 px-5 py-4 text-base font-medium ring-offset-background placeholder:text-muted-foreground/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 min-h-[160px] resize-none"
                                    placeholder="Tell the story of your professional evolution..."
                                />
                            </div>

                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-3 font-bold">
                                    <Label className="text-[11px] font-black uppercase tracking-wider ml-1">Core Domain</Label>
                                    <Input name="domain" value={formData.domain} onChange={handleChange} placeholder="e.g. AI / Machine Learning" className="h-14 rounded-2xl bg-muted/40 border-border/40 text-base font-black" required />
                                </div>
                                <div className="space-y-3 font-bold">
                                    <Label className="text-[11px] font-black uppercase tracking-wider ml-1 flex items-center gap-2">
                                        <Mail className="w-3.5 h-3.5" /> Public Contact Email
                                    </Label>
                                    <Input name="publicEmail" value={formData.publicEmail} onChange={handleChange} placeholder="hello@domain.com" className="h-14 rounded-2xl bg-muted/40 border-border/40 text-base font-black" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Geography & Presence */}
                    <div className="grid md:grid-cols-2 gap-8">
                        <Card className="rounded-[40px] border-border/40 bg-card/30">
                            <CardHeader className="p-8 pb-4">
                                <CardTitle className="text-lg font-black uppercase italic tracking-tight">Geo Logic</CardTitle>
                            </CardHeader>
                            <CardContent className="p-8 pt-0 space-y-6">
                                <div className="space-y-3 font-bold">
                                    <Label className="text-[10px] font-black uppercase tracking-widest ml-1 flex items-center gap-2">
                                        <MapPin className="w-3 h-3" /> Primary Location
                                    </Label>
                                    <Input name="location" value={formData.location} onChange={handleChange} placeholder="City, Country" className="h-12 rounded-2xl bg-muted/40 border-border/40 text-sm font-black" />
                                </div>
                                <div className="space-y-3 font-bold">
                                    <Label className="text-[10px] font-black uppercase tracking-widest ml-1 flex items-center gap-2">
                                        <Phone className="w-3 h-3" /> Encrypted Phone
                                    </Label>
                                    <Input name="phone" value={formData.phone} onChange={handleChange} placeholder="+XX XXX XXX XXXX" className="h-12 rounded-2xl bg-muted/40 border-border/40 text-sm font-black" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="rounded-[40px] border-border/40 bg-card/30">
                            <CardHeader className="p-8 pb-4">
                                <CardTitle className="text-lg font-black uppercase italic tracking-tight">Social Connectors</CardTitle>
                            </CardHeader>
                            <CardContent className="p-8 pt-0 space-y-4">
                                <div className="grid gap-4">
                                    <div className="relative group/social">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/40 group-focus-within/social:text-primary transition-colors">
                                            <Linkedin className="w-4 h-4" />
                                        </div>
                                        <Input name="linkedin" value={formData.linkedin} onChange={handleChange} placeholder="LinkedIn Handle" className="h-11 pl-12 rounded-xl bg-muted/40 border-border/40 text-xs font-bold" />
                                    </div>
                                    <div className="relative group/social">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/40 group-focus-within/social:text-primary transition-colors">
                                            <Github className="w-4 h-4" />
                                        </div>
                                        <Input name="github" value={formData.github} onChange={handleChange} placeholder="GitHub Handle" className="h-11 pl-12 rounded-xl bg-muted/40 border-border/40 text-xs font-bold" />
                                    </div>
                                    <div className="relative group/social">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/40 group-focus-within/social:text-primary transition-colors">
                                            <Twitter className="w-4 h-4" />
                                        </div>
                                        <Input name="twitter" value={formData.twitter} onChange={handleChange} placeholder="X / Twitter Handle" className="h-11 pl-12 rounded-xl bg-muted/40 border-border/40 text-xs font-bold" />
                                    </div>
                                    <div className="relative group/social">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/40 group-focus-within/social:text-primary transition-colors">
                                            <Globe className="w-4 h-4" />
                                        </div>
                                        <Input name="website" value={formData.website} onChange={handleChange} placeholder="Personal URL" className="h-11 pl-12 rounded-xl bg-muted/40 border-border/40 text-xs font-bold" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Bottom Status Panel */}
            <div className="pt-10 border-t border-border/30 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-6">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-widest">Protocol Type</span>
                        <span className="text-sm font-black text-primary italic italic">Standard Student Portfolio</span>
                    </div>
                    <div className="w-[1px] h-10 bg-border/20" />
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-widest">Last Sync</span>
                        <span className="text-sm font-bold text-foreground">INSTANTANEOUS</span>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest italic opacity-50">
                        Encrypted Transmission Securely Active
                    </p>
                    <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse ring-4 ring-green-500/20" />
                </div>
            </div>
        </form>
    );
}

