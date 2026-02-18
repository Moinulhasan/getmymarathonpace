"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Gauge, Timer, Flag, BarChart3, ArrowRight } from "lucide-react";
import SectionWrapper from "@/components/ui/SectionWrapper";
import GradientText from "@/components/ui/GradientText";
import { fadeInUp } from "@/lib/animations";

/* ── Pace Converter ── */
function PaceConverter() {
    const [speed, setSpeed] = useState("14.1");
    const paceMin = speed && parseFloat(speed) > 0
        ? Math.floor(60 / parseFloat(speed))
        : 0;
    const paceSec = speed && parseFloat(speed) > 0
        ? Math.round(((60 / parseFloat(speed)) % 1) * 60)
        : 0;

    return (
        <div className="space-y-4">
            <label className="block text-xs text-zinc-500 uppercase tracking-wider">
                Speed (km/h)
            </label>
            <input
                type="number"
                step="0.1"
                min="1"
                value={speed}
                onChange={(e) => setSpeed(e.target.value)}
                className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-white text-lg font-bold focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 transition-all"
                placeholder="e.g. 14.1"
            />
            <div className="pt-2">
                <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">
                    Pace
                </p>
                <p className="text-2xl font-bold text-white tracking-tight">
                    {paceMin}:{paceSec.toString().padStart(2, "0")} /km
                </p>
            </div>
        </div>
    );
}

/* ── Race Predictor ── */
function RacePredictor() {
    const [fiveKTime, setFiveKTime] = useState("22:10");

    const parseTime = (t: string) => {
        const parts = t.split(":").map(Number);
        if (parts.length === 2) return parts[0] * 60 + parts[1];
        return 0;
    };

    const predict = (baseSec: number, baseDist: number, targetDist: number) => {
        if (baseSec <= 0) return "--:--";
        const predicted = baseSec * Math.pow(targetDist / baseDist, 1.06);
        const h = Math.floor(predicted / 3600);
        const m = Math.floor((predicted % 3600) / 60);
        const s = Math.round(predicted % 60);
        if (h > 0)
            return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
        return `${m}:${s.toString().padStart(2, "0")}`;
    };

    const baseSec = parseTime(fiveKTime);

    return (
        <div className="space-y-4">
            <label className="block text-xs text-zinc-500 uppercase tracking-wider">
                Your 5K Time (mm:ss)
            </label>
            <input
                type="text"
                value={fiveKTime}
                onChange={(e) => setFiveKTime(e.target.value)}
                className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-white text-lg font-bold focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 transition-all"
                placeholder="e.g. 22:10"
            />
            <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                    <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">10K</p>
                    <p className="text-lg font-bold text-white">{predict(baseSec, 5, 10)}</p>
                </div>
                <div>
                    <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Half</p>
                    <p className="text-lg font-bold text-white">{predict(baseSec, 5, 21.0975)}</p>
                </div>
            </div>
        </div>
    );
}

/* ── Marathon Finish ── */
function MarathonFinish() {
    const [halfTime, setHalfTime] = useState("1:45:00");

    const parseTime = (t: string) => {
        const parts = t.split(":").map(Number);
        if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
        if (parts.length === 2) return parts[0] * 60 + parts[1];
        return 0;
    };

    const baseSec = parseTime(halfTime);
    const marathonSec = baseSec > 0 ? baseSec * Math.pow(42.195 / 21.0975, 1.06) : 0;
    const h = Math.floor(marathonSec / 3600);
    const m = Math.floor((marathonSec % 3600) / 60);
    const s = Math.round(marathonSec % 60);
    const result =
        marathonSec > 0
            ? `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`
            : "--:--:--";

    return (
        <div className="space-y-4">
            <label className="block text-xs text-zinc-500 uppercase tracking-wider">
                Half Marathon Time (h:mm:ss)
            </label>
            <input
                type="text"
                value={halfTime}
                onChange={(e) => setHalfTime(e.target.value)}
                className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-white text-lg font-bold focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 transition-all"
                placeholder="e.g. 1:45:00"
            />
            <div className="pt-2">
                <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">
                    Estimated Finish
                </p>
                <p className="text-2xl font-bold text-white tracking-tight">
                    {result}
                </p>
            </div>
        </div>
    );
}

