"use client";

import { motion } from "framer-motion";
import { TrendingUp, Activity } from "lucide-react";
import SectionWrapper from "@/components/ui/SectionWrapper";
import GradientText from "@/components/ui/GradientText";
import { fadeInUp } from "@/lib/animations";

export default function VO2MaxSection() {
    return (
        <SectionWrapper id="vo2max">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                {/* Left – Chart Card */}
                <motion.div variants={fadeInUp} className="order-2 lg:order-1">
                    <div className="glass-card glow-border p-6 sm:p-8 space-y-6">
                        {/* Header */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Activity size={18} className="text-indigo-400" />
                                <h3 className="text-lg font-semibold text-white">
                                    Fitness Progression
                                </h3>
                            </div>
                            <div className="px-3 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                                <p className="text-lg font-bold text-white">4:55</p>
                                <p className="text-[10px] text-indigo-300">
                                    Current Pace / km
                                </p>
                            </div>
                        </div>

                        {/* Mock Chart – VO2 Max Trend */}
                        <div className="relative h-44 w-full rounded-xl bg-white/[0.02] border border-white/5 overflow-hidden p-4">
                            <svg
                                viewBox="0 0 400 140"
                                fill="none"
                                className="w-full h-full"
                                preserveAspectRatio="none"
                            >
                                <defs>
                                    <linearGradient
                                        id="vo2Grad"
                                        x1="0%"
                                        y1="0%"
                                        x2="0%"
                                        y2="100%"
                                    >
                                        <stop
                                            offset="0%"
                                            stopColor="#22c55e"
                                            stopOpacity="0.3"
                                        />
                                        <stop
                                            offset="100%"
                                            stopColor="#22c55e"
                                            stopOpacity="0"
                                        />
                                    </linearGradient>
                                </defs>
                                {/* Grid lines */}
                                <line x1="0" y1="35" x2="400" y2="35" stroke="rgba(255,255,255,0.03)" />
                                <line x1="0" y1="70" x2="400" y2="70" stroke="rgba(255,255,255,0.03)" />
                                <line x1="0" y1="105" x2="400" y2="105" stroke="rgba(255,255,255,0.03)" />
                                {/* VO2 Max trend line – upward */}
                                <path
                                    d="M0 110 Q40 105 80 100 Q120 90 160 82 Q200 70 240 58 Q280 48 320 38 Q360 30 400 22"
                                    stroke="#22c55e"
                                    strokeWidth="2.5"
                                    fill="none"
                                />
                                <path
                                    d="M0 110 Q40 105 80 100 Q120 90 160 82 Q200 70 240 58 Q280 48 320 38 Q360 30 400 22 L400 140 L0 140 Z"
                                    fill="url(#vo2Grad)"
                                />
                                {/* Data points */}
                                <circle cx="0" cy="110" r="3" fill="#22c55e" />
                                <circle cx="80" cy="100" r="3" fill="#22c55e" />
                                <circle cx="160" cy="82" r="3" fill="#22c55e" />
                                <circle cx="240" cy="58" r="3" fill="#22c55e" />
                                <circle cx="320" cy="38" r="3" fill="#22c55e" />
                                <circle cx="400" cy="22" r="4" fill="#22c55e" stroke="rgba(34,197,94,0.3)" strokeWidth="6" />
                            </svg>
                            {/* Y-axis labels */}
                            <div className="absolute left-2 top-3 text-[10px] text-zinc-600">56</div>
                            <div className="absolute left-2 bottom-3 text-[10px] text-zinc-600">48</div>
                        </div>

                        {/* Coaching Tip */}
                        <div className="flex items-start gap-3 p-3 rounded-xl bg-amber-500/5 border border-amber-500/10">
                            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0 mt-0.5">
                                <TrendingUp size={16} className="text-amber-400" />
                            </div>
                            <p className="text-sm text-zinc-400 italic leading-relaxed">
                                &quot;Your cadence dropped slightly. Pick it up to 175 spm
                                to maintain efficiency.&quot;
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Right Content */}
                <motion.div variants={fadeInUp} className="space-y-6 order-1 lg:order-2">
                    <p className="text-sm font-medium text-indigo-400 uppercase tracking-wider">
                        Growth Tracking
                    </p>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
                        Quantify Your{" "}
                        <GradientText>Endurance Growth</GradientText>
                    </h2>
                    <p className="text-zinc-500 text-lg max-w-lg leading-relaxed">
                        Watch your VO2 Max climb as our AI strategically increases your
                        training load. We balance intensity and volume to ensure a
                        consistent upward trajectory.
                    </p>

                    {/* Stats */}
                    <div className="flex gap-6 pt-4">
                        <div className="px-5 py-4 rounded-2xl border border-white/5 bg-white/[0.02]">
                            <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">
                                Starting VO2 Max
                            </p>
                            <p className="text-2xl font-bold text-white">48</p>
                            <p className="text-xs text-zinc-500">ml/kg/min</p>
                        </div>
                        <div className="px-5 py-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/5">
                            <p className="text-xs text-emerald-400 uppercase tracking-wider mb-1">
                                Projected Peak
                            </p>
                            <p className="text-2xl font-bold text-emerald-400">56</p>
                            <p className="text-xs text-zinc-500">ml/kg/min</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </SectionWrapper>
    );
}
