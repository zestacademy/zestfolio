'use client';

import { useState } from 'react';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            router.push('/dashboard');
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleGoogleLogin = async () => {
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
            router.push('/dashboard');
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-muted/40">
            <div className="w-full max-w-md p-8 bg-card rounded-xl shadow-lg border">
                <h1 className="text-2xl font-bold text-center mb-6">Sign In to Zestfolio</h1>
                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    <Button type="submit" className="w-full">Sign In</Button>
                </form>
                <div className="mt-4 flex items-center justify-between">
                    <div className="bg-border h-px flex-1"></div>
                    <span className="px-2 text-muted-foreground text-xs">OR</span>
                    <div className="bg-border h-px flex-1"></div>
                </div>
                <Button variant="outline" className="w-full mt-4" onClick={handleGoogleLogin}>Sign in with Google</Button>
                <p className="mt-6 text-center text-sm text-muted-foreground">
                    Don't have an account? <Link href="/signup" className="text-primary hover:underline">Sign Up</Link>
                </p>
            </div>
        </div>
    );
}
