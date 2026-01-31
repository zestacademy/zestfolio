'use client';

import { useState } from 'react';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

export default function SignupPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isVerificationSent, setIsVerificationSent] = useState(false);
    const router = useRouter();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            try {
                await sendEmailVerification(userCredential.user);
                setIsVerificationSent(true);
            } catch (emailErr: any) {
                console.error("Verification email error:", emailErr);
                // Account created, but email failed. Show popup anyway or a warning?
                // Better to show the popup but maybe note that sending might have failed, 
                // but since we have a "Resend" button in the dashboard (coming next), 
                // we can just send them to the verification state.
                // Or better, tell them.
                setIsVerificationSent(true);
                // We still show the dialog, because the user exists now. 
                // The dialog asks them to check email. If it didn't arrive, they'll login and see "Resend".
            }
        } catch (err: any) {
            console.error("Signup error:", err);
            if (err.code === 'auth/email-already-in-use') {
                setError('An account with this email already exists. Please sign in.');
            } else if (err.code === 'auth/weak-password') {
                setError('Password should be at least 6 characters.');
            } else if (err.code === 'auth/invalid-email') {
                setError('Please enter a valid email address.');
            } else {
                setError(err.message || 'Failed to create account.');
            }
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-muted/40">
            <div className="w-full max-w-md p-8 bg-card rounded-xl shadow-lg border">
                <h1 className="text-2xl font-bold text-center mb-6">Create Account</h1>
                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                <form onSubmit={handleSignup} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    <Button type="submit" className="w-full">Sign Up</Button>
                </form>
                <p className="mt-6 text-center text-sm text-muted-foreground">
                    Already have an account? <Link href="/login" className="text-primary hover:underline">Sign In</Link>
                </p>
            </div>

            <Dialog open={isVerificationSent} onOpenChange={(open) => {
                if (!open) {
                    // Start checking for verification or redirect? 
                    // For now, if they close, they stay here.
                    setIsVerificationSent(false);
                }
            }}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Verify your email</DialogTitle>
                        <DialogDescription>
                            We sent a verification link to <strong>{email}</strong>. Please check your inbox and verify your account to continue creating your portfolio.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex flex-col gap-2 sm:flex-row">
                        <Button variant="outline" onClick={() => window.location.href = '/login'}>
                            Go to Login
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
