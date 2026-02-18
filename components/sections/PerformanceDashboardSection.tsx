"use client";

import { motion } from "framer-motion";
import { MapPin, CheckCircle, Mountain, BarChart3 } from "lucide-react";
import SectionWrapper from "@/components/ui/SectionWrapper";
import GradientText from "@/components/ui/GradientText";
import { fadeInUp } from "@/lib/animations";

const features = [
    { label: "Elevation-Adjusted Pace", icon: Mountain },
    { label: "Split-Level Analysis", icon: BarChart3 },
    { label: "Terrain Impact Scoring", icon: MapPin },
];

export default function PerformanceDashboardSection() {
    return (
        <SectionWrapper id="performance-dashboard">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                {/* Left Content */}
                <motion.div variants={fadeInUp} className="space-y-6">
                    <p className="text-sm font-medium text-indigo-400 uppercase tracking-wider">
                        Analytics
                    </p>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
                        Performance Insights{" "}
                        <GradientText>Dashboard</GradientText>
                    </h2>
                    <p className="text-zinc-500 text-lg max-w-lg leading-relaxed">
                        Visualize every segment of your run. Our GPS integration maps
                        your pace against elevation gradients to highlight specific
                        weaknesses.
                    </p>
                    <ul className="space-y-3 pt-2">
                        {features.map((feature) => (
                            <li
                                key={feature.label}
                                className="flex items-center gap-3"
                            >
                                <CheckCircle
                                    size={18}
                                    className="text-emerald-400 shrink-0"
                                />
                                <span className="text-sm text-zinc-300">
                                    {feature.label}
                                </span>
                            </li>
                        ))}
                    </ul>
                </motion.div>

                {/* Right – Dashboard Mock Card */}
                <motion.div variants={fadeInUp}>
                    <div className="glass-card glow-border p-6 sm:p-8 space-y-6">
                        {/* Header */}
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-white">
                                    Morning Tempo
                                </h3>
                                <p className="text-sm text-zinc-500 flex items-center gap-1.5">
                                    <MapPin size={13} className="text-indigo-400" />
                                    San Francisco • 10.5km
                                </p>
                            </div>
                            <div className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                                <p className="text-xs text-emerald-400 font-medium">
                                    Completed
                                </p>
                            </div>
                        </div>

                        {/* Mock Chart - Elevation Profile */}
                        <div className="relative h-40 w-full rounded-xl bg-white/[0.02] border border-white/5 overflow-hidden p-4">
                            <svg
                                viewBox="0 0 400 120"
                                fill="none"
                                className="w-full h-full"
                                preserveAspectRatio="none"
                            >
                                <defs>
                                    <linearGradient
                                        id="elevGrad"
                                        x1="0%"
                                        y1="0%"
                                        x2="0%"
                                        y2="100%"
                                    >
                                        <stop
                                            offset="0%"
                                            stopColor="#6366f1"
                                            stopOpacity="0.3"
                                        />
                                        <stop
                                            offset="100%"
                                            stopColor="#6366f1"
                                            stopOpacity="0"
                                        />
                                    </linearGradient>
                                </defs>
                                <path
                                    d="M0 90 Q50 60 100 70 Q150 80 200 40 Q250 20 300 50 Q350 65 400 30"
                                    stroke="#6366f1"
                                    strokeWidth="2"
                                    fill="none"
                                />
                                <path
                                    d="M0 90 Q50 60 100 70 Q150 80 200 40 Q250 20 300 50 Q350 65 400 30 L400 120 L0 120 Z"
                                    fill="url(#elevGrad)"
                                />
                                {/* Pace overlay */}
                                <path
                                    d="M0 80 Q50 75 100 85 Q150 65 200 55 Q250 60 300 45 Q350 50 400 35"
                                    stroke="#a855f7"
                                    strokeWidth="2"
                                    strokeDasharray="4 4"
                                    fill="none"
                                    opacity="0.6"
                                />
                            </svg>
                            {/* Legend */}
                            <div className="absolute bottom-3 right-3 flex items-center gap-4">
                                <div className="flex items-center gap-1.5">
                                    <div className="w-3 h-0.5 rounded-full bg-indigo-500" />
                                    <span className="text-[10px] text-zinc-500">
                                        Elevation
                                    </span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-3 h-0.5 rounded-full bg-purple-500 opacity-60" />
                                    <span className="text-[10px] text-zinc-500">
                                        Pace
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Stats Row */}
                        <div className="grid grid-cols-3 gap-4">
                            <div className="px-3 py-2 rounded-lg bg-white/[0.02] border border-white/5">
                                <p className="text-[10px] text-zinc-500 uppercase tracking-wider">
                                    Avg Pace
                                </p>
                                <p className="text-sm font-bold text-white">
                                    5:12 /km
                                </p>
                            </div>
                            <div className="px-3 py-2 rounded-lg bg-white/[0.02] border border-white/5">
                                <p className="text-[10px] text-zinc-500 uppercase tracking-wider">
                                    Elevation
                                </p>
                                <p className="text-sm font-bold text-white">
                                    +142m
                                </p>
                            </div>
                            <div className="px-3 py-2 rounded-lg bg-white/[0.02] border border-white/5">
                                <p className="text-[10px] text-zinc-500 uppercase tracking-wider">
                                    Heart Rate
                                </p>
                                <p className="text-sm font-bold text-white">
                                    156 bpm
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </SectionWrapper>
    );
}
