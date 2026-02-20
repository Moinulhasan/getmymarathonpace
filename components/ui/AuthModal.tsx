"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import EmailVerificationForm from "./EmailVerificationForm";

type AuthView = "login" | "signup" | "verification";

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialView?: AuthView;
}

const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
};

const cardVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
    },
    exit: {
        opacity: 0,
        scale: 0.95,
        y: 20,
        transition: { duration: 0.2, ease: "easeIn" as const },
    },
};

const contentVariants = {
    enter: { opacity: 0, x: 20 },
    center: { opacity: 1, x: 0, transition: { duration: 0.3, delay: 0.05 } },
    exit: { opacity: 0, x: -20, transition: { duration: 0.15 } },
};

export default function AuthModal({
    isOpen,
    onClose,
    initialView = "login",
}: AuthModalProps) {
    const [view, setView] = useState<AuthView>(initialView);
    const [signupEmail, setSignupEmail] = useState("");

    // Lock body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            const scrollY = window.scrollY;
            document.body.style.position = "fixed";
            document.body.style.top = `-${scrollY}px`;
            document.body.style.left = "0";
            document.body.style.right = "0";
            document.body.style.overflow = "hidden";
            return () => {
                document.body.style.position = "";
                document.body.style.top = "";
                document.body.style.left = "";
                document.body.style.right = "";
                document.body.style.overflow = "";
                window.scrollTo(0, scrollY);
            };
        }
    }, [isOpen]);

    const handleSwitchToSignup = useCallback(() => setView("signup"), []);
    const handleSwitchToLogin = useCallback(() => setView("login"), []);
    const handleSignup = useCallback((email: string) => {
        setSignupEmail(email);
        setView("verification");
    }, []);
    const handleBackToSignup = useCallback(() => setView("signup"), []);

    const handleClose = useCallback(() => {
        onClose();
        // Reset view after animation completes
        setTimeout(() => setView(initialView), 300);
    }, [onClose, initialView]);

    // When login/verify succeeds, close modal
    const handleAuthSuccess = useCallback(() => {
        handleClose();
    }, [handleClose]);

    // When login returns requires_otp (unverified email)
    const handleRequiresOtp = useCallback((email: string) => {
        setSignupEmail(email);
        setView("verification");
    }, []);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto"
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    variants={overlayVariants}
                    transition={{ duration: 0.25 }}
                >
                    {/* Backdrop */}
                    <motion.div
                        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                        onClick={handleClose}
                    />

                    {/* Card */}
                    <motion.div
                        variants={cardVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="relative w-full max-w-md my-auto bg-[#1a1025]/95 border border-white/[0.08] rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/50 overflow-hidden flex-shrink-0"
                    >
                        {/* Subtle glow behind card */}
                        <div className="absolute -top-24 -left-24 w-48 h-48 bg-[#7f13ec]/15 rounded-full blur-3xl pointer-events-none" />
                        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-[#a855f7]/10 rounded-full blur-3xl pointer-events-none" />

                        {/* Close Button */}
                        <button
                            onClick={handleClose}
                            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/[0.05] border border-white/10 flex items-center justify-center text-zinc-500 hover:text-white hover:bg-white/10 transition-all cursor-pointer z-10"
                            aria-label="Close modal"
                        >
                            <X size={14} />
                        </button>

                        {/* Content */}
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={view}
                                variants={contentVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                            >
                                {view === "login" && (
                                    <LoginForm
                                        onSwitchToSignup={handleSwitchToSignup}
                                        onLoginSuccess={handleAuthSuccess}
                                        onRequiresOtp={handleRequiresOtp}
                                    />
                                )}
                                {view === "signup" && (
                                    <SignupForm
                                        onSwitchToLogin={handleSwitchToLogin}
                                        onSignup={handleSignup}
                                    />
                                )}
                                {view === "verification" && (
                                    <EmailVerificationForm
                                        email={signupEmail}
                                        onBackToSignup={handleBackToSignup}
                                        onVerifySuccess={handleAuthSuccess}
                                    />
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
