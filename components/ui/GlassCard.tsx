import { type ReactNode } from "react";

interface GlassCardProps {
    children: ReactNode;
    className?: string;
    hover?: boolean;
    glow?: boolean;
}

export default function GlassCard({
    children,
    className = "",
    hover = false,
    glow = false,
}: GlassCardProps) {
    return (
        <div
            className={`${hover ? "glass-card-hover" : "glass-card"} ${glow ? "glow-border" : ""} ${className}`}
        >
            {children}
        </div>
    );
}
