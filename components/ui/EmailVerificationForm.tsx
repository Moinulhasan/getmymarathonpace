"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { MailCheck, ArrowRight, Pencil, Loader2 } from "lucide-react";
import { apiVerifyOtp, apiResendOtp } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

interface EmailVerificationFormProps {
    email: string;
    onBackToSignup: () => void;
    onVerifySuccess?: () => void;
}

export default function EmailVerificationForm({
    email,
    onBackToSignup,
    onVerifySuccess,
}: EmailVerificationFormProps) {
    const router = useRouter();
    const { login } = useAuth();
    const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
    const [countdown, setCountdown] = useState(59);
    const [canResend, setCanResend] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    // Countdown timer
    useEffect(() => {
        if (countdown <= 0) {
            setCanResend(true);
            return;
        }
        const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
        return () => clearTimeout(timer);
    }, [countdown]);

    const handleResend = useCallback(async () => {
        setIsResending(true);
        setError("");
        try {
            await apiResendOtp(email);
            setCountdown(59);
            setCanResend(false);
            setOtp(["", "", "", "", "", ""]);
            inputRefs.current[0]?.focus();
        } catch (err: unknown) {
            const apiErr = err as { message?: string };
            setError(apiErr.message || "Failed to resend code.");
        } finally {
            setIsResending(false);
        }
    }, [email]);

    const handleVerify = useCallback(async (code: string) => {
        setError("");
        setIsLoading(true);

        try {
            const res = await apiVerifyOtp(email, code);

            if (res.token && res.user) {
                login(res.token, res.user);
                onVerifySuccess?.();
                router.push("/dashboard");
            }
        } catch (err: unknown) {
            const apiErr = err as { data?: { message?: string }; message?: string };
            setError(apiErr.data?.message || apiErr.message || "Invalid verification code.");
        } finally {
            setIsLoading(false);
        }
    }, [email, login, onVerifySuccess, router]);

    const handleChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value.slice(-1);
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }

        // Auto-submit when all 6 digits entered
        const fullCode = newOtp.join("");
        if (fullCode.length === 6 && newOtp.every((d) => d !== "")) {
            handleVerify(fullCode);
        }
    };

    const handleKeyDown = (
        index: number,
        e: React.KeyboardEvent<HTMLInputElement>
    ) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pasteData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
        if (!pasteData) return;
        const newOtp = [...otp];
        for (let i = 0; i < pasteData.length; i++) {
            newOtp[i] = pasteData[i];
        }
        setOtp(newOtp);
        const focusIndex = Math.min(pasteData.length, 5);
        inputRefs.current[focusIndex]?.focus();

        // Auto-submit if 6 digits pasted
        if (pasteData.length === 6) {
            handleVerify(pasteData);
        }
    };

    const handleSubmitClick = () => {
        const code = otp.join("");
        if (code.length === 6) {
            handleVerify(code);
        } else {
            setError("Please enter the full 6-digit code.");
        }
    };

    // Mask the email
    const maskedEmail = email || "your@email.com";

    return (
        <div className="flex flex-col items-center w-full">
            {/* Icon Badge */}
            <div className="w-14 h-14 rounded-2xl bg-[#7f13ec]/20 border border-[#7f13ec]/30 flex items-center justify-center mb-5">
                <MailCheck size={26} className="text-[#a855f7]" />
            </div>

            {/* Heading */}
            <h2 className="text-2xl font-bold text-white mb-3">
                Check your inbox
            </h2>
            <p className="text-sm text-zinc-400 text-center mb-8 leading-relaxed max-w-xs">
                We&apos;ve sent a 6-digit verification code to{" "}
                <span className="text-white font-semibold">{maskedEmail}</span>.
                Enter it below to secure your account.
            </p>

            {/* Error */}
            {error && (
                <div className="w-full mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                    {error}
                </div>
            )}

            {/* OTP Inputs */}
            <div className="flex gap-2.5 mb-8" onPaste={handlePaste}>
                {otp.map((digit, index) => (
                    <input
                        key={index}
                        ref={(el) => {
                            inputRefs.current[index] = el;
                        }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        className={`w-12 h-14 text-center text-lg font-bold rounded-xl border transition-all focus:outline-none ${digit
                            ? "bg-[#7f13ec]/10 border-[#7f13ec]/50 text-white"
                            : "bg-white/[0.05] border-white/10 text-zinc-500"
                            } focus:border-[#7f13ec] focus:ring-1 focus:ring-[#7f13ec]/30`}
                    />
                ))}
            </div>

            {/* Verify Button */}
            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmitClick}
                disabled={isLoading}
                className="w-full h-12 rounded-xl bg-gradient-to-r from-[#7f13ec] to-[#a855f7] text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#7f13ec]/25 hover:shadow-[#7f13ec]/40 transition-shadow cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
                {isLoading ? (
                    <Loader2 size={18} className="animate-spin" />
                ) : (
                    <>Verify Account <ArrowRight size={16} /></>
                )}
            </motion.button>

            {/* Resend */}
            <div className="flex items-center justify-between w-full mt-6">
                <span className="text-sm text-zinc-400">
                    Didn&apos;t receive the email?
                </span>
                {canResend ? (
                    <button
                        onClick={handleResend}
                        disabled={isResending}
                        className="text-sm text-[#a855f7] hover:text-[#c084fc] font-semibold transition-colors cursor-pointer disabled:opacity-50"
                    >
                        {isResending ? "Sending..." : "Resend Code"}
                    </button>
                ) : (
                    <span className="text-sm text-[#a855f7] font-semibold">
                        Resend Code{" "}
                        <span className="text-[#a855f7]/60">({countdown}s)</span>
                    </span>
                )}
            </div>

            {/* Use different email */}
            <button
                onClick={onBackToSignup}
                className="flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-300 mt-6 pt-5 border-t border-white/5 w-full justify-center transition-colors cursor-pointer"
            >
                <Pencil size={14} />
                Use a different email address
            </button>
        </div>
    );
}
