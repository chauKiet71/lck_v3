'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { data: session, status } = useSession();
    const pathname = usePathname();
    const [isSidebarOpen, setSidebarOpen] = useState(true);

    if (status === 'loading') return <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">Loading...</div>;

    if (!session) {
        // If unprotected by middleware (e.g. login page), show children
        // But login page has its own layout or is excluded? 
        // Usually admin layout is applied to /admin/*
        // Login page is at /admin/login. It should be excluded from this layout or handle it.
        // If this layout wraps /admin/login, we should allow it.
        if (pathname === '/admin/login') return <>{children}</>;
        // Else redirect is handled by middleware
        return null;
    }

    // If logged in and on login page, redirect to dashboard? 
    // Should be handled by page logic or middleware.

    const navItems = [
        { name: 'Dashboard', href: '/admin', icon: 'dashboard' },
        { name: 'Contacts', href: '/admin/contacts', icon: 'contacts' },
        { name: 'News & Insights', href: '/admin/insights', icon: 'article' },
        { name: 'Categories', href: '/admin/categories', icon: 'category' },
    ];

    return (
        <div className="min-h-screen flex bg-slate-100 dark:bg-slate-900">
            {/* Sidebar */}
            <aside className={`bg-slate-900 text-white transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'} fixed h-full z-50 overflow-y-auto border-r border-slate-700`}>
                <div className="p-6 flex items-center justify-between">
                    {isSidebarOpen && <span className="font-bold text-xl tracking-widest">ADMIN</span>}
                    <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="text-slate-400 hover:text-white">
                        <span className="material-symbols-outlined">{isSidebarOpen ? 'menu_open' : 'menu'}</span>
                    </button>
                </div>

                <nav className="mt-8 space-y-2 px-4">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-4 p-3 rounded-xl transition-all ${pathname === item.href ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
                        >
                            <span className="material-symbols-outlined">{item.icon}</span>
                            {isSidebarOpen && <span className="font-medium">{item.name}</span>}
                        </Link>
                    ))}
                </nav>

                <div className="absolute bottom-8 left-0 w-full px-4">
                    <button
                        onClick={() => signOut()}
                        className={`flex items-center gap-4 p-3 rounded-xl w-full transition-all text-red-400 hover:bg-red-500/10 ${!isSidebarOpen && 'justify-center'}`}
                    >
                        <span className="material-symbols-outlined">logout</span>
                        {isSidebarOpen && <span className="font-medium">Sign Out</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'} p-8`}>
                <div className="max-w-6xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