/* ── Pace Band Generator ── */
function PaceBand() {
    const [targetTime, setTargetTime] = useState("3:30:00");

    const parseTime = (t: string) => {
        const parts = t.split(":").map(Number);
        if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
        if (parts.length === 2) return parts[0] * 60 + parts[1];
        return 0;
    };

    const totalSec = parseTime(targetTime);
    const pacePerKm = totalSec > 0 ? totalSec / 42.195 : 0;
    const pm = Math.floor(pacePerKm / 60);
    const ps = Math.round(pacePerKm % 60);
    const paceStr = pacePerKm > 0 ? `${pm}:${ps.toString().padStart(2, "0")}` : "--:--";

    const splits = [5, 10, 21.1, 30, 42.2];

    return (
        <div className="space-y-4">
            <label className="block text-xs text-zinc-500 uppercase tracking-wider">
                Target Time (h:mm:ss)
            </label>
            <input
                type="text"
                value={targetTime}
                onChange={(e) => setTargetTime(e.target.value)}
                className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-white text-lg font-bold focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 transition-all"
                placeholder="e.g. 3:30:00"
            />
            <div className="pt-2">
                <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">
                    Even Pace
                </p>
                <p className="text-xl font-bold text-white mb-3">{paceStr} /km</p>
                {pacePerKm > 0 && (
                    <div className="space-y-1.5">
                        {splits.map((km) => {
                            const sec = pacePerKm * km;
                            const sh = Math.floor(sec / 3600);
                            const sm = Math.floor((sec % 3600) / 60);
                            const ss = Math.round(sec % 60);
                            return (
                                <div key={km} className="flex justify-between text-xs">
                                    <span className="text-zinc-500">{km}km</span>
                                    <span className="text-zinc-300 font-medium">
                                        {sh > 0 ? `${sh}:` : ""}{sm.toString().padStart(2, "0")}:{ss.toString().padStart(2, "0")}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

/* ── Tool Card Config ── */
const tools = [
    {
        icon: Gauge,
        title: "Pace Converter",
        color: "from-cyan-500/20 to-cyan-500/5",
        iconColor: "text-cyan-400",
        borderHover: "hover:border-cyan-500/30",
        Component: PaceConverter,
    },
    {
        icon: Timer,
        title: "Race Predictor",
        color: "from-indigo-500/20 to-indigo-500/5",
        iconColor: "text-indigo-400",
        borderHover: "hover:border-indigo-500/30",
        Component: RacePredictor,
    },
    {
        icon: Flag,
        title: "Marathon Finish",
        color: "from-purple-500/20 to-purple-500/5",
        iconColor: "text-purple-400",
        borderHover: "hover:border-purple-500/30",
        Component: MarathonFinish,
    },
    {
        icon: BarChart3,
        title: "Pace Band",
        color: "from-emerald-500/20 to-emerald-500/5",
        iconColor: "text-emerald-400",
        borderHover: "hover:border-emerald-500/30",
        Component: PaceBand,
    },
];

export default function InstantToolsSection() {
    return (
        <SectionWrapper id="instant-tools">
            <motion.div variants={fadeInUp} className="text-center mb-16">
                <p className="text-sm font-medium text-indigo-400 uppercase tracking-wider mb-3">
                    Free Tools
                </p>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
                    Instant Performance{" "}
                    <GradientText>Tools</GradientText>
                </h2>
                <p className="mt-4 text-zinc-500 text-lg max-w-2xl mx-auto">
                    Immediate calculations to optimize your next session. No account
                    required.
                </p>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {tools.map((tool) => (
                    <motion.div
                        key={tool.title}
                        variants={fadeInUp}
                        className={`group relative p-6 rounded-2xl border border-white/5 bg-white/[0.02] transition-all duration-500 ${tool.borderHover}`}
                    >
                        <div
                            className={`absolute inset-0 rounded-2xl bg-gradient-to-b ${tool.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}
                        />
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-5">
                                <div
                                    className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center ${tool.iconColor} group-hover:scale-110 transition-transform duration-300`}
                                >
                                    <tool.icon size={20} />
                                </div>
                                <h3 className="text-base font-semibold text-white">
                                    {tool.title}
                                </h3>
                            </div>
                            <tool.Component />
                        </div>
                    </motion.div>
                ))}
            </div>
        </SectionWrapper>
    );
}
