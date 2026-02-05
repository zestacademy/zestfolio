'use client';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useEffect } from 'react';
import { Sidebar } from '@/components/dashboard/sidebar';
import { Loader2 } from 'lucide-react';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, profile, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        } else if (user && profile) {
            // Track user activity & ensure doc exists
            setDoc(doc(db, 'users', user.uid), {
                lastActiveAt: serverTimestamp(),
            }, { merge: true }).catch(e => {
                console.log('Error tracking activity:', e);
            });
        }
    }, [user, profile, loading, router]);

    if (loading) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground animate-pulse">Loading your profile...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return null; // Will redirect
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
