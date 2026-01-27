'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Users, Eye, Search, TrendingUp, Award, Activity } from 'lucide-react';
import Link from 'next/link';

// Admin emails - in production, store this in environment variables
const ADMIN_EMAILS = ['zestacademy@rsmk.co.in', 'zestacademyonline@gmail.com'];

interface Portfolio {
    id: string;
    username?: string;
    profile?: {
        name?: string;
        title?: string;
        email?: string;
    };
    projects?: any[];
    skills?: any[];
    education?: any[];
    createdAt?: any;
    updatedAt?: any;
}

export default function AdminPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        if (!authLoading && user) {
            // Check if user is admin
            const adminStatus = ADMIN_EMAILS.includes(user.email || '');
            setIsAdmin(adminStatus);

            if (!adminStatus) {
                router.push('/dashboard');
            }
        } else if (!authLoading && !user) {
            router.push('/login');
        }
    }, [user, authLoading, router]);

    useEffect(() => {
        const fetchPortfolios = async () => {
            if (!isAdmin) return;

            try {
                const q = query(collection(db, 'portfolios'), orderBy('updatedAt', 'desc'));
                const querySnapshot = await getDocs(q);
                const portfolioData: Portfolio[] = [];

                querySnapshot.forEach((doc) => {
                    portfolioData.push({
                        id: doc.id,
                        ...doc.data()
                    } as Portfolio);
                });

                setPortfolios(portfolioData);
            } catch (error) {
                console.error('Error fetching portfolios:', error);
            } finally {
                setLoading(false);
            }
        };

        if (isAdmin) {
            fetchPortfolios();
        }
    }, [isAdmin]);

    if (authLoading || loading) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!isAdmin) {
        return null;
    }

    // Filter portfolios based on search
    const filteredPortfolios = portfolios.filter(portfolio => {
        const searchLower = searchTerm.toLowerCase();
        return (
            portfolio.username?.toLowerCase().includes(searchLower) ||
            portfolio.profile?.name?.toLowerCase().includes(searchLower) ||
            portfolio.profile?.email?.toLowerCase().includes(searchLower)
        );
    });

    // Calculate stats
    const totalUsers = portfolios.length;
    const livePortfolios = portfolios.filter(p => p.username).length;
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
                <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
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
                                <p className="text-sm font-medium text-green-600 dark:text-green-400">Live Portfolios</p>
                                <h3 className="text-3xl font-bold mt-2 text-green-700 dark:text-green-300">{livePortfolios}</h3>
                            </div>
                            <div className="p-3 rounded-full bg-green-200 dark:bg-green-800">
                                <Activity className="w-6 h-6 text-green-700 dark:text-green-300" />
                            </div>
                        </div>
                    </div>

                    <div className="p-6 rounded-xl border bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 text-card-foreground shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Total Projects</p>
                                <h3 className="text-3xl font-bold mt-2 text-purple-700 dark:text-purple-300">{totalProjects}</h3>
                            </div>
                            <div className="p-3 rounded-full bg-purple-200 dark:bg-purple-800">
                                <TrendingUp className="w-6 h-6 text-purple-700 dark:text-purple-300" />
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
                        placeholder="Search by username, name, or email..."
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
                                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">User</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground hidden md:table-cell">Username</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground hidden lg:table-cell">Projects</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground hidden lg:table-cell">Skills</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {filteredPortfolios.length > 0 ? (
                                    filteredPortfolios.map((portfolio) => (
                                        <tr key={portfolio.id} className="hover:bg-muted/30 transition-colors">
                                            <td className="px-4 py-4">
                                                <div className="flex flex-col">
                                                    <span className="font-medium">{portfolio.profile?.name || 'No name'}</span>
                                                    <span className="text-sm text-muted-foreground truncate max-w-[200px]">
                                                        {portfolio.profile?.email || portfolio.id}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 hidden md:table-cell">
                                                <span className="px-2 py-1 rounded bg-primary/10 text-primary text-sm font-mono">
                                                    {portfolio.username || 'No username'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 text-center hidden lg:table-cell">
                                                <span className="font-semibold">{portfolio.projects?.length || 0}</span>
                                            </td>
                                            <td className="px-4 py-4 text-center hidden lg:table-cell">
                                                <span className="font-semibold">{portfolio.skills?.length || 0}</span>
                                            </td>
                                            <td className="px-4 py-4">
                                                {portfolio.username ? (
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
                                    ))
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
