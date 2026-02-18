"use client";

import { motion } from "framer-motion";
import { type ReactNode } from "react";

interface ButtonProps {
    children: ReactNode;
    variant?: "primary" | "secondary" | "ghost";
    size?: "sm" | "md" | "lg";
    href?: string;
    onClick?: () => void;
    className?: string;
    ariaLabel?: string;
}

const variants = {
    primary:
        "bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40",
    secondary:
        "border border-white/10 bg-white/5 text-white hover:bg-white/10 hover:border-white/20",
    ghost: "text-zinc-400 hover:text-white hover:bg-white/5",
};

const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-base",
};

export default function Button({
    children,
    variant = "primary",
    size = "md",
    href,
    onClick,
    className = "",
    ariaLabel,
}: ButtonProps) {
    const baseClasses = `inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-300 cursor-pointer ${variants[variant]} ${sizes[size]} ${className}`;

    const motionProps = {
        whileHover: { scale: 1.02 },
        whileTap: { scale: 0.98 },
        transition: { type: "spring" as const, stiffness: 400, damping: 17 },
    };

    if (href) {
        return (
            <motion.a
                href={href}
                className={baseClasses}
                aria-label={ariaLabel}
                {...motionProps}
            >
                {children}
            </motion.a>
        );
    }

    return (
        <motion.button
            className={baseClasses}
            onClick={onClick}
            aria-label={ariaLabel}
            {...motionProps}
        >
            {children}
        </motion.button>
    );
}
