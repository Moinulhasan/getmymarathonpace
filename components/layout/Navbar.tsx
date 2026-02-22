"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Zap, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import AuthModal from "@/components/ui/AuthModal";
import { useAuth } from "@/context/AuthContext";

const navLinks = [
    { label: "Features", href: "/#features" },
    { label: "How It Works", href: "/#how-it-works" },
    { label: "Pricing", href: "/#pricing" },
    { label: "Blog", href: "/blog" },
];

export default function Navbar() {
    const { user, isAuthenticated, isLoading } = useAuth();
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [authModalOpen, setAuthModalOpen] = useState(false);
    const [authInitialView, setAuthInitialView] = useState<"login" | "signup">("login");

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const openLogin = () => {
        setAuthInitialView("login");
        setAuthModalOpen(true);
    };

    const openSignup = () => {
        setAuthInitialView("signup");
        setAuthModalOpen(true);
    };

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                ? "bg-[#191022]/80 backdrop-blur-xl border-b border-white/5 shadow-lg shadow-black/20"
                : "bg-transparent"
                }`}
            role="navigation"
            aria-label="Main navigation"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 md:h-20">
                    {/* Logo */}
                    <a href="/" className="flex items-center gap-2 group" aria-label="RunGen AI Home">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-500 flex items-center justify-center">
                            <Zap size={16} className="text-white fill-white" />
                        </div>
                        <span className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
                            RunGen <span className="gradient-text">AI</span>
                        </span>
                    </a>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <a
                                key={link.href}
                                href={link.href}
                                className="text-sm text-zinc-400 hover:text-white transition-colors duration-200 relative group"
                            >
                                {link.label}
                                <span className="absolute -bottom-1 left-0 w-0 h-px bg-gradient-to-r from-indigo-500 to-cyan-500 group-hover:w-full transition-all duration-300" />
                            </a>
                        ))}

                        {!isLoading && isAuthenticated ? (
                            /* Logged In State */
                            <Link
                                href="/dashboard"
                                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#7f13ec]/15 text-[#a855f7] text-sm font-medium hover:bg-[#7f13ec]/25 transition-all"
                            >
                                <LayoutDashboard size={16} />
                                Dashboard
                            </Link>
                        ) : !isLoading ? (
                            /* Logged Out State */
                            <>
                                <button
                                    onClick={openLogin}
                                    className="text-sm font-medium text-zinc-300 hover:text-white transition-colors duration-200 cursor-pointer"
                                >
                                    Log In
                                </button>
                                <button
                                    onClick={openSignup}
                                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#7f13ec] to-[#a855f7] text-white text-sm font-semibold shadow-lg shadow-[#7f13ec]/25 hover:shadow-[#7f13ec]/40 transition-shadow cursor-pointer"
                                >
                                    Get Started
                                </button>
                            </>
                        ) : null}
                    </div>

                    {/* Mobile Toggle */}
                    <button
                        className="md:hidden text-zinc-400 hover:text-white transition-colors"
                        onClick={() => setMobileOpen(!mobileOpen)}
                        aria-label={mobileOpen ? "Close menu" : "Open menu"}
                        aria-expanded={mobileOpen}
                    >
                        {mobileOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="md:hidden bg-zinc-950/95 backdrop-blur-xl border-t border-white/5"
                    >
                        <div className="px-4 py-6 space-y-4">
                            {navLinks.map((link) => (
                                <a
                                    key={link.href}
                                    href={link.href}
                                    className="block text-sm text-zinc-400 hover:text-white transition-colors py-2"
                                    onClick={() => setMobileOpen(false)}
                                >
                                    {link.label}
                                </a>
                            ))}

                            {!isLoading && isAuthenticated ? (
                                <Link
                                    href="/dashboard"
                                    className="flex items-center gap-2 w-full px-4 py-2.5 rounded-xl bg-[#7f13ec]/15 text-[#a855f7] text-sm font-medium"
                                    onClick={() => setMobileOpen(false)}
                                >
                                    <LayoutDashboard size={16} />
                                    Dashboard
                                </Link>
                            ) : !isLoading ? (
                                <>
                                    <button
                                        onClick={() => { setMobileOpen(false); openLogin(); }}
                                        className="block w-full text-left text-sm text-zinc-400 hover:text-white transition-colors py-2 cursor-pointer"
                                    >
                                        Log In
                                    </button>
                                    <Button variant="primary" size="sm" onClick={() => { setMobileOpen(false); openSignup(); }} className="w-full">
                                        Get Started
                                    </Button>
                                </>
                            ) : null}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Auth Modal */}
            <AuthModal
                isOpen={authModalOpen}
                onClose={() => setAuthModalOpen(false)}
                initialView={authInitialView}
            />
        </motion.nav>
    );
}
