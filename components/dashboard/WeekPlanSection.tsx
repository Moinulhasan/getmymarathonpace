"use client";

import { useRef } from "react";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";

const weekDays = [
    { day: "MON", title: "Rest Day", subtitle: "", isToday: false },
    { day: "TUE (TODAY)", title: "12km Tempo", subtitle: "Pace: 3:55/km", isToday: true },
    { day: "WED", title: "8km Easy", subtitle: "Recovery Run", isToday: false },
    { day: "THU", title: "6×800m Intervals", subtitle: "Track Session", isToday: false },
    { day: "FRI", title: "Rest Day", subtitle: "", isToday: false },
    { day: "SAT", title: "32km Long Run", subtitle: "Endurance", isToday: false },
    { day: "SUN", title: "10km Recovery", subtitle: "Active Rec.", isToday: false },
];

export default function WeekPlanSection() {
    const scrollRef = useRef<HTMLDivElement>(null);

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
                    <h3 className="text-lg font-bold text-white">Current Week Plan</h3>
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
                {weekDays.map((item) => (
                    <div
                        key={item.day}
                        className={`flex-shrink-0 w-[140px] sm:w-auto sm:flex-1 rounded-xl p-4 border transition-all ${item.isToday
                                ? "bg-[#7f13ec]/10 border-[#7f13ec]/40"
                                : "bg-white/[0.03] border-white/[0.06]"
                            }`}
                    >
                        <p
                            className={`text-[10px] font-semibold uppercase tracking-wider mb-2 ${item.isToday ? "text-[#a855f7]" : "text-zinc-500"
                                }`}
                        >
                            {item.day}
                        </p>
                        <p className="text-sm font-bold text-white leading-snug">
                            {item.title}
                        </p>
                        {item.subtitle && (
                            <p className="text-xs text-zinc-500 mt-1">{item.subtitle}</p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
