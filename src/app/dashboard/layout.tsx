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
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        } else if (user) {
            // Track user activity & ensure doc exists
            setDoc(doc(db, 'portfolios', user.uid), {
                lastActiveAt: serverTimestamp(),
                // Sync essential auth data if missing, but don't overwrite if present (merge logic handles this for new fields, 
                // but deep merge is tricky. Here we just update lastActiveAt. 
                // To create a robust doc for new users, we'd need more logic, 
                // but this ensures the doc EXISTs for the Admin Dashboard.)
                ...(user.email ? { email: user.email } : {})  // Store email at root for easier querying if needed, or just ensure doc content
            }, { merge: true }).catch(e => {
                console.log('Error tracking activity:', e);
            });
        }
    }, [user, loading, router]);

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
