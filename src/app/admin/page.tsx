'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Users, Eye, Search, Award, Activity, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

// Admin emails - in production, store this in environment variables
const ADMIN_EMAILS = ['zestacademy@rsmk.co.in', 'zestacademyonline@gmail.com'];

interface Portfolio {
    id: string;
    username?: string;
    fullName?: string;
    email?: string;
    zestId?: string;
    projects?: any[];
    skills?: any[];
    education?: any[];
    createdAt?: any;
    updatedAt?: any;
    lastActiveAt?: any;
    status?: 'active' | 'inactive';
}

export default function AdminPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!authLoading) {
            if (user && user.email && ADMIN_EMAILS.includes(user.email)) {
                setIsAdmin(true);
            } else if (!user) {
                router.push('/login');
            } else {
                router.push('/dashboard');
            }
        }
    }, [user, authLoading, router]);

    useEffect(() => {
        const fetchPortfolios = async () => {
            if (!isAdmin) return;
            setLoading(true);
            setError(null);

            try {
                // Fetch both collections
                const [portfoliosSnap, usersSnap] = await Promise.all([
                    getDocs(collection(db, 'portfolios')),
                    getDocs(collection(db, 'users'))
                ]);

                const combinedData: Portfolio[] = [];

                usersSnap.forEach((userDoc) => {
                    const userData = userDoc.data();
                    // Match portfolio by Zest ID (New System) or UID (Old System Fallback)
                    const portfolioDoc = portfoliosSnap.docs.find(d => d.id === userData.zestId || d.id === userDoc.id);
                    const portfolioData = portfolioDoc ? portfolioDoc.data() : {};

                    combinedData.push({
                        id: userDoc.id,
                        zestId: userData.zestId || 'N/A',
                        email: userData.email,
                        fullName: portfolioData.fullName || userData.displayName || 'No name',
                        username: portfolioData.username,
                        projects: portfolioData.projects || [],
                        skills: portfolioData.skills || [],
                        status: portfolioData.status,
                        updatedAt: portfolioData.updatedAt || userData.createdAt,
                        lastActiveAt: portfolioData.lastActiveAt || userData.lastActiveAt,
                    } as Portfolio);
                });

                // Client-side sort
                combinedData.sort((a, b) => {
                    const dateA = a.updatedAt?.seconds || 0;
                    const dateB = b.updatedAt?.seconds || 0;
                    return dateB - dateA;
                });

                setPortfolios(combinedData);
            } catch (err: any) {
                console.error('Error fetching data:', err);
                setError(`Failed to load data: ${err.message}`);
            } finally {
                setLoading(false);
            }
        };

        if (isAdmin) {
            fetchPortfolios();
        }
    }, [isAdmin]);

    if (authLoading || (loading && isAdmin)) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!isAdmin) return null;

    // Helper for inactivity check
    const isUserInactive = (p: Portfolio) => {
        if (p.status === 'inactive') return true;
        const activityDate = p.lastActiveAt || p.updatedAt;
        if (activityDate) {
            try {
                const lastActive = activityDate.toDate ? activityDate.toDate() : new Date(activityDate);
                const ninetyDaysAgo = new Date();
                ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
                return lastActive < ninetyDaysAgo;
            } catch (e) { return false; }
        }
        return false;
    };

    const filteredPortfolios = portfolios.filter(portfolio => {
        if (!searchTerm) return true;
        const searchLower = searchTerm.toLowerCase();
        return (
            (portfolio.username || '').toLowerCase().includes(searchLower) ||
            (portfolio.fullName || '').toLowerCase().includes(searchLower) ||
            (portfolio.email || '').toLowerCase().includes(searchLower) ||
            (portfolio.zestId || '').toLowerCase().includes(searchLower) ||
            portfolio.id.toLowerCase().includes(searchLower)
        );
    });

    const totalUsers = portfolios.length;
    const livePortfolios = portfolios.filter(p => p.username && !isUserInactive(p)).length;
    const totalProjects = portfolios.reduce((sum, p) => sum + (p.projects?.length || 0), 0);
    const avgProjectsPerUser = totalUsers > 0 ? (totalProjects / totalUsers).toFixed(1) : 0;

    return (
        <div className="min-h-screen bg-background p-4 md:p-8">
            <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <ShieldCheck className="w-5 h-5 text-primary" />
                            <span className="text-xs font-bold uppercase tracking-widest text-primary/70">Admin Console</span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-primary">System Overview</h1>
                        <p className="text-muted-foreground transition-all duration-300">Manage and monitor all Zestfolio users and their portfolios.</p>
                    </div>
                    <Link href="/dashboard">
                        <Button variant="outline" className="transition-all hover:scale-105 active:scale-95">Back to Dashboard</Button>
                    </Link>
                </div>

                <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="p-6 rounded-xl border bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 text-card-foreground shadow-sm hover:shadow-md transition-all duration-300">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Total Registered</p>
                                <h3 className="text-3xl font-bold mt-2 text-blue-700 dark:text-blue-300">{totalUsers}</h3>
                            </div>
                            <div className="p-3 rounded-full bg-blue-200 dark:bg-blue-800">
                                <Users className="w-6 h-6 text-blue-700 dark:text-blue-300" />
                            </div>
                        </div>
                    </div>

                    <div className="p-6 rounded-xl border bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 text-card-foreground shadow-sm hover:shadow-md transition-all duration-300">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-green-600 dark:text-green-400">Active Portfolios</p>
                                <h3 className="text-3xl font-bold mt-2 text-green-700 dark:text-green-300">{livePortfolios}</h3>
                            </div>
                            <div className="p-3 rounded-full bg-green-200 dark:bg-green-800">
                                <Activity className="w-6 h-6 text-green-700 dark:text-green-300" />
                            </div>
                        </div>
                    </div>

                    <div className="p-6 rounded-xl border bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 text-card-foreground shadow-sm hover:shadow-md transition-all duration-300">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-orange-600 dark:text-orange-400">Content Density</p>
                                <h3 className="text-3xl font-bold mt-2 text-orange-700 dark:text-orange-300">{avgProjectsPerUser} <span className="text-sm font-normal text-muted-foreground">prj/user</span></h3>
                            </div>
                            <div className="p-3 rounded-full bg-orange-200 dark:bg-orange-800">
                                <Award className="w-6 h-6 text-orange-700 dark:text-orange-300" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="relative group">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                        placeholder="Search by Zest ID, Name, Username, or Email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 h-11 transition-all focus:ring-2 focus:ring-primary/20"
                    />
                </div>

                <div className="rounded-xl border bg-card shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-muted/50 border-b">
                                <tr className="text-xs uppercase tracking-wider text-muted-foreground">
                                    <th className="px-4 py-3 text-left font-semibold">User Identity</th>
                                    <th className="px-4 py-3 text-left font-semibold">Zest ID</th>
                                    <th className="px-4 py-3 text-left font-semibold hidden md:table-cell">URL Name</th>
                                    <th className="px-4 py-3 text-center font-semibold hidden lg:table-cell">Projects</th>
                                    <th className="px-4 py-3 text-left font-semibold">Status</th>
                                    <th className="px-4 py-3 text-left font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y text-sm">
                                {filteredPortfolios.length > 0 ? (
                                    filteredPortfolios.map((portfolio, idx) => {
                                        const isPaused = portfolio.status === 'inactive';
                                        return (
                                            <tr key={portfolio.id} className="hover:bg-muted/30 transition-colors animate-in slide-in-from-left duration-300" style={{ animationDelay: `${idx * 30}ms` }}>
                                                <td className="px-4 py-4">
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-foreground">{portfolio.fullName}</span>
                                                        <span className="text-xs text-muted-foreground">{portfolio.email}</span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <span className="font-mono font-bold text-primary">{portfolio.zestId}</span>
                                                </td>
                                                <td className="px-4 py-4 hidden md:table-cell text-xs">
                                                    {portfolio.username ? (
                                                        <span className="bg-muted px-2 py-0.5 rounded border">u/{portfolio.username}</span>
                                                    ) : (
                                                        <span className="text-muted-foreground italic">None set</span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-4 text-center hidden lg:table-cell">
                                                    <span className="bg-primary/5 text-primary rounded-full px-2 py-0.5 font-bold border border-primary/10">
                                                        {portfolio.projects?.length || 0}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-4">
                                                    {isPaused ? (
                                                        <Badge variant="outline" className="text-amber-500 border-amber-500 bg-amber-500/5">Paused</Badge>
                                                    ) : portfolio.username ? (
                                                        <Badge variant="outline" className="text-green-500 border-green-500 bg-green-500/5">Live</Badge>
                                                    ) : (
                                                        <Badge variant="outline" className="text-muted-foreground">Draft</Badge>
                                                    )}
                                                </td>
                                                <td className="px-4 py-4">
                                                    {portfolio.username && (
                                                        <a href={`/u/${portfolio.username}`} target="_blank" rel="noopener noreferrer">
                                                            <Button size="sm" variant="ghost" className="h-8 gap-1 text-primary hover:text-primary hover:bg-primary/10 group">
                                                                <Eye className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" /> View
                                                            </Button>
                                                        </a>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">
                                            No users found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Badge({ children, variant = "default", className = "" }: any) {
    const variants: any = {
        default: "bg-primary text-primary-foreground",
        outline: "border",
        secondary: "bg-secondary text-secondary-foreground"
    };
    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${variants[variant]} ${className}`}>
            {children}
        </span>
    );
}
