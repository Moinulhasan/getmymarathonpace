"use client";

import { Zap, ChevronLeft, ChevronRight, Calendar, Lock, CheckCircle2, Info, Play, ArrowRight, RefreshCw, SlidersHorizontal, PauseCircle, Heart, TrendingUp, MapPin, Activity, LayoutGrid, List } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import GeneratePlanModal from "@/components/dashboard/plans/GeneratePlanModal";
import { apiGetCurrentTrainingPlan } from "@/lib/api";

// ─── Helpers ────────────────────────────────────────────────
const formatDayDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const getPlanStartDate = (plan: any) => {
    if (!plan?.created_at) return new Date();
    const created = new Date(plan.created_at);
    // Find the Monday of that week
    const day = created.getDay();
    const diff = created.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(created.setDate(diff));
    monday.setHours(0, 0, 0, 0);
    return monday;
};

// ─── Stats Row ───────────────────────────────────────────────
function StatsRow({ plan }: { plan: any }) {
    const statsData = useMemo(() => {
        if (!plan?.plan_data) return [
            { label: "Weekly Mileage", value: "0.0", unit: "KM", change: "...", color: "text-zinc-500", border: "border-zinc-800" },
            { label: "Total Sessions", value: "0", unit: "RUNS", change: "...", color: "text-zinc-500", border: "border-zinc-800" },
            { label: "Active Weeks", value: "0", unit: "WKS", change: "...", color: "text-zinc-500", border: "border-zinc-800" },
        ];

        const totalKm = plan.plan_data.reduce((acc: number, day: any) => {
            if (day.workout_type !== 'rest' && day.detail) {
                const match = day.detail.match(/([\d.]+)/);
                return acc + (match ? parseFloat(match[1]) : 0);
            }
            return acc;
        }, 0);

        const sessionCount = plan.plan_data.filter((d: any) => d.workout_type !== 'rest').length;
        const weekCount = Math.ceil(plan.plan_data.length / 7);

        return [
            { label: "Total Mileage", value: totalKm.toFixed(1), unit: "KM", change: "Dynamic", color: "text-[#a855f7]", border: "border-[#7f13ec]/40" },
            { label: "Total Sessions", value: sessionCount.toString(), unit: "SESSIONS", change: "Adaptive", color: "text-cyan-400", border: "border-cyan-500/40" },
            { label: "Plan Duration", value: weekCount.toString(), unit: "WEEKS", change: "Calculated", color: "text-orange-400", border: "border-orange-500/40" },
        ];
    }, [plan]);

    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {statsData.map((s) => (
                <div key={s.label} className={`glass-card p-4 border-t-2 ${s.border}`}>
                    <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                            {s.label}
                        </span>
                        <span className={`text-[10px] font-bold ${s.color} uppercase`}>{s.change}</span>
                    </div>
                    <p className="text-2xl font-bold text-white">
                        {s.value} <span className="text-sm font-normal text-zinc-500">{s.unit}</span>
                    </p>
                </div>
            ))}
        </div>
    );
}

