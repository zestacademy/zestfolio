'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Users, Eye, Search, Award, Activity } from 'lucide-react';
import Link from 'next/link';

// Admin emails - in production, store this in environment variables
const ADMIN_EMAILS = ['zestacademy@rsmk.co.in', 'zestacademyonline@gmail.com'];

interface Portfolio {
    id: string;
    username?: string;
    fullName?: string;
    email?: string;
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
                // Simplified query to avoid index issues
                const q = query(collection(db, 'portfolios'));

                const querySnapshot = await getDocs(q);

                if (querySnapshot.empty) {
                    setError("Database returned 0 records. Collection 'portfolios' might be empty.");
                }

                const portfolioData: Portfolio[] = [];

                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    // console.log("Doc:", doc.id, data);
                    portfolioData.push({
                        id: doc.id,
                        ...data
                    } as Portfolio);
                });

                // Client-side sort instead
                portfolioData.sort((a, b) => {
                    const dateA = a.updatedAt?.seconds || 0;
                    const dateB = b.updatedAt?.seconds || 0;
                    return dateB - dateA;
                });

                setPortfolios(portfolioData);
            } catch (err: any) {
                console.error('Error fetching portfolios:', err);
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

    // Helper for inactivity check
    const isUserInactive = (p: Portfolio) => {
        if (p.status === 'inactive') return true;

        // Fallback to updatedAt if lastActiveAt is not set (for older users)
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

    // Filter portfolios based on search
    const filteredPortfolios = portfolios.filter(portfolio => {
        if (!searchTerm) return true;
        const searchLower = searchTerm.toLowerCase();
        return (
            (portfolio.username || '').toLowerCase().includes(searchLower) ||
            (portfolio.fullName || '').toLowerCase().includes(searchLower) ||
            (portfolio.email || '').toLowerCase().includes(searchLower) ||
            portfolio.id.toLowerCase().includes(searchLower)
        );
    });

    // Calculate stats
    const totalUsers = portfolios.length;
    const inactiveUsers = portfolios.filter(p => isUserInactive(p)).length;
    const livePortfolios = portfolios.filter(p => p.username && !isUserInactive(p)).length; // Only count active as live
    const totalProjects = portfolios.reduce((sum, p) => sum + (p.projects?.length || 0), 0);
    const avgProjectsPerUser = totalUsers > 0 ? (totalProjects / totalUsers).toFixed(1) : 0;

    return (
        <div className="min-h-screen bg-background p-4 md:p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-primary">Admin Dashboard</h1>
                        <p className="text-muted-foreground mt-1">Manage and monitor all portfolios</p>
                    </div>
                    <Link href="/dashboard">
                        <Button variant="outline">Back to Dashboard</Button>
                    </Link>
                </div>

                {/* Stats Grid */}
                <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="p-6 rounded-xl border bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 text-card-foreground shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Total Users</p>
                                <h3 className="text-3xl font-bold mt-2 text-blue-700 dark:text-blue-300">{totalUsers}</h3>
                            </div>
                            <div className="p-3 rounded-full bg-blue-200 dark:bg-blue-800">
                                <Users className="w-6 h-6 text-blue-700 dark:text-blue-300" />
                            </div>
                        </div>
                    </div>

                    <div className="p-6 rounded-xl border bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 text-card-foreground shadow-sm">
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

                    <div className="p-6 rounded-xl border bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 text-card-foreground shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-orange-600 dark:text-orange-400">Avg Projects/User</p>
                                <h3 className="text-3xl font-bold mt-2 text-orange-700 dark:text-orange-300">{avgProjectsPerUser}</h3>
                            </div>
                            <div className="p-3 rounded-full bg-orange-200 dark:bg-orange-800">
                                <Award className="w-6 h-6 text-orange-700 dark:text-orange-300" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by full name, url name, or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 h-12"
                    />
                </div>

                {/* Portfolios Table */}
                <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-muted/50 border-b">
                                <tr>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Full Name</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground hidden md:table-cell">URL Name</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground hidden lg:table-cell">Projects</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground hidden lg:table-cell">Skills</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {filteredPortfolios.length > 0 ? (
                                    filteredPortfolios.map((portfolio) => {
                                        const isPaused = portfolio.status === 'inactive';

                                        return (
                                            <tr key={portfolio.id} className="hover:bg-muted/30 transition-colors">
                                                <td className="px-4 py-4">
                                                    <div className="flex flex-col">
                                                        <span className="font-medium">{portfolio.fullName || 'No name'}</span>
                                                        <span className="text-sm text-muted-foreground truncate max-w-[200px]">
                                                            {portfolio.email || portfolio.id}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 hidden md:table-cell">
                                                    <span className="px-2 py-1 rounded bg-primary/10 text-primary text-sm font-mono">
                                                        {portfolio.username || 'No URL Name'}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-4 text-center hidden lg:table-cell">
                                                    <span className="font-semibold">{portfolio.projects?.length || 0}</span>
                                                </td>
                                                <td className="px-4 py-4 text-center hidden lg:table-cell">
                                                    <span className="font-semibold">{portfolio.skills?.length || 0}</span>
                                                </td>
                                                <td className="px-4 py-4">
                                                    {isPaused ? (
                                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 text-xs font-medium">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                                                            Paused
                                                        </span>
                                                    ) : portfolio.username ? (
                                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-xs font-medium">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                                            Live
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-medium">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                                                            Draft
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-4">
                                                    {portfolio.username && (
                                                        <a href={`/u/${portfolio.username}`} target="_blank" rel="noopener noreferrer">
                                                            <Button size="sm" variant="ghost" className="gap-2">
                                                                <Eye className="w-4 h-4" />
                                                                <span className="hidden sm:inline">View</span>
                                                            </Button>
                                                        </a>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="px-4 py-12 text-center">
                                            <div className="flex flex-col items-center gap-2">
                                                <Users className="w-12 h-12 text-muted-foreground/50" />
                                                <p className="text-muted-foreground">
                                                    {searchTerm ? 'No portfolios found matching your search.' : 'No portfolios yet.'}
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Footer Info */}
                <div className="text-center text-sm text-muted-foreground">
                    Showing {filteredPortfolios.length} of {totalUsers} total users
                </div>
            </div>
        </div>
    );
}
