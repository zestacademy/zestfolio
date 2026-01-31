'use client';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { db, auth } from '@/lib/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useEffect } from 'react';
import { Sidebar } from '@/components/dashboard/sidebar';
import { Loader2 } from 'lucide-react';
import { signOut, sendEmailVerification } from 'firebase/auth';
import { useState } from 'react';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [resending, setResending] = useState(false);
    const [resendMessage, setResendMessage] = useState('');

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        } else if (user) {
            // Track user activity & ensure doc exists
            setDoc(doc(db, 'portfolios', user.uid), {
                lastActiveAt: serverTimestamp(),
                // Sync essential auth data if missing
                ...(user.email ? { email: user.email } : {})
            }, { merge: true }).catch(e => {
                console.log('Error tracking activity:', e);
            });
        }
    }, [user, loading, router]);

    const handleResendVerification = async () => {
        if (!user) return;
        setResending(true);
        setResendMessage('');
        try {
            await sendEmailVerification(user);
            setResendMessage('Verification email sent! Check your inbox (and spam).');
        } catch (error: any) {
            console.error("Error resending verification:", error);
            if (error.code === 'auth/too-many-requests') {
                setResendMessage('Too many requests. Please wait a bit.');
            } else {
                setResendMessage('Failed to send email. Please try again.');
            }
        } finally {
            setResending(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!user) {
        return null; // Will redirect
    }

    if (!user.emailVerified) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 text-center">
                <div className="max-w-md space-y-6 rounded-lg border bg-card p-8 shadow-sm">
                    <h1 className="text-2xl font-bold text-foreground">Verify Your Email</h1>
                    <p className="text-muted-foreground">
                        Please verify your email address to access your dashboard.
                        We sent a verification link to <strong>{user.email}</strong>.
                    </p>
                    {resendMessage && (
                        <p className={`text-sm ${resendMessage.includes('sent') ? 'text-green-600' : 'text-red-500'}`}>
                            {resendMessage}
                        </p>
                    )}
                    <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                        <Button onClick={handleResendVerification} disabled={resending} variant="secondary">
                            {resending ? 'Sending...' : 'Resend Email'}
                        </Button>
                        <Button onClick={() => window.location.reload()}>
                            I've Verified
                        </Button>
                        <Button variant="outline" onClick={() => signOut(auth).then(() => router.push('/login'))}>
                            Sign Out
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-background">
            <Sidebar />
            {/* Main content area - adjust for mobile header and desktop sidebar */}
            <main className="flex-1 lg:ml-64 pt-16 lg:pt-0 overflow-y-auto min-h-screen">
                <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