// ─── AI Insights ───────────────────────────────────────────
function AIInsightsCard({ insight }: { insight?: string }) {
    return (
        <div className="glass-card p-5">
            <div className="flex items-center gap-2 mb-4">
                <Activity size={16} className="text-[#a855f7]" />
                <h3 className="text-base font-bold text-white uppercase tracking-tight">AI Coach</h3>
            </div>

            <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-[#7f13ec]/5 border border-[#7f13ec]/20">
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#a855f7] mb-2">
                        Weekly Strategy
                    </p>
                    <p className="text-xs text-zinc-400 leading-relaxed italic">
                        &quot;{insight || "Analyze your training patterns and generate a plan to see personalized coaching insights here."}&quot;
                    </p>
                </div>
            </div>
        </div>
    );
}

// ─── Main Page ─────────────────────────────────────────────
export default function TrainingPlansPage() {
    const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
    const [currentPlan, setCurrentPlan] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [currentWeek, setCurrentWeek] = useState(0);
    const [viewType, setViewType] = useState<'week' | 'calendar'>('week');

    const fetchPlan = async () => {
        setIsLoading(true);
        try {
            const result = await apiGetCurrentTrainingPlan();
            if (result.plan) {
                setCurrentPlan(result.plan);
            }
        } catch (error) {
            console.error("Failed to fetch plan:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPlan();
    }, []);

    const planStartDate = useMemo(() => getPlanStartDate(currentPlan), [currentPlan]);
    const totalWeeks = currentPlan?.plan_data ? Math.ceil(currentPlan.plan_data.length / 7) : 0;

    const workoutsWithDates = useMemo(() => {
        if (!currentPlan?.plan_data) return [];
        return currentPlan.plan_data.map((w: any, idx: number) => {
            const date = new Date(planStartDate);
            date.setDate(planStartDate.getDate() + idx);
            return { ...w, date };
        });
    }, [currentPlan, planStartDate]);

    const weeklyWorkouts = useMemo(() => {
        return workoutsWithDates.slice(currentWeek * 7, (currentWeek + 1) * 7);
    }, [workoutsWithDates, currentWeek]);

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
                        {currentPlan ? `${currentPlan.name} • week ${currentWeek + 1}` : "No active plan • Generate one below"}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex bg-white/5 border border-white/10 rounded-xl p-1">
                        <button
                            onClick={() => setViewType('week')}
                            className={`p-1.5 rounded-lg transition-all ${viewType === 'week' ? 'bg-[#7f13ec] text-white shadow-lg shadow-[#7f13ec]/20' : 'text-zinc-500 hover:text-white'}`}
                        >
                            <List size={18} />
                        </button>
                        <button
                            onClick={() => setViewType('calendar')}
                            className={`p-1.5 rounded-lg transition-all ${viewType === 'calendar' ? 'bg-[#7f13ec] text-white shadow-lg shadow-[#7f13ec]/20' : 'text-zinc-500 hover:text-white'}`}
                        >
                            <LayoutGrid size={18} />
                        </button>
                    </div>
                    <button
                        onClick={() => setIsGenerateModalOpen(true)}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#7f13ec] to-[#a855f7] text-white text-sm font-semibold shadow-lg shadow-[#7f13ec]/25 hover:shadow-[#7f13ec]/40 transition-shadow cursor-pointer flex-shrink-0"
                    >
                        <Zap size={16} className="fill-white" />
                        New Plan
                    </button>
                </div>
            </div>

            {/* Main Layout */}
            <div className="flex flex-col xl:flex-row gap-5">
                {/* Left: Main Content */}
                <div className="flex-1 min-w-0 space-y-5">
                    <StatsRow plan={currentPlan} />

                    {viewType === 'week' ? (
                        <>
                            {/* Focused Week View */}
                            <div className="glass-card p-4 sm:p-5">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                                    <div className="flex items-center gap-3">
                                        <div>
                                            <h3 className="text-base font-bold text-white uppercase tracking-tight">Week {currentWeek + 1} focus</h3>
                                            <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">{formatDayDate(weeklyWorkouts[0]?.date || new Date())} - {formatDayDate(weeklyWorkouts[6]?.date || new Date())}</p>
                                        </div>
                                        <div className="flex gap-1 ml-4">
                                            <button
                                                disabled={currentWeek === 0}
                                                onClick={() => setCurrentWeek(prev => prev - 1)}
                                                className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                                            >
                                                <ChevronLeft size={16} />
                                            </button>
                                            <button
                                                disabled={currentWeek >= totalWeeks - 1}
                                                onClick={() => setCurrentWeek(prev => prev + 1)}
                                                className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                                            >
                                                <ChevronRight size={16} />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 flex-wrap">
                                        {[
                                            { label: "Rest", color: "bg-zinc-600" },
                                            { label: "Long Run", color: "bg-[#7f13ec]" },
                                            { label: "Workout", color: "bg-white/20" }
                                        ].map((l) => (
                                            <div key={l.label} className="flex items-center gap-1.5">
                                                <div className={`w-1.5 h-1.5 rounded-full ${l.color}`} />
                                                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">{l.label}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-7 gap-1.5">
                                    {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map((h) => (
                                        <div key={h} className="text-center text-[10px] font-black uppercase tracking-widest text-zinc-600 py-2">
                                            {h}
                                        </div>
                                    ))}
                                    {weeklyWorkouts.length > 0 ? weeklyWorkouts.map((d: any, idx: number) => (
                                        <div
                                            key={idx}
                                            className={`rounded-2xl px-2 py-4 text-center border transition-all hover:scale-[1.02] cursor-default flex flex-col items-center justify-center min-h-[100px] relative ${d.workout_type === 'long'
                                                ? "bg-[#7f13ec]/20 border-[#7f13ec]/40 shadow-lg shadow-[#7f13ec]/10"
                                                : d.workout_type === 'rest'
                                                    ? "bg-black/40 border-white/[0.03] opacity-40"
                                                    : "bg-white/[0.03] border-white/[0.08]"
                                                }`}
                                        >
                                            <span className="absolute top-2 left-2 text-[8px] font-black text-zinc-500">{d.date.getDate()}</span>
                                            <p className={`text-[10px] font-black uppercase leading-tight mb-1 ${d.workout_type === 'long' ? 'text-white' : 'text-zinc-300'}`}>
                                                {d.label}
                                            </p>
                                            {d.detail && (
                                                <p className="text-[10px] font-bold text-zinc-500">{d.detail}</p>
                                            )}
                                        </div>
                                    )) : (
                                        Array(7).fill(0).map((_, i) => (
                                            <div key={i} className="aspect-square rounded-2xl bg-white/[0.02] border border-dashed border-white/[0.05] flex items-center justify-center">
                                                <Lock size={12} className="text-zinc-800" />
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>

                            {/* Weekly Detail */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-black text-white italic uppercase tracking-tighter">Sessions Focus</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {weeklyWorkouts.filter((w: any) => w.workout_type !== 'rest').slice(0, 4).map((s: any, idx: number) => (
                                        <div key={idx} className="glass-card p-5 border-l-4 border-l-[#7f13ec]">
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="w-12 h-12 rounded-2xl bg-[#7f13ec] flex flex-col items-center justify-center text-white">
                                                    <span className="text-[8px] font-black uppercase tracking-tighter opacity-70 leading-none">DAY</span>
                                                    <span className="text-xl font-black leading-none">{s.day_number}</span>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-[9px] font-black text-zinc-500 uppercase tracking-widest leading-none mb-1">{formatDayDate(s.date)}</div>
                                                    <div className="text-xs font-black text-[#a855f7] uppercase">{s.workout_type}</div>
                                                </div>
                                            </div>
                                            <h4 className="text-xs font-black text-white uppercase mb-1">{s.label}</h4>
                                            <p className="text-[11px] text-zinc-500 font-medium leading-relaxed line-clamp-2">{s.description || "Focus on consistency and proper form."}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    ) : (
                        /* Full Calendar View */
                        <div className="glass-card p-4 sm:p-5">
                            <h3 className="text-base font-bold text-white uppercase tracking-tight mb-6 flex items-center gap-2">
                                <Calendar size={18} className="text-[#a855f7]" />
                                Full Journey Calendar
                            </h3>
                            <div className="grid grid-cols-7 gap-1">
                                {["M", "T", "W", "T", "F", "S", "S"].map((h, i) => (
                                    <div key={i} className="text-center text-[10px] font-black text-zinc-600 py-2 border-b border-white/[0.03] mb-1">
                                        {h}
                                    </div>
                                ))}
                                {workoutsWithDates.map((d: any, idx: number) => (
                                    <div
                                        key={idx}
                                        className={`min-h-[60px] p-1.5 border relative rounded-lg group hover:scale-[1.05] transition-all cursor-help ${d.workout_type === 'long'
                                            ? "bg-[#7f13ec]/10 border-[#7f13ec]/20"
                                            : d.workout_type === 'rest'
                                                ? "bg-black/20 border-white/[0.02] opacity-30"
                                                : "bg-white/[0.02] border-white/[0.05]"
                                            }`}
                                        title={d.description || `${d.label}: ${d.detail}`}
                                    >
                                        <span className="text-[8px] font-black text-zinc-600">{d.date.getDate()}</span>
                                        <div className="mt-1">
                                            <div className={`w-full h-1 rounded-full ${d.workout_type === 'long' ? 'bg-[#7f13ec]' : d.workout_type === 'rest' ? 'bg-zinc-800' : 'bg-white/20'}`} />
                                            <p className="text-[7px] font-black text-white uppercase truncate mt-1">{d.label.split(' ')[0]}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Footer Progress */}
                    <div className="glass-card p-5 border-l-2 border-l-green-500 flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-green-400 mb-1">Active Journey</p>
                            <p className="text-sm font-black text-white uppercase">{currentPlan?.name || "No Active Plan"}</p>
                            <p className="text-[10px] text-zinc-500 font-bold mt-1 uppercase tracking-wider italic">
                                {totalWeeks > 0 ? `Week ${currentWeek + 1} of ${totalWeeks} • ${Math.round(((currentWeek + 1) / totalWeeks) * 100)}% through the block` : "Initialize biometrics to begin"}
                            </p>
                        </div>
                        <div className="hidden sm:block">
                            <div className="w-32 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-[#7f13ec] to-[#a855f7]" style={{ width: totalWeeks > 0 ? `${((currentWeek + 1) / totalWeeks) * 100}%` : '0%' }} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Sidebar */}
                <div className="w-full xl:w-80 flex-shrink-0 space-y-5">
                    <AIInsightsCard insight={currentPlan?.coach_insight} />

                    <div className="glass-card p-5">
                        <h3 className="text-sm font-black text-white uppercase tracking-wider mb-4">Route Intelligence</h3>
                        <div className="aspect-video rounded-2xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center relative group">
                            <MapPin size={24} className="text-zinc-700 group-hover:text-[#a855f7] transition-colors" />
                            <p className="absolute bottom-3 text-[8px] font-bold text-zinc-600 uppercase tracking-widest">Targeting: {currentPlan?.race_type || 'Road'}</p>
                        </div>
                    </div>

                    <div className="glass-card p-5">
                        <h3 className="text-xs font-black text-white uppercase tracking-wider mb-4 leading-none">Vertical Profile</h3>
                        <div className="flex items-end gap-1 h-16">
                            {[20, 35, 50, 45, 60, 80, 75, 55, 70, 90, 85, 65, 50, 40].map((h, i) => (
                                <div key={i} className="flex-1 rounded-t bg-[#7f13ec]/20 group-hover:bg-[#a855f7] transition-all" style={{ height: `${h}%` }} />
                            ))}
                        </div>
                    </div>

                    <div className="glass-card p-5">
                        <h3 className="text-sm font-black text-white uppercase mb-4 tracking-tight">Plan Tuner</h3>
                        <div className="space-y-1.5">
                            {[
                                { icon: RefreshCw, label: "Reschedule Week", color: "text-zinc-500" },
                                { icon: SlidersHorizontal, label: "Adjust Paces", color: "text-zinc-500" },
                                { icon: PauseCircle, label: "Pause Plan", color: "text-red-500/80" },
                            ].map((c) => (
                                <button key={c.label} className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.05] transition-all group">
                                    <div className="flex items-center gap-3">
                                        <c.icon size={14} className={c.color} />
                                        <span className="text-[10px] font-black uppercase text-white group-hover:text-[#a855f7] transition-colors">{c.label}</span>
                                    </div>
                                    <ChevronRight size={12} className="text-zinc-700" />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <GeneratePlanModal
                isOpen={isGenerateModalOpen}
                onClose={() => setIsGenerateModalOpen(false)}
                onSuccess={fetchPlan}
            />
        </div>
    );
}
