'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { LayoutDashboard, User, Folder, Award, Settings, LogOut, GraduationCap, Menu, X, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';

const sidebarItems = [
    { icon: LayoutDashboard, label: 'Overview', href: '/dashboard' },
    { icon: User, label: 'Profile', href: '/dashboard/profile' },
    { icon: GraduationCap, label: 'Education', href: '/dashboard/education' },
    { icon: Folder, label: 'Projects', href: '/dashboard/projects' },
    { icon: Award, label: 'Skills & Certs', href: '/dashboard/skills' },
    { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
];

// Admin emails - match with admin page
const ADMIN_EMAILS = ['zestacademy@rsmk.co.in', 'zestacademyonline@gmail.com'];

export function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        if (user) {
            setIsAdmin(ADMIN_EMAILS.includes(user.email || ''));
        }
    }, [user]);

    const handleSignOut = async () => {
        await signOut(auth);
        router.push('/');
    };

    // Close sidebar when route changes on mobile
    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    // Prevent body scroll when sidebar is open on mobile
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const sidebarContent = (
        <>
            <div className="p-6 h-16 flex items-center border-b gap-2">
                <img src="/logo.png" alt="Zestfolio Logo" className="w-8 h-8 object-contain" />
                <span className="font-bold text-xl tracking-tight">
                    <span className="text-primary">Zest</span>folio
                </span>
                {/* Close button for mobile */}
                <button
                    onClick={() => setIsOpen(false)}
                    className="ml-auto lg:hidden p-2 hover:bg-accent rounded-md transition-colors"
                    aria-label="Close menu"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {sidebarItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            "flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-md transition-colors",
                            pathname === item.href
                                ? "bg-primary text-primary-foreground shadow-sm"
                                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                        )}
                    >
                        <item.icon className="w-4 h-4" />
                        {item.label}
                    </Link>
                ))}

                {/* Admin Panel Link */}
                {isAdmin && (
                    <Link
                        href="/admin"
                        className={cn(
                            "flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-md transition-colors mt-4 border-t pt-4",
                            pathname === '/admin'
                                ? "bg-primary text-primary-foreground shadow-sm"
                                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                        )}
                    >
                        <Shield className="w-4 h-4" />
                        Admin Panel
                    </Link>
                )}
            </nav>
            <div className="p-4 border-t">
                <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                    onClick={handleSignOut}
                >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                </Button>
            </div>
        </>
    );

    return (
        <>
            {/* Mobile Header with Hamburger */}
            <div className="lg:hidden fixed top-0 left-0 right-0 z-40 h-16 bg-background border-b flex items-center px-4">
                <button
                    onClick={() => setIsOpen(true)}
                    className="p-2 hover:bg-accent rounded-md transition-colors"
                    aria-label="Open menu"
                >
                    <Menu className="w-6 h-6" />
                </button>
                <div className="ml-4 flex items-center gap-2">
                    <img src="/logo.png" alt="Zestfolio Logo" className="w-7 h-7 object-contain" />
                    <span className="font-bold text-lg tracking-tight">
                        <span className="text-primary">Zest</span>folio
                    </span>
                </div>
            </div>

            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity"
                    onClick={() => setIsOpen(false)}
                    aria-hidden="true"
                />
            )}

            {/* Sidebar - Desktop (fixed) & Mobile (slide-in) */}
            <aside
                className={cn(
                    "w-64 border-r bg-background h-screen flex flex-col fixed left-0 top-0 z-50 transition-transform duration-300 ease-in-out",
                    "lg:translate-x-0", // Always visible on desktop
                    isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0" // Slide in/out on mobile
                )}
            >
                {sidebarContent}
            </aside>
        </>
    );
}
