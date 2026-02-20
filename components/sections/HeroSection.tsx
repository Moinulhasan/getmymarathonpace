"use client";

import { motion } from "framer-motion";
import { ArrowRight, Play, Timer, CalendarDays } from "lucide-react";
import Button from "@/components/ui/Button";
import {
    fadeInLeft,
    fadeInRight,
    glowPulse,
} from "@/lib/animations";

/* ── Orbit keyframes injected via <style> ── */
const orbitStyles = `
@keyframes orbit {
  from { transform: rotate(0deg) translateX(var(--orbit-radius)) rotate(0deg); }
  to   { transform: rotate(360deg) translateX(var(--orbit-radius)) rotate(-360deg); }
}
`;

const statCards = [
    {
        label: "CURRENT PB",
        value: "5K in 22:10",
        icon: "timer" as const,
        startAngle: 320,
    },
    {
        label: "PHASE",
        value: "Marathon - Week 12",
        icon: "calendar" as const,
        startAngle: 140,
    },
];

/* ── Inline SVG Runner Illustration ── */
function RunnerIllustration({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 400 400"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <defs>
                <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#a855f7" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity="0.9" />
                </linearGradient>
                <linearGradient id="glowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#c084fc" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#818cf8" stopOpacity="0.3" />
                </linearGradient>
                <filter id="neonGlow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="6" result="blur" />
                    <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
                <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="12" result="blur" />
                    <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>

            {/* Ambient glow behind runner */}
            <ellipse cx="200" cy="210" rx="80" ry="90" fill="url(#glowGrad)" filter="url(#softGlow)" opacity="0.4" />

            {/* Runner silhouette – dynamic mid-stride pose */}
            <g filter="url(#neonGlow)" transform="translate(200,200) scale(1.1) translate(-200,-200)">
                {/* Head */}
                <circle cx="215" cy="105" r="22" fill="url(#bodyGrad)" />
                {/* Neck */}
                <rect x="210" y="125" width="10" height="14" rx="4" fill="url(#bodyGrad)" />
                {/* Torso – leaning forward */}
                <path d="M195 138 L230 140 L225 200 L190 195 Z" fill="url(#bodyGrad)" rx="6" />
                {/* Right arm (forward swing) */}
                <path d="M228 145 L260 120 L268 130 L238 158" fill="url(#bodyGrad)" strokeLinecap="round" />
                <path d="M260 120 L250 95 L258 92 L270 118" fill="url(#bodyGrad)" />
                {/* Left arm (back swing) */}
                <path d="M198 148 L170 175 L165 168 L192 142" fill="url(#bodyGrad)" />
                <path d="M170 175 L155 195 L148 190 L164 170" fill="url(#bodyGrad)" />
                {/* Hips */}
                <ellipse cx="208" cy="200" rx="22" ry="12" fill="url(#bodyGrad)" />
                {/* Right leg (forward stride) */}
                <path d="M220 205 L260 248 L255 256 L215 212" fill="url(#bodyGrad)" />
                <path d="M260 248 L280 300 L272 304 L252 255" fill="url(#bodyGrad)" />
                <path d="M280 300 L295 310 L292 318 L275 308" fill="url(#bodyGrad)" />
                {/* Left leg (back push) */}
                <path d="M195 207 L165 260 L158 255 L188 204" fill="url(#bodyGrad)" />
                <path d="M165 260 L135 310 L128 306 L158 256" fill="url(#bodyGrad)" />
                <path d="M135 310 L120 315 L118 308 L132 305" fill="url(#bodyGrad)" />
            </g>

            {/* Motion lines */}
            <g opacity="0.3" stroke="#a855f7" strokeWidth="2" strokeLinecap="round">
                <line x1="100" y1="160" x2="130" y2="160">
                    <animate attributeName="x1" values="100;90;100" dur="2s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.3;0.1;0.3" dur="2s" repeatCount="indefinite" />
                </line>
                <line x1="95" y1="185" x2="125" y2="185">
                    <animate attributeName="x1" values="95;82;95" dur="2.5s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.2;0.05;0.2" dur="2.5s" repeatCount="indefinite" />
                </line>
                <line x1="105" y1="210" x2="135" y2="210">
                    <animate attributeName="x1" values="105;95;105" dur="1.8s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.25;0.08;0.25" dur="1.8s" repeatCount="indefinite" />
                </line>
            </g>

            {/* Ground shadow */}
            <ellipse cx="210" cy="330" rx="60" ry="8" fill="#a855f7" opacity="0.1" filter="url(#softGlow)" />
        </svg>
    );
}

