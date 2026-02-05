'use client';

import { useAuth } from '@/lib/auth-context';
import { Card, CardContent } from '@/components/ui/card';
import { User, Mail, BadgeCheck, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function UserProfile() {
    const { profile, loading } = useAuth();

    if (loading) {
        return (
            <Card className="animate-pulse">
                <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-muted" />
                        <div className="space-y-2 flex-1">
                            <div className="h-4 bg-muted rounded w-1/4" />
                            <div className="h-3 bg-muted rounded w-1/2" />
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (!profile) return null;

    return (
        <Card className="overflow-hidden border-2 border-primary/10">
            <CardContent className="p-0">
                <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        <div className="relative">
                            <div className="w-24 h-24 rounded-full border-4 border-background shadow-xl overflow-hidden bg-muted flex items-center justify-center">
                                {profile.photoURL ? (
                                    <img
                                        src={profile.photoURL}
                                        alt={profile.displayName}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <User className="w-10 h-10 text-primary/40" />
                                )}
                            </div>
                            <div className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground text-[10px] font-bold px-2 py-1 rounded-full border-2 border-background shadow-sm">
                                {profile.role?.toUpperCase()}
                            </div>
                        </div>

                        <div className="flex-1 text-center md:text-left space-y-2">
                            <div className="flex flex-col md:flex-row md:items-center gap-2">
                                <h2 className="text-2xl font-bold tracking-tight">{profile.displayName}</h2>
                                <Badge variant="secondary" className="w-fit mx-auto md:mx-0 bg-primary/10 text-primary hover:bg-primary/20 border-primary/20">
                                    <BadgeCheck className="w-3 h-3 mr-1" />
                                    Verified Student
                                </Badge>
                            </div>

                            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1.5">
                                    <Mail className="w-4 h-4" />
                                    {profile.email}
                                </div>
                                <div className="flex items-center gap-1.5 font-mono font-bold text-primary">
                                    <span className="text-muted-foreground font-sans font-normal italic">Zest ID:</span>
                                    {profile.zestId}
                                </div>
                                {profile.createdAt && (
                                    <div className="flex items-center gap-1.5">
                                        <Calendar className="w-4 h-4" />
                                        Joined {new Date(profile.createdAt?.seconds * 1000).toLocaleDateString()}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
