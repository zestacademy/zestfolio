'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Upload, FileText, CheckCircle2, AlertTriangle, ChevronRight, Save } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { db } from '@/lib/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

interface ExtractedData {
    personal_details: {
        fullName?: string;
        email?: string;
        phone?: string;
        location?: string;
        linkedin?: string;
        github?: string;
        website?: string;
        professionalTitle?: string;
    };
    summary?: string;
    skills?: string[];
    education?: any[];
    experience?: any[];
    projects?: any[];
    certifications?: any[];
    achievements?: any[];
}

export function ResumeParser() {
    const { user } = useAuth();
    const [open, setOpen] = useState(false);
    const [step, setStep] = useState<'upload' | 'parsing' | 'review' | 'success'>('upload');
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<ExtractedData | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            if (selectedFile.size > 5 * 1024 * 1024) {
                setError('File size exceeds 5MB limit.');
                return;
            }
            setFile(selectedFile);
            setError(null);
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setStep('parsing');
        setError(null);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('/api/parse-resume', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error || 'Failed to parse resume');
            }

            const result = await response.json();
            if (result.success) {
                setData(result.data);
                setStep('review');
            } else {
                throw new Error('Failed to parse resume data');
            }
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'An error occurred during parsing.');
            setStep('upload');
        }
    };

    const handleSave = async () => {
        if (!user || !data) return;

        try {
            const portfolioRef = doc(db, 'portfolios', user.uid);

            const updateData: any = {
                updatedAt: new Date(),
            };

            // Personal Details
            if (data.personal_details) {
                if (data.personal_details.fullName) updateData.fullName = data.personal_details.fullName;
                if (data.personal_details.email) updateData.publicEmail = data.personal_details.email;
                if (data.personal_details.phone) updateData.phone = data.personal_details.phone;
                if (data.personal_details.location) updateData.location = data.personal_details.location;
                if (data.personal_details.professionalTitle) updateData.professionalTitle = data.personal_details.professionalTitle;

                const socialLinks: any = {};
                if (data.personal_details.linkedin) socialLinks.linkedin = data.personal_details.linkedin;
                if (data.personal_details.github) socialLinks.github = data.personal_details.github;
                if (data.personal_details.website) socialLinks.website = data.personal_details.website;
                if (Object.keys(socialLinks).length > 0) {
                    updateData.socialLinks = socialLinks;
                }
            }

            if (data.summary) updateData.aboutMe = data.summary;

            if (data.skills && Array.isArray(data.skills)) {
                updateData.skills = data.skills;
            }

            if (data.education) updateData.education = data.education;
            if (data.experience) updateData.experience = data.experience;
            if (data.projects) updateData.projects = data.projects;
            if (data.certifications) updateData.certifications = data.certifications;
            if (data.achievements) updateData.achievements = data.achievements;

            await setDoc(portfolioRef, updateData, { merge: true });

            setStep('success');
            setTimeout(() => {
                setOpen(false);
                setStep('upload');
                setFile(null);
                setData(null);
                window.location.reload();
            }, 2000);

        } catch (err) {
            console.error("Error saving data:", err);
            setError("Failed to save data. Please try again.");
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg border-0">
                    <FileText className="w-4 h-4" /> Import from Resume
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-hidden flex flex-col">
                <DialogHeader>
                    <DialogTitle>Import from Resume</DialogTitle>
                    <DialogDescription>
                        Upload your resume (PDF, DOCX) to auto-fill your portfolio.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto py-4 px-1">
                    {step === 'upload' && (
                        <div className="grid place-items-center border-2 border-dashed border-muted-foreground/25 rounded-xl p-10 hover:bg-muted/50 transition-colors">
                            <div className="text-center space-y-4">
                                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                                    <Upload className="w-8 h-8 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg">Click to Upload Resume</h3>
                                    <p className="text-sm text-muted-foreground">Supported formats: PDF, DOCX, TXT (Max 5MB)</p>
                                </div>
                                <Input
                                    ref={fileInputRef}
                                    type="file"
                                    accept=".pdf,.docx,.txt"
                                    className="hidden"
                                    onChange={handleFileChange}
                                />
                                <Button variant="secondary" onClick={() => fileInputRef.current?.click()}>
                                    Select File
                                </Button>
                                {file && (
                                    <div className="flex items-center gap-2 bg-muted px-3 py-2 rounded-md text-sm mt-4">
                                        <FileText className="w-4 h-4 text-primary" />
                                        <span className="truncate max-w-[200px]">{file.name}</span>
                                    </div>
                                )}
                                {error && (
                                    <div className="text-red-500 text-sm flex items-center gap-2 justify-center">
                                        <AlertTriangle className="w-4 h-4" /> {error}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {step === 'parsing' && (
                        <div className="flex flex-col items-center justify-center py-12 space-y-4">
                            <Loader2 className="w-12 h-12 animate-spin text-primary" />
                            <div className="text-center">
                                <h3 className="font-semibold text-lg">Analyzing Resume...</h3>
                                <p className="text-muted-foreground">Extracting details, skills, and experience automatically.</p>
                            </div>
                        </div>
                    )}

                    {step === 'review' && data && (
                        <div className="space-y-6">
                            <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg border border-blue-100 dark:border-blue-900 text-sm flex items-start gap-3">
                                <CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
                                <div>
                                    <p className="font-medium text-blue-900 dark:text-blue-100">Analysis Complete!</p>
                                    <p className="text-blue-700 dark:text-blue-300">We've extracted the following information. Please review before applying.</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h4 className="font-medium flex items-center gap-2 border-b pb-2">
                                    <UserIcon className="w-4 h-4" /> Personal Details
                                </h4>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <Label>Full Name</Label>
                                        <Input defaultValue={data.personal_details?.fullName} onChange={(e) => data.personal_details!.fullName = e.target.value} />
                                    </div>
                                    <div>
                                        <Label>Professional Title</Label>
                                        <Input defaultValue={data.personal_details?.professionalTitle} onChange={(e) => data.personal_details!.professionalTitle = e.target.value} />
                                    </div>
                                    <div className="col-span-2">
                                        <Label>Summary</Label>
                                        <Input defaultValue={data.summary} onChange={(e) => data.summary = e.target.value} />
                                    </div>
                                </div>

                                <h4 className="font-medium flex items-center gap-2 border-b pb-2 mt-4">
                                    <CodeIcon className="w-4 h-4" /> Skills
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {data.skills?.map((skill, i) => (
                                        <Badge key={i} variant="secondary">{skill}</Badge>
                                    ))}
                                    {(!data.skills || data.skills.length === 0) && <p className="text-muted-foreground text-sm">No skills found.</p>}
                                </div>

                                <h4 className="font-medium flex items-center gap-2 border-b pb-2 mt-4">
                                    <BriefcaseIcon className="w-4 h-4" /> Experience ({data.experience?.length || 0})
                                </h4>
                                <ul className="list-disc list-inside text-sm text-muted-foreground">
                                    {data.experience?.map((exp, i) => (
                                        <li key={i}>{exp.role} at {exp.company}</li>
                                    ))}
                                </ul>

                                <h4 className="font-medium flex items-center gap-2 border-b pb-2 mt-4">
                                    <GraduationCapIcon className="w-4 h-4" /> Education ({data.education?.length || 0})
                                </h4>
                                <ul className="list-disc list-inside text-sm text-muted-foreground">
                                    {data.education?.map((edu, i) => (
                                        <li key={i}>{edu.degree} - {edu.institution}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}

                    {step === 'success' && (
                        <div className="flex flex-col items-center justify-center py-12 space-y-4">
                            <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                                <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
                            </div>
                            <div className="text-center">
                                <h3 className="font-semibold text-lg">Portfolio Updated!</h3>
                                <p className="text-muted-foreground">Your resume data has been successfully imported.</p>
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter className="mt-4">
                    {step === 'upload' && (
                        <Button onClick={handleUpload} disabled={!file}>
                            Upload & Parse
                        </Button>
                    )}
                    {step === 'review' && (
                        <>
                            <Button variant="outline" onClick={() => setStep('upload')}>Try Another File</Button>
                            <Button onClick={handleSave} className="gap-2">
                                <Save className="w-4 h-4" /> Apply to Portfolio
                            </Button>
                        </>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

// Simple Icon Wrappers
function UserIcon(props: any) {
    return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
}
function CodeIcon(props: any) {
    return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>
}
function BriefcaseIcon(props: any) {
    return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>
}
function GraduationCapIcon(props: any) {
    return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" /></svg>
}