export default function HeroSection() {
    return (
        <section className="relative min-h-screen flex items-center overflow-hidden pt-20" aria-label="Hero">
            {/* Inject orbit keyframe */}
            <style dangerouslySetInnerHTML={{ __html: orbitStyles }} />

            {/* Gradient Background Glow */}
            <motion.div
                className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] md:w-[900px] md:h-[900px] rounded-full pointer-events-none"
                style={{
                    background:
                        "radial-gradient(circle, rgba(108,43,238,0.18) 0%, rgba(108,43,238,0.08) 40%, transparent 70%)",
                }}
                animate={glowPulse}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                    {/* ── Left Content ── */}
                    <motion.div
                        variants={fadeInLeft}
                        initial="hidden"
                        animate="visible"
                        className="space-y-8"
                    >
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-emerald-400">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            AI ENGINE V2.4 LIVE
                        </div>

                        <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-[1.1]">
                            Train Smarter.
                            <br />
                            <span className="gradient-text">Hit Your Goal Pace.</span>
                        </h1>

                        <p className="text-lg sm:text-xl text-zinc-400 max-w-lg leading-relaxed">
                            Elite AI-powered running plans that adapt to your daily performance,
                            biological markers, and recovery to prevent plateaus and injury.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Button variant="primary" size="lg" href="/dashboard/plans">
                                Generate My Plan
                                <ArrowRight size={18} />
                            </Button>
                            <Button variant="secondary" size="lg" href="#plan-preview">
                                <Play size={16} />
                                See Demo Plan
                            </Button>
                        </div>

                        {/* Social Proof */}
                        <div className="flex items-center gap-6 pt-4">
                            <div className="flex -space-x-2">
                                {[...Array(4)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="w-8 h-8 rounded-full border-2 border-zinc-950 bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-[10px] font-bold text-white"
                                    >
                                        {String.fromCharCode(65 + i)}
                                    </div>
                                ))}
                            </div>
                            <p className="text-sm text-zinc-500">
                                <span className="text-white font-medium">2,400+</span> runners
                                training smarter
                            </p>
                        </div>

                        {/* Integrations */}
                        <div className="pt-2">
                            <p className="text-xs text-zinc-600 uppercase tracking-wider mb-3">
                                Works with
                            </p>
                            <div className="flex items-center gap-5 flex-wrap">
                                {/* Strava */}
                                <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-orange-500/20 transition-all duration-200 group">
                                    <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#FC4C02] group-hover:scale-110 transition-transform" fill="currentColor">
                                        <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0l-7 13.828h4.169" />
                                    </svg>
                                    <span className="text-xs font-medium text-zinc-400 group-hover:text-zinc-300 transition-colors">Strava</span>
                                </div>

                                {/* Garmin */}
                                <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-sky-500/20 transition-all duration-200 group">
                                    <svg viewBox="0 0 24 24" className="w-5 h-5 text-sky-400 group-hover:scale-110 transition-transform" fill="currentColor">
                                        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 2.4c5.302 0 9.6 4.298 9.6 9.6s-4.298 9.6-9.6 9.6S2.4 17.302 2.4 12 6.698 2.4 12 2.4zm0 1.2c-4.638 0-8.4 3.762-8.4 8.4s3.762 8.4 8.4 8.4 8.4-3.762 8.4-8.4-3.762-8.4-8.4-8.4zm0 2.4a6 6 0 110 12 6 6 0 010-12zm-2.4 3l2.4 3.6L14.4 9h2.4l-4.8 7.2L7.2 9z" />
                                    </svg>
                                    <span className="text-xs font-medium text-zinc-400 group-hover:text-zinc-300 transition-colors">Garmin</span>
                                </div>

                                {/* COROS */}
                                <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-emerald-500/20 transition-all duration-200 group">
                                    <svg viewBox="0 0 24 24" className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" fill="currentColor">
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
                                    </svg>
                                    <span className="text-xs font-medium text-zinc-400 group-hover:text-zinc-300 transition-colors">COROS</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* ── Right – Circle with Runner + Orbiting Cards ── */}
                    <motion.div
                        variants={fadeInRight}
                        initial="hidden"
                        animate="visible"
                        className="relative flex justify-center items-center min-h-[420px] sm:min-h-[480px] lg:min-h-[540px]"
                    >
                        {/* Outer glow */}
                        <div className="absolute w-[340px] h-[340px] sm:w-[400px] sm:h-[400px] lg:w-[460px] lg:h-[460px] rounded-full bg-purple-600/10 blur-3xl pointer-events-none" />

                        {/* Circle with purple ring */}
                        <div
                            className="relative w-[280px] h-[280px] sm:w-[340px] sm:h-[340px] lg:w-[400px] lg:h-[400px] rounded-full flex items-center justify-center"
                            style={{
                                background: "radial-gradient(circle, rgba(24,24,27,1) 60%, rgba(108,43,238,0.12) 100%)",
                                boxShadow: "0 0 0 2px rgba(108,43,238,0.4), 0 0 60px rgba(108,43,238,0.15), 0 0 120px rgba(108,43,238,0.08)",
                            }}
                        >
                            {/* Inner subtle ring */}
                            <div
                                className="absolute inset-[2px] rounded-full"
                                style={{
                                    border: "1px solid rgba(108,43,238,0.2)",
                                }}
                            />

                            {/* Runner SVG illustration */}
                            <RunnerIllustration className="w-[200px] h-[200px] sm:w-[250px] sm:h-[250px] lg:w-[300px] lg:h-[300px]" />
                        </div>

                        {/* ── Orbiting Stat Cards ── */}
                        {statCards.map((stat) => (
                            <div
                                key={stat.label}
                                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                                style={
                                    {
                                        "--orbit-radius": "220px",
                                        animation: "orbit 20s linear infinite",
                                        animationDelay: `${(-stat.startAngle / 360) * 20}s`,
                                    } as React.CSSProperties
                                }
                            >
                                {/* Card – counter-rotated so text stays upright */}
                                <div
                                    className="pointer-events-auto glass-card px-4 py-3 flex items-center gap-3 shadow-lg shadow-black/30"
                                    style={{ minWidth: "160px" }}
                                >
                                    {/* Icon */}
                                    <div className="w-9 h-9 rounded-lg bg-purple-600/20 border border-purple-500/30 flex items-center justify-center shrink-0">
                                        {stat.icon === "timer" ? (
                                            <Timer size={18} className="text-purple-400" />
                                        ) : (
                                            <CalendarDays size={18} className="text-purple-400" />
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold leading-none mb-1">
                                            {stat.label}
                                        </p>
                                        <p className="text-sm font-bold text-white leading-none whitespace-nowrap">
                                            {stat.value}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>

            {/* Bottom Gradient Fade */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-zinc-950 to-transparent pointer-events-none" />
        </section>
    );
}
