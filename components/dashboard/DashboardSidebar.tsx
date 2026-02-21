"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
    LayoutDashboard,
    ClipboardList,
    BarChart3,
    Activity,
    User,
    LogOut,
    Zap,
    Menu,
    X,
    Map,
    Settings,
    Unplug,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";

const navItems = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Athlete Analysis", href: "/dashboard/insights", icon: BarChart3 },
    { label: "Training Plan", href: "/dashboard/plans", icon: ClipboardList },
    { label: "Routes", href: "/dashboard/routes", icon: Map },
    { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function DashboardSidebar({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);
    const { user, logout } = useAuth();

    const userInitials = user?.name
        ? user.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
        : "U";

    const sidebarContent = (
        <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="flex items-center gap-2.5 px-5 pt-6 pb-8">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#7f13ec] to-[#a855f7] flex items-center justify-center">
                    <Zap size={18} className="text-white fill-white" />
                </div>
                <div>
                    <span className="text-base font-bold text-white block leading-tight">
                        RunGen AI
                    </span>
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-[#a855f7]">
                        Elite Performance
                    </span>
                </div>
            </div>

            {/* Nav Items */}
            <nav className="flex-1 px-3 space-y-1">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setMobileOpen(false)}
                            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${isActive
                                ? "bg-[#7f13ec]/15 text-[#a855f7]"
                                : "text-zinc-400 hover:text-white hover:bg-white/5"
                                }`}
                        >
                            <Icon size={18} />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            {/* Connect Strava Button */}
            <div className="px-3 mb-4">
                <button
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#ff5722] hover:bg-[#ff7043] text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-orange-950/20 group"
                >
                    <Unplug size={18} className="group-hover:rotate-12 transition-transform" />
                    Connect Strava
                </button>
            </div>

            {/* User Profile */}
            <div className="px-3 pb-4">
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.06]">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center text-white font-bold text-sm">
                        {userInitials}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white truncate">{user?.name || "User"}</p>
                        <p className="text-xs text-zinc-500 truncate">{user?.email || ""}</p>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="flex h-screen overflow-hidden bg-[#0f0a18]">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex w-60 flex-shrink-0 flex-col bg-[#130e1e] border-r border-white/[0.06]">
                {sidebarContent}
            </aside>

            {/* Mobile Overlay */}
            <AnimatePresence>
                {mobileOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                            onClick={() => setMobileOpen(false)}
                        />
                        <motion.aside
                            initial={{ x: -280 }}
                            animate={{ x: 0 }}
                            exit={{ x: -280 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="fixed left-0 top-0 bottom-0 w-64 bg-[#130e1e] border-r border-white/[0.06] z-50 lg:hidden"
                        >
                            <button
                                onClick={() => setMobileOpen(false)}
                                className="absolute top-4 right-3 w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer"
                            >
                                <X size={16} />
                            </button>
                            {sidebarContent}
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* Main */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Mobile Header */}
                <header className="lg:hidden flex items-center gap-3 px-4 h-14 bg-[#130e1e] border-b border-white/[0.06] flex-shrink-0">
                    <button
                        onClick={() => setMobileOpen(true)}
                        className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer"
                    >
                        <Menu size={18} />
                    </button>
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#7f13ec] to-[#a855f7] flex items-center justify-center">
                            <Zap size={14} className="text-white fill-white" />
                        </div>
                        <span className="text-sm font-bold text-white">RunGen AI</span>
                    </div>
                </header>

                {/* Content */}
                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
