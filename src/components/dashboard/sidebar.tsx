'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { LayoutDashboard, User, Folder, Award, Settings, LogOut, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';

const sidebarItems = [
    { icon: LayoutDashboard, label: 'Overview', href: '/dashboard' },
    { icon: User, label: 'Profile', href: '/dashboard/profile' },
    { icon: GraduationCap, label: 'Education', href: '/dashboard/education' },
    { icon: Folder, label: 'Projects', href: '/dashboard/projects' },
    { icon: Award, label: 'Skills & Certs', href: '/dashboard/skills' },
    { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
];

export function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();

    const handleSignOut = async () => {
        await signOut(auth);
        router.push('/');
    };

    return (
        <aside className="w-64 border-r bg-muted/10 h-screen flex flex-col fixed left-0 top-0">
            <div className="p-6 h-16 flex items-center border-b gap-2">
                <img src="/logo.png" alt="Zestfolio Logo" className="w-8 h-8 object-contain" />
                <span className="font-bold text-xl tracking-tight">
                    <span className="text-primary">Zest</span>folio
                </span>
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
        </aside>
    );
}
