"use client";

import { motion } from "framer-motion";
import {
    Calendar,
    Dumbbell,
    Moon,
    Zap,
    TrendingUp,
    Timer,
} from "lucide-react";
import SectionWrapper from "@/components/ui/SectionWrapper";
import GradientText from "@/components/ui/GradientText";
import { fadeInUp } from "@/lib/animations";

const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const planData = [
    {
        day: "Mon",
        type: "Easy Run",
        detail: "5K @ 6:20/km",
        icon: Zap,
        color: "text-green-400",
        bg: "bg-green-500/10",
    },
    {
        day: "Tue",
        type: "Strength",
        detail: "Core + Legs",
        icon: Dumbbell,
        color: "text-purple-400",
        bg: "bg-purple-500/10",
    },
    {
        day: "Wed",
        type: "Tempo Run",
        detail: "8K @ 5:30/km",
        icon: TrendingUp,
        color: "text-indigo-400",
        bg: "bg-indigo-500/10",
    },
    {
        day: "Thu",
        type: "Recovery",
        detail: "Light yoga",
        icon: Moon,
        color: "text-cyan-400",
        bg: "bg-cyan-500/10",
    },
    {
        day: "Fri",
        type: "Long Run",
        detail: "15K @ 6:00/km",
        icon: Timer,
        color: "text-amber-400",
        bg: "bg-amber-500/10",
    },
    {
        day: "Sat",
        type: "Strength",
        detail: "Upper + Core",
        icon: Dumbbell,
        color: "text-purple-400",
        bg: "bg-purple-500/10",
    },
    {
        day: "Sun",
        type: "Rest Day",
        detail: "Full recovery",
        icon: Moon,
        color: "text-zinc-500",
        bg: "bg-zinc-500/10",
    },
];

export default function PlanPreviewSection() {
    return (
        <SectionWrapper id="plan-preview">
            <motion.div variants={fadeInUp} className="text-center mb-12">
                <p className="text-sm font-medium text-indigo-400 uppercase tracking-wider mb-3">
                    Preview
                </p>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
                    Your <GradientText>Weekly Plan</GradientText>
                </h2>
                <p className="mt-4 text-zinc-500 text-lg max-w-2xl mx-auto">
                    A real preview of what your AI-generated training week looks like.
                </p>
            </motion.div>

            <motion.div variants={fadeInUp} className="max-w-5xl mx-auto">
                <div className="glass-card glow-border p-6 sm:p-8">
                    {/* Dashboard Header */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <Calendar size={18} className="text-indigo-400" />
                                <h3 className="text-lg font-semibold text-white">
                                    Week 8 of 16
                                </h3>
                            </div>
                            <p className="text-sm text-zinc-500">
                                Half Marathon • Target: 1:45:00
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="px-3 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                                <p className="text-xs text-indigo-300">Weekly Volume</p>
                                <p className="text-sm font-bold text-white">42 km</p>
                            </div>
                            <div className="px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20">
                                <p className="text-xs text-green-300">Progress</p>
                                <p className="text-sm font-bold text-white">On Track</p>
                            </div>
                        </div>
                    </div>

                    {/* Calendar Grid */}
                    {/* Desktop: Full row */}
                    <div className="hidden sm:grid grid-cols-7 gap-3">
                        {/* Headers */}
                        {weekDays.map((day) => (
                            <div
                                key={`header-${day}`}
                                className="text-center text-xs text-zinc-600 font-medium pb-2"
                            >
                                {day}
                            </div>
                        ))}

                        {/* Day Cards */}
                        {planData.map((item) => (
                            <motion.div
                                key={item.day}
                                whileHover={{ scale: 1.05, y: -4 }}
                                transition={{ type: "spring", stiffness: 400, damping: 15 }}
                                className="p-3 rounded-xl border border-white/5 bg-white/[0.02] hover:border-indigo-500/20 hover:bg-white/[0.04] transition-colors cursor-pointer group"
                            >
                                <div
                                    className={`w-8 h-8 rounded-lg ${item.bg} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}
                                >
                                    <item.icon size={16} className={item.color} />
                                </div>
                                <p className="text-xs font-medium text-white mb-0.5 truncate">
                                    {item.type}
                                </p>
                                <p className="text-[10px] text-zinc-500 truncate">
                                    {item.detail}
                                </p>
                            </motion.div>
                        ))}
                    </div>

                    {/* Mobile: Stacked list */}
                    <div className="sm:hidden space-y-2">
                        {planData.map((item) => (
                            <div
                                key={`mobile-${item.day}`}
                                className="flex items-center gap-3 p-3 rounded-xl border border-white/5 bg-white/[0.02]"
                            >
                                <div className="text-xs text-zinc-600 font-medium w-8">
                                    {item.day}
                                </div>
                                <div
                                    className={`w-8 h-8 rounded-lg ${item.bg} flex items-center justify-center shrink-0`}
                                >
                                    <item.icon size={14} className={item.color} />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs font-medium text-white truncate">
                                        {item.type}
                                    </p>
                                    <p className="text-[10px] text-zinc-500 truncate">
                                        {item.detail}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>
        </SectionWrapper>
    );
}
