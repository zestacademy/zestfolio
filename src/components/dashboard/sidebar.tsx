'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
    LayoutDashboard,
    User,
    Folder,
    Award,
    Settings,
    LogOut,
    GraduationCap,
    Menu,
    X,
    Shield,
    LayoutTemplate,
    ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';

const sidebarItems = [
    { icon: LayoutDashboard, label: 'Overview', href: '/dashboard' },
    { icon: User, label: 'Profile', href: '/dashboard/profile' },
    { icon: GraduationCap, label: 'Education', href: '/dashboard/education' },
    { icon: Folder, label: 'Projects', href: '/dashboard/projects' },
    { icon: Award, label: 'Skills & Certs', href: '/dashboard/skills' },
    { icon: LayoutTemplate, label: 'Templates', href: '/dashboard/templates' },
    { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
];

const ADMIN_EMAILS = ['zestacademy@rsmk.co.in', 'zestacademyonline@gmail.com'];

export function Sidebar() {
    const pathname = usePathname();
    const { profile, signOut } = useAuth();
    const [isOpen, setIsOpen] = useState(false);

    const isAdmin = profile ? ADMIN_EMAILS.includes(profile.email || '') : false;

    const handleSignOut = async () => {
        try {
            await signOut();
            window.location.href = '/login';
        } catch (error) {
            console.error('Sign out error:', error);
        }
    };

    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isOpen]);

    const sidebarContent = (
        <div className="flex flex-col h-full bg-background/50 backdrop-blur-md">
            <div className="p-8 h-20 flex items-center justify-between border-b border-border/40">
                <Link href="/" className="flex items-center gap-3 group">
                    <img src="/logo.png" alt="Zestfolio Logo" className="w-10 h-10 object-contain transition-transform group-hover:rotate-12 duration-500" />
                    <span className="font-black text-xl tracking-tighter">
                        <span className="text-primary">Zest</span>folio
                    </span>
                </Link>
                <button
                    onClick={() => setIsOpen(false)}
                    className="lg:hidden p-2 hover:bg-accent rounded-xl transition-all active:scale-95"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
                <p className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50 mb-4">Main Menu</p>
                {sidebarItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "group flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-2xl transition-all duration-300 relative overflow-hidden",
                                isActive
                                    ? "bg-primary text-primary-foreground shadow-[0_8px_20px_rgba(var(--primary-rgb),0.25)] scale-[1.02]"
                                    : "text-muted-foreground hover:bg-primary/5 hover:text-primary hover:translate-x-1"
                            )}
                        >
                            <item.icon className={cn("w-5 h-5 transition-transform duration-500", isActive ? "" : "group-hover:scale-110")} />
                            <span className="flex-1">{item.label}</span>
                            {isActive && <ChevronRight className="w-4 h-4 opacity-50" />}
                        </Link>
                    )
                })}

                {isAdmin && (
                    <div className="pt-6 mt-6 border-t border-border/40">
                        <p className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50 mb-4">Administration</p>
                        <Link
                            href="/admin"
                            className={cn(
                                "group flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-2xl transition-all duration-300",
                                pathname === '/admin'
                                    ? "bg-amber-500 text-white shadow-[0_8px_20px_rgba(245,158,11,0.25)]"
                                    : "text-muted-foreground hover:bg-amber-500/5 hover:text-amber-500 hover:translate-x-1"
                            )}
                        >
                            <Shield className="w-5 h-5" />
                            Admin Panel
                        </Link>
                    </div>
                )}
            </nav>

            <div className="p-6 border-t border-border/40 space-y-6">
                {profile && (
                    <div className="flex items-center gap-4 px-4 py-3 bg-muted/30 rounded-3xl border border-border/40 group hover:bg-muted/50 transition-colors">
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center overflow-hidden border-2 border-primary/20 transition-transform group-hover:scale-105 duration-500">
                            {profile.photoURL ? (
                                <img src={profile.photoURL} alt={profile.displayName} className="w-full h-full object-cover" />
                            ) : (
                                <User className="w-6 h-6 text-primary" />
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-black truncate text-foreground leading-none mb-1.5">{profile.displayName}</p>
                            <div className="inline-flex px-2 py-0.5 rounded-lg bg-primary/10 text-primary text-[10px] font-bold tracking-tight">
                                {profile.zestId}
                            </div>
                        </div>
                    </div>
                )}

                <Button
                    variant="ghost"
                    className="w-full h-12 rounded-2xl justify-start gap-3 text-red-500 hover:text-white hover:bg-red-500 font-bold transition-all active:scale-95 group"
                    onClick={handleSignOut}
                >
                    <LogOut className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                    Sign Out
                </Button>
            </div>
        </div>
    );

    return (
        <>
            {/* Mobile Header */}
            <div className="lg:hidden fixed top-0 left-0 right-0 z-40 h-16 bg-background/80 backdrop-blur-md border-b flex items-center px-6">
                <button
                    onClick={() => setIsOpen(true)}
                    className="p-2 -ml-2 hover:bg-accent rounded-xl transition-all active:scale-90"
                >
                    <Menu className="w-6 h-6" />
                </button>
                <div className="ml-4 flex items-center gap-2">
                    <img src="/logo.png" alt="Zestfolio Logo" className="w-8 h-8 object-contain" />
                    <span className="font-black text-lg tracking-tighter">
                        <span className="text-primary">Zest</span>folio
                    </span>
                </div>
            </div>

            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden animate-in fade-in duration-300"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    "w-72 border-r border-border/40 bg-background h-screen flex flex-col fixed left-0 top-0 z-50 transition-all duration-500 ease-out",
                    "lg:translate-x-0",
                    isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full lg:translate-x-0"
                )}
            >
                {sidebarContent}
            </aside>
        </>
    );
}
