"use client";

import { Zap, ChevronLeft, ChevronRight, Calendar, Lock, CheckCircle2, Info, Play, ArrowRight, RefreshCw, SlidersHorizontal, PauseCircle, Heart, TrendingUp, MapPin } from "lucide-react";

// ─── Stats Row ───────────────────────────────────────────────
const stats = [
    { label: "Weekly Mileage", value: "85.2", unit: "KM", change: "+12%", color: "text-green-400", border: "border-[#7f13ec]/40" },
    { label: "Vertical Gain", value: "1,240", unit: "M", change: "+5%", color: "text-green-400", border: "border-cyan-500/40" },
    { label: "TSS Score", value: "450", unit: "PTS", change: "-2%", color: "text-red-400", border: "border-orange-500/40" },
];

function StatsRow() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {stats.map((s) => (
                <div key={s.label} className={`glass-card p-4 border-t-2 ${s.border}`}>
                    <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                            {s.label}
                        </span>
                        <span className={`text-xs font-bold ${s.color}`}>{s.change}</span>
                    </div>
                    <p className="text-2xl font-bold text-white">
                        {s.value} <span className="text-sm font-normal text-zinc-500">{s.unit}</span>
                    </p>
                </div>
            ))}
        </div>
    );
}

// ─── Calendar ───────────────────────────────────────────────
type WorkoutType = "long" | "rest" | "interval" | "tempo" | "easy" | "strength" | "hills" | null;
interface CalDay {
    day: number;
    type: WorkoutType;
    label?: string;
    detail?: string;
    color?: string;
}

const calendarDays: CalDay[] = [
    { day: 1, type: "long", label: "LONG RUN", detail: "28.0km", color: "bg-green-600" },
    { day: 2, type: "rest", label: "REST DAY", color: "bg-zinc-600" },
    { day: 3, type: "interval", label: "INTERVALS", detail: "12km Total", color: "bg-orange-500" },
    { day: 4, type: "tempo", label: "TEMPO", detail: "10km Pace", color: "bg-red-500" },
    { day: 5, type: "easy", label: "EASY RUN", detail: "8km • 5:10", color: "bg-[#7f13ec]" },
    { day: 6, type: "strength", label: "STRENGTH", color: "bg-zinc-700" },
    { day: 7, type: "hills", label: "HILLS", detail: "16km @ 5%", color: "bg-teal-600" },
];

const legendItems = [
    { label: "Rest", color: "bg-zinc-500" },
    { label: "Long", color: "bg-green-500" },
    { label: "Interval", color: "bg-orange-500" },
    { label: "Tempo", color: "bg-red-500" },
];

