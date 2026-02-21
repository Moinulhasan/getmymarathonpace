"use client";

import {
    Activity,
    MapPin,
    Calendar,
    ChevronRight,
    Sparkles,
    AlertCircle,
    ExternalLink,
    Bike,
    Waves,
    Mountain,
    Footprints,
} from "lucide-react";

// Helper to get the correct icon based on activity type
const getActivityIcon = (type: string) => {
    const activityType = type.toLowerCase();
    if (activityType.includes('run')) return <Activity size={24} className="text-[#a855f7]" />;
    if (activityType.includes('ride') || activityType.includes('bike') || activityType.includes('cycling')) return <Bike size={24} className="text-[#a855f7]" />;
    if (activityType.includes('swim')) return <Waves size={24} className="text-[#a855f7]" />;
    if (activityType.includes('hike') || activityType.includes('walk')) return <Footprints size={24} className="text-[#a855f7]" />;
    if (activityType.includes('mountain') || activityType.includes('alpine')) return <Mountain size={24} className="text-[#a855f7]" />;
    return <Activity size={24} className="text-[#a855f7]" />;
};

export interface ActivityData {
    id: string | number;
    name: string;
    type: string;
    start_date: string;
    city: string | null;
    distance_km: number;
    target_distance_km: number | null;
    average_pace: string;
    target_pace: string | null;
    moving_time_formatted: string;
    target_time: string | null;
    elevation_gain: number | null;
    target_elevation: string | null;
    average_heartrate: number | null;
    target_hr: string | null;
    badge: string | null; // "PERFECT MATCH" | "OVERREACHING" | null
    ai_note: string | null;
    ai_note_type: "analysis" | "coach" | null;
}

interface RecentActivitiesProps {
    activities: ActivityData[];
}

export default function RecentActivities({ activities }: RecentActivitiesProps) {
    const formatDate = (dateStr: string) => {
        const d = new Date(dateStr);
        const now = new Date();
        const diff = Math.floor((now.getTime() - d.getTime()) / 86400000);
        const time = d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });

        if (diff === 0) return `Today, ${time}`;
        if (diff === 1) return `Yesterday, ${time}`;
        return `${d.toLocaleDateString("en-US", { weekday: "long" })}, ${time}`;
    };

    const badgeColors: Record<string, string> = {
        "PERFECT MATCH": "bg-green-500/20 text-green-400 border-green-500/30",
        "OVERREACHING": "bg-red-500/20 text-red-400 border-red-500/30",
        default: "bg-zinc-700/30 text-zinc-400 border-zinc-600/30",
    };

    if (!activities.length) {
        return (
            <div className="bg-[#1a1228]/80 border border-white/[0.06] rounded-2xl p-8 text-center">
                <Activity size={32} className="text-zinc-600 mx-auto mb-3" />
                <p className="text-zinc-500 text-sm">No recent activities found. Sync with Strava to see your runs here.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {activities.map((activity) => (
                <div
                    key={activity.id}
                    className="bg-[#1a1228]/60 border border-white/[0.04] rounded-[2.5rem] p-6 lg:p-7 flex flex-col lg:flex-row items-center gap-8 relative overflow-hidden backdrop-blur-sm"
                >
                    {/* Left styling accent bar */}
                    <div className={`absolute left-0 top-6 bottom-6 w-[5px] rounded-r-full shadow-[0_0_15px_rgba(0,0,0,0.5)] ${activity.badge === "PERFECT MATCH"
                        ? "bg-[#22c55e] shadow-[#22c55e]/30"
                        : activity.badge === "OVERREACHING"
                            ? "bg-[#ff9800] shadow-[#ff9800]/30"
                            : "bg-zinc-600"
                        }`} />

                    {/* Activity Header Section (Icon + Name + Badge) */}
                    <div className="flex items-center gap-4 min-w-[280px]">
                        <div className="w-14 h-14 rounded-2xl bg-zinc-900/50 border border-white/[0.08] flex items-center justify-center flex-shrink-0">
                            {getActivityIcon(activity.type)}
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <h3 className="text-xl font-bold text-white tracking-tight leading-none">
                                {activity.name}
                            </h3>
                            <div className="text-[12px] font-medium text-zinc-500">
                                {formatDate(activity.start_date)} • {activity.city}
                            </div>
                            {activity.badge && (
                                <div className="mt-1">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${activity.badge === "PERFECT MATCH"
                                        ? "bg-green-500/10 text-[#22c55e] border-green-500/20"
                                        : "bg-orange-500/10 text-orange-400 border-orange-500/20"
                                        }`}>
                                        {activity.badge}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Stats Grid with Vertical Separators */}
                    <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-0 items-center border-l border-white/[0.04] pl-8">
                        {/* Distance */}
                        <div className="flex flex-col gap-1 pr-6">
                            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.15em]">Distance</span>
                            <span className="text-2xl font-bold text-white tracking-tight">{activity.distance_km.toFixed(2)} km</span>
                            <span className="text-[11px] font-medium text-zinc-600">Target: {activity.target_distance_km?.toFixed(1)} km</span>
                        </div>
                        {/* Pace */}
                        <div className="flex flex-col gap-1 px-6 border-l border-white/[0.04]">
                            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.15em]">Avg. Pace</span>
                            <span className="text-2xl font-bold text-white tracking-tight">{activity.average_pace}</span>
                            <span className="text-[11px] font-medium text-zinc-600">Target: {activity.target_pace}</span>
                        </div>
                        {/* Time */}
                        <div className="flex flex-col gap-1 px-6 border-l border-white/[0.04]">
                            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.15em]">Time</span>
                            <span className="text-2xl font-bold text-white tracking-tight">{activity.moving_time_formatted}</span>
                            <span className="text-[11px] font-medium text-zinc-600">Target: {activity.target_time}</span>
                        </div>
                        {/* Elevation */}
                        <div className="flex flex-col gap-1 pl-6 border-l border-white/[0.04]">
                            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.15em]">Elevation</span>
                            <span className="text-2xl font-bold text-white tracking-tight">
                                {activity.average_heartrate ? `${activity.average_heartrate} bpm` : `${activity.elevation_gain} m`}
                            </span>
                            <span className="text-[11px] font-medium text-zinc-600">
                                Target: {activity.average_heartrate ? activity.target_hr : (activity.target_elevation || "Flat")}
                            </span>
                        </div>
                    </div>

                    {/* AI Analysis Card */}
                    {activity.ai_note && (
                        <div className="min-w-[280px] bg-[#1a1228]/80 border border-white/[0.06] rounded-[2rem] p-6 flex flex-col gap-3">
                            <div className="flex items-center gap-2">
                                <Sparkles size={14} className="text-[#a855f7]" />
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#a855f7]">AI ANALYSIS</span>
                            </div>
                            <p className="text-zinc-400 text-[12px] leading-relaxed italic font-medium">
                                "{activity.ai_note}"
                            </p>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
