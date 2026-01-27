'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Power, Eye, EyeOff } from 'lucide-react';

export default function SettingsPage() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [status, setStatus] = useState<'active' | 'inactive'>('active');

    useEffect(() => {
        const fetchSettings = async () => {
            if (!user) return;
            try {
                const docRef = doc(db, 'portfolios', user.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setStatus(data.status || 'active');
                }
            } catch (error) {
                console.error("Error fetching settings:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, [user]);

    const handleStatusChange = async (newStatus: 'active' | 'inactive') => {
        if (!user) return;
        setSaving(true);
        try {
            await updateDoc(doc(db, 'portfolios', user.uid), {
                status: newStatus
            });
            setStatus(newStatus);
            // toast.success(`Portfolio is now ${newStatus}`); // Add toast later if available
        } catch (error) {
            console.error("Error updating status:", error);
            // toast.error("Failed to update status");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                <p className="text-muted-foreground">Manage your account and portfolio preferences.</p>
            </div>

            <Card className={status === 'active' ? 'border-green-500/50 bg-green-500/5' : 'border-slate-200'}>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Power className={`w-5 h-5 ${status === 'active' ? 'text-green-600' : 'text-slate-500'}`} />
                        <CardTitle>Portfolio Status</CardTitle>
                    </div>
                    <CardDescription>
                        Control the visibility of your public portfolio.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between p-4 border rounded-lg bg-background">
                        <div className="space-y-1">
                            <p className="font-medium">
                                Current Status: <span className={status === 'active' ? 'text-green-600 font-bold' : 'text-slate-600 font-bold'}>
                                    {status === 'active' ? 'Active & Visible' : 'Inactive & Hidden'}
                                </span>
                            </p>
                            <p className="text-sm text-muted-foreground">
                                {status === 'active'
                                    ? "Your portfolio is public and can be viewed by anyone with the link."
                                    : "Your portfolio is hidden. Visitors will see a maintenance message."}
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            {status === 'active' ? (
                                <Button
                                    variant="outline"
                                    onClick={() => handleStatusChange('inactive')}
                                    disabled={saving}
                                    className="border-red-200 hover:bg-red-50 hover:text-red-600"
                                >
                                    {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <EyeOff className="w-4 h-4 mr-2" />}
                                    Pause Portfolio
                                </Button>
                            ) : (
                                <Button
                                    onClick={() => handleStatusChange('active')}
                                    disabled={saving}
                                    className="bg-green-600 hover:bg-green-700 text-white"
                                >
                                    {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                                    Activate Portfolio
                                </Button>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
