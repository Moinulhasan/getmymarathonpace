"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Lock, Zap, ArrowRight, Loader2 } from "lucide-react";
import { apiLogin, apiGoogleLogin } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useGoogleLogin } from "@/hooks/useGoogleLogin";

interface LoginFormProps {
    onSwitchToSignup: () => void;
    onLoginSuccess?: () => void;
    onRequiresOtp?: (email: string) => void;
}

export default function LoginForm({
    onSwitchToSignup,
    onLoginSuccess,
    onRequiresOtp,
}: LoginFormProps) {
    const router = useRouter();
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);

    const { triggerGoogleLogin } = useGoogleLogin({
        onSuccess: async (credential) => {
            setError("");
            setIsGoogleLoading(true);
            try {
                const res = await apiGoogleLogin(credential);
                if (res.token && res.user) {
                    login(res.token, res.user);
                    onLoginSuccess?.();
                    router.push("/dashboard");
                }
            } catch (err: unknown) {
                const apiErr = err as { data?: { message?: string }; message?: string };
                setError(apiErr.data?.message || apiErr.message || "Google login failed.");
            } finally {
                setIsGoogleLoading(false);
            }
        },
        onError: (errMsg) => setError(errMsg),
    });

    const handleSubmit = async () => {
        if (!email || !password) {
            setError("Please fill in all fields.");
            return;
        }

        setError("");
        setIsLoading(true);

        try {
            const res = await apiLogin(email, password);

            if (res.token && res.user) {
                login(res.token, res.user);
                onLoginSuccess?.();
                router.push("/dashboard");
            }
        } catch (err: unknown) {
            const apiErr = err as { status?: number; data?: { requires_otp?: boolean; email?: string; message?: string }; message?: string };
            if (apiErr.status === 403 && apiErr.data?.requires_otp) {
                onRequiresOtp?.(apiErr.data.email || email);
            } else {
                setError(apiErr.data?.message || apiErr.message || "Login failed.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        triggerGoogleLogin();
    };

    return (
        <div className="flex flex-col items-center w-full">
            {/* Icon Badge */}
            <div className="w-12 h-12 rounded-full bg-[#7f13ec] flex items-center justify-center mb-5">
                <Zap size={22} className="text-white fill-white" />
            </div>

            {/* Heading */}
            <h2 className="text-2xl font-bold text-white mb-1">Welcome Back</h2>
            <p className="text-sm text-zinc-400 mb-7">
                Experience the next generation of AI content
            </p>

            {/* Error */}
            {error && (
                <div className="w-full mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                    {error}
                </div>
            )}

            {/* Google Button */}
            <button
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center gap-3 h-12 rounded-xl bg-white/[0.06] border border-white/10 text-white text-sm font-medium hover:bg-white/[0.1] hover:border-white/20 transition-all duration-200 mb-6 cursor-pointer"
            >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4" />
                    <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853" />
                    <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.997 8.997 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05" />
                    <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 6.29C4.672 4.163 6.656 2.58 9 2.58z" fill="#EA4335" />
                </svg>
                Continue with Google
            </button>

            {/* Divider */}
            <div className="flex items-center gap-4 w-full mb-6">
                <div className="flex-1 h-px bg-white/10" />
                <span className="text-xs text-zinc-500 uppercase tracking-widest font-medium">
                    or email
                </span>
                <div className="flex-1 h-px bg-white/10" />
            </div>

            {/* Email Field */}
            <div className="w-full mb-4">
                <label className="block text-xs text-zinc-400 uppercase tracking-wider font-semibold mb-2">
                    Email Address
                </label>
                <div className="relative">
                    <Mail
                        size={16}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
                    />
                    <input
                        type="email"
                        placeholder="name@company.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full h-12 pl-11 pr-4 rounded-xl bg-white/[0.05] border border-white/10 text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-[#7f13ec]/50 focus:ring-1 focus:ring-[#7f13ec]/30 transition-all"
                    />
                </div>
            </div>

            {/* Password Field */}
            <div className="w-full mb-6">
                <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs text-zinc-400 uppercase tracking-wider font-semibold">
                        Password
                    </label>
                    <button className="text-xs text-[#a855f7] hover:text-[#c084fc] transition-colors cursor-pointer">
                        Forgot Password?
                    </button>
                </div>
                <div className="relative">
                    <Lock
                        size={16}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
                    />
                    <input
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                        className="w-full h-12 pl-11 pr-4 rounded-xl bg-white/[0.05] border border-white/10 text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-[#7f13ec]/50 focus:ring-1 focus:ring-[#7f13ec]/30 transition-all"
                    />
                </div>
            </div>

            {/* Sign In Button */}
            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full h-12 rounded-xl bg-gradient-to-r from-[#7f13ec] to-[#a855f7] text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#7f13ec]/25 hover:shadow-[#7f13ec]/40 transition-shadow cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
                {isLoading ? (
                    <Loader2 size={18} className="animate-spin" />
                ) : (
                    <>Sign In <ArrowRight size={16} /></>
                )}
            </motion.button>

            {/* Switch to Signup */}
            <p className="text-sm text-zinc-400 mt-6">
                Don&apos;t have an account?{" "}
                <button
                    onClick={onSwitchToSignup}
                    className="text-[#a855f7] hover:text-[#c084fc] font-medium transition-colors cursor-pointer"
                >
                    Sign Up
                </button>
            </p>

            {/* Footer Links */}
            <div className="flex items-center gap-4 mt-5 pt-5 border-t border-white/5 w-full justify-center">
                <button className="text-[10px] text-zinc-500 uppercase tracking-widest hover:text-zinc-400 transition-colors cursor-pointer">
                    Terms of Service
                </button>
                <span className="text-zinc-600 text-xs">•</span>
                <button className="text-[10px] text-zinc-500 uppercase tracking-widest hover:text-zinc-400 transition-colors cursor-pointer">
                    Privacy Policy
                </button>
            </div>
        </div>
    );
}