function TrainingCalendar() {
    const headers = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

    return (
        <div className="glass-card p-4 sm:p-5">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                    <h3 className="text-base font-bold text-white">October 2023</h3>
                    <div className="flex gap-1">
                        <button className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer">
                            <ChevronLeft size={14} />
                        </button>
                        <button className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer">
                            <ChevronRight size={14} />
                        </button>
                    </div>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                    {legendItems.map((l) => (
                        <div key={l.label} className="flex items-center gap-1.5">
                            <div className={`w-2 h-2 rounded-full ${l.color}`} />
                            <span className="text-[10px] text-zinc-500">{l.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Days header */}
            <div className="grid grid-cols-7 gap-1 mb-1">
                {headers.map((h) => (
                    <div key={h} className="text-center text-[10px] font-semibold uppercase tracking-wider text-zinc-500 py-2">
                        {h}
                    </div>
                ))}
            </div>

            {/* Day numbers */}
            <div className="grid grid-cols-7 gap-1 mb-1">
                {calendarDays.map((d) => (
                    <div key={d.day} className={`text-center py-1.5 text-xs ${d.day === 5 ? "text-[#a855f7] font-bold" : "text-zinc-400"}`}>
                        {d.day}
                    </div>
                ))}
            </div>

            {/* Workout tags */}
            <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((d) => (
                    <div
                        key={`tag-${d.day}`}
                        className={`rounded-lg px-1.5 py-2 text-center ${d.color || "bg-zinc-800"} ${d.day === 5 ? "ring-2 ring-[#a855f7]/50" : ""}`}
                    >
                        <p className="text-[9px] font-bold text-white uppercase leading-tight truncate">
                            {d.label}
                        </p>
                        {d.detail && (
                            <p className="text-[8px] text-white/70 mt-0.5 truncate">{d.detail}</p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

// ─── Week Detail ────────────────────────────────────────────
interface SessionItem {
    date: string;
    dayNum: string;
    title: string;
    subtitle?: string;
    stats?: { label: string; value: string; unit?: string }[];
    status: "today" | "upcoming" | "completed";
    completion?: string;
}

const sessions: SessionItem[] = [
    {
        date: "OCT", dayNum: "05", title: "Aerobic Recovery + Strides",
        stats: [
            { label: "Distance", value: "8.0", unit: "km" },
            { label: "Target Pace", value: "5:15", unit: "min/km" },
            { label: "Expected TSS", value: "45", unit: "pts" },
            { label: "Fatigue", value: "3/10" },
        ],
        status: "today",
    },
    {
        date: "OCT", dayNum: "06", title: "Rest & Mobility Day",
        subtitle: "Active recovery session focused on hip mobility and glute activation.",
        status: "upcoming",
    },
    {
        date: "OCT", dayNum: "04", title: "VO2 Max Intervals",
        subtitle: "Actual Pace: 3:35/KM   Distance: 14.2KM",
        status: "completed",
        completion: "105%",
    },
];

function WeekDetail() {
    return (
        <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                <h3 className="text-lg font-bold text-white italic">
                    OCT 5 – OCT 11 DETAIL
                </h3>
                <button className="text-sm text-[#a855f7] hover:text-[#c084fc] font-medium transition-colors cursor-pointer flex items-center gap-1">
                    Full Week Breakdown <ArrowRight size={14} />
                </button>
            </div>

            <div className="space-y-3">
                {sessions.map((s) => (
                    <div
                        key={s.dayNum}
                        className={`glass-card p-4 flex flex-col sm:flex-row items-start gap-4 ${s.status === "today" ? "border-[#7f13ec]/30" : ""
                            }`}
                    >
                        {/* Date badge */}
                        <div className={`flex-shrink-0 w-16 h-16 rounded-xl flex flex-col items-center justify-center ${s.status === "today"
                                ? "bg-[#7f13ec] text-white"
                                : s.status === "completed"
                                    ? "bg-[#7f13ec]/20 text-[#a855f7]"
                                    : "bg-white/[0.04] text-zinc-400"
                            }`}>
                            <span className="text-[9px] font-bold uppercase tracking-wider opacity-70">
                                {s.date}
                            </span>
                            <span className="text-xl font-bold leading-none">{s.dayNum}</span>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                {s.status === "today" && (
                                    <span className="text-[9px] font-bold uppercase tracking-wider text-[#a855f7] bg-[#7f13ec]/15 px-2 py-0.5 rounded">
                                        Today&apos;s Focus
                                    </span>
                                )}
                                <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                                    {s.title}
                                    {s.status === "completed" && (
                                        <CheckCircle2 size={14} className="text-green-400" />
                                    )}
                                </h4>
                            </div>

                            {s.stats && (
                                <div className="flex flex-wrap gap-x-5 gap-y-1 mt-2">
                                    {s.stats.map((st) => (
                                        <div key={st.label}>
                                            <span className="text-[10px] uppercase tracking-wider text-zinc-500 block">
                                                {st.label}
                                            </span>
                                            <span className="text-sm font-bold text-white">
                                                {st.value}{" "}
                                                {st.unit && (
                                                    <span className="text-xs font-normal text-zinc-500">
                                                        {st.unit}
                                                    </span>
                                                )}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {s.subtitle && (
                                <p className="text-xs text-zinc-500 mt-1 uppercase tracking-wide">
                                    {s.subtitle}
                                </p>
                            )}
                        </div>

                        {/* Action */}
                        <div className="flex-shrink-0 self-center">
                            {s.status === "today" && (
                                <div className="flex items-center gap-2">
                                    <button className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white cursor-pointer">
                                        <Info size={14} />
                                    </button>
                                    <button className="px-4 py-2 rounded-xl bg-white/[0.06] border border-white/10 text-sm font-semibold text-white hover:bg-white/10 transition-all cursor-pointer flex items-center gap-1.5">
                                        <Play size={12} fill="white" /> Start Session
                                    </button>
                                </div>
                            )}
                            {s.status === "upcoming" && (
                                <Lock size={16} className="text-zinc-600" />
                            )}
                            {s.status === "completed" && s.completion && (
                                <span className="text-sm font-bold text-green-400 bg-green-400/10 px-3 py-1.5 rounded-full">
                                    {s.completion}
                                </span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ─── AI Insights ───────────────────────────────────────────
function AIInsightsCard() {
    return (
        <div className="glass-card p-5">
            <div className="flex items-center gap-2 mb-4">
                <Zap size={16} className="text-[#a855f7]" />
                <h3 className="text-base font-bold text-white">AI Insights</h3>
            </div>

            <div className="space-y-3">
                <div className="p-3 rounded-xl bg-red-500/5 border border-red-500/20">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-red-400 mb-1.5">
                        Fatigue Warning
                    </p>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                        Your heart rate variability (HRV) is 12% lower than usual. RunGen suggests reducing today&apos;s recovery run intensity.
                    </p>
                </div>

                <div className="p-3 rounded-xl bg-orange-500/5 border border-orange-500/20">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-orange-400 mb-1.5">
                        Pace Prediction
                    </p>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                        Based on your last 3 tempos, we expect a 3:42/km threshold pace for your Sunday long run.
                    </p>
                </div>
            </div>
        </div>
    );
}

// ─── Route Analysis ────────────────────────────────────────
function RouteAnalysisCard() {
    return (
        <div className="glass-card p-5">
            <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 bg-white/[0.06] px-2.5 py-1 rounded">
                    Newton Hills
                </span>
            </div>

            <div className="flex flex-col items-center justify-center py-4">
                <MapPin size={24} className="text-[#a855f7] mb-2" />
                <span className="text-xs text-zinc-500 uppercase tracking-wider font-medium">
                    Route Analysis
                </span>
            </div>
        </div>
    );
}

// ─── Elevation Profile ─────────────────────────────────────
function ElevationProfileCard() {
    // Generate bar heights for simulated elevation
    const bars = [30, 45, 55, 40, 65, 80, 70, 55, 75, 90, 85, 60, 50, 70, 65, 45, 35, 50, 60, 55];

    return (
        <div className="glass-card p-5">
            <h3 className="text-sm font-bold text-white mb-4">
                Simulated Elevation Profile
            </h3>
            <div className="flex items-end gap-[3px] h-20">
                {bars.map((h, i) => (
                    <div
                        key={i}
                        className="flex-1 rounded-t bg-gradient-to-t from-[#7f13ec] to-[#a855f7] opacity-80"
                        style={{ height: `${h}%` }}
                    />
                ))}
            </div>
            <p className="text-[10px] uppercase tracking-wider text-zinc-500 text-center mt-3 font-medium">
                28km Long Run Simulation
            </p>
        </div>
    );
}

// ─── Plan Controls ─────────────────────────────────────────
function PlanControlsCard() {
    const controls = [
        { icon: RefreshCw, label: "Reschedule Week", color: "text-zinc-400" },
        { icon: SlidersHorizontal, label: "Adjust Goal Paces", color: "text-zinc-400" },
        { icon: PauseCircle, label: "Pause Plan", color: "text-red-400" },
    ];

    return (
        <div className="glass-card p-5">
            <h3 className="text-base font-bold text-white mb-4">Plan Controls</h3>
            <div className="space-y-1.5">
                {controls.map((c) => {
                    const Icon = c.icon;
                    return (
                        <button
                            key={c.label}
                            className="w-full flex items-center justify-between px-3.5 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] transition-all cursor-pointer group"
                        >
                            <div className="flex items-center gap-3">
                                <Icon size={16} className={c.color} />
                                <span className={`text-sm font-medium ${c.color}`}>
                                    {c.label}
                                </span>
                            </div>
                            <ChevronRight size={14} className="text-zinc-600 group-hover:text-zinc-400 transition-colors" />
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

// ─── Current Goal (bottom left in sidebar) ─────────────────
function CurrentGoalCard() {
    return (
        <div className="glass-card p-4 border-l-2 border-l-green-500">
            <p className="text-[10px] font-bold uppercase tracking-wider text-green-400 mb-1">
                Current Goal
            </p>
            <p className="text-sm font-bold text-white mb-2">Road to Boston 2024</p>
            <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden mb-1.5">
                <div className="h-full bg-gradient-to-r from-[#7f13ec] to-[#a855f7] rounded-full" style={{ width: "65%" }} />
            </div>
            <p className="text-[10px] text-zinc-500">Week 8 of 18 • 65% Complete</p>
        </div>
    );
}

// ─── Main Page ─────────────────────────────────────────────
export default function TrainingPlansPage() {
    return (
        <div className="max-w-7xl mx-auto">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">
                        Training Plans
                    </h1>
                    <p className="text-sm text-zinc-500 flex items-center gap-1.5">
                        <span className="text-orange-400">⊕</span>
                        Road to Boston Marathon • Week 8: Peak Loading Phase
                    </p>
                </div>
                <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#7f13ec] to-[#a855f7] text-white text-sm font-semibold shadow-lg shadow-[#7f13ec]/25 hover:shadow-[#7f13ec]/40 transition-shadow cursor-pointer flex-shrink-0">
                    <Zap size={16} className="fill-white" />
                    Generate New Plan
                </button>
            </div>

            {/* Main Layout: Content + Sidebar */}
            <div className="flex flex-col xl:flex-row gap-5">
                {/* Left: Main Content */}
                <div className="flex-1 min-w-0 space-y-5">
                    <StatsRow />
                    <TrainingCalendar />
                    <WeekDetail />
                    <CurrentGoalCard />
                </div>

                {/* Right: Sidebar */}
                <div className="w-full xl:w-72 flex-shrink-0 space-y-4">
                    <AIInsightsCard />
                    <RouteAnalysisCard />
                    <ElevationProfileCard />
                    <PlanControlsCard />
                </div>
            </div>
        </div>
    );
}
