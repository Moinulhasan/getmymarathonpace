"use client";

import { useRef, useMemo } from "react";
import { Calendar, ChevronLeft, ChevronRight, Lock } from "lucide-react";

interface WeekPlanSectionProps {
    plan?: any;
}

export default function WeekPlanSection({ plan }: WeekPlanSectionProps) {
    const scrollRef = useRef<HTMLDivElement>(null);

    const weeklyWorkouts = useMemo(() => {
        if (!plan?.plan_data || !plan?.created_at) return [];

        // Find current day number relative to plan start
        const created = new Date(plan.created_at);
        const dayOfWeek = created.getDay();
        const diff = created.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
        const monday = new Date(created.setDate(diff));
        monday.setHours(0, 0, 0, 0);

        const now = new Date();
        const diffTime = Math.abs(now.getTime() - monday.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const currentWeekIndex = Math.floor((diffDays - 1) / 7);

        return plan.plan_data.slice(currentWeekIndex * 7, (currentWeekIndex + 1) * 7).map((w: any, idx: number) => {
            const date = new Date(monday);
            date.setDate(monday.getDate() + (currentWeekIndex * 7) + idx);
            const isToday = date.toDateString() === now.toDateString();

            const dayLabels = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
            return {
                ...w,
                dayLabel: isToday ? `${dayLabels[idx]} (TODAY)` : dayLabels[idx],
                isToday
            };
        });
    }, [plan]);

    const scroll = (direction: "left" | "right") => {
        if (scrollRef.current) {
            const amount = 200;
            scrollRef.current.scrollBy({
                left: direction === "left" ? -amount : amount,
                behavior: "smooth",
            });
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                    <Calendar size={18} className="text-[#a855f7]" />
                    <h3 className="text-lg font-bold text-white uppercase tracking-tight">Active Week Plan</h3>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => scroll("left")}
                        className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
                    >
                        <ChevronLeft size={16} />
                    </button>
                    <button
                        onClick={() => scroll("right")}
                        className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>

            <div
                ref={scrollRef}
                className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
                {weeklyWorkouts.length > 0 ? weeklyWorkouts.map((item: any, idx: number) => (
                    <div
                        key={idx}
                        className={`flex-shrink-0 w-[160px] sm:w-auto sm:flex-1 rounded-xl p-4 border transition-all hover:scale-[1.02] cursor-default ${item.isToday
                            ? "bg-[#7f13ec]/10 border-[#7f13ec]/40 shadow-lg shadow-[#7f13ec]/5"
                            : "bg-white/[0.03] border-white/[0.06]"
                            }`}
                    >
                        <p
                            className={`text-[9px] font-black uppercase tracking-widest mb-2 ${item.isToday ? "text-[#a855f7]" : "text-zinc-500"
                                }`}
                        >
                            {item.dayLabel}
                        </p>
                        <p className="text-sm font-black text-white leading-tight uppercase tracking-tight">
                            {item.label}
                        </p>
                        {item.detail && (
                            <p className="text-[10px] font-bold text-zinc-500 mt-1 uppercase tracking-wide">{item.detail}</p>
                        )}
                    </div>
                )) : (
                    Array(7).fill(0).map((_, i) => (
                        <div key={i} className="flex-1 min-h-[80px] rounded-xl border border-dashed border-white/5 bg-white/[0.01] flex items-center justify-center">
                            <Lock size={14} className="text-zinc-800" />
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
