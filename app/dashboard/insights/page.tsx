"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, Bell, ChevronRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { apiStravaSync, apiGetProfile, apiStravaAnalysis } from "@/lib/api";
import type { AnalysisData } from "@/lib/api";
import StravaSyncStatus from "@/components/dashboard/analysis/StravaSyncStatus";
import TrainingAlignment from "@/components/dashboard/analysis/TrainingAlignment";
import WeeklyStatsCards from "@/components/dashboard/analysis/WeeklyStatsCards";
import WeeklyVolumeChart from "@/components/dashboard/analysis/WeeklyVolumeChart";
import RecentActivities from "@/components/dashboard/analysis/RecentActivities";
import ConnectStravaButton from "@/components/dashboard/analysis/ConnectStravaButton";

// ─── Default / demo data ─────────────────────────────────
const DEFAULT_DATA: AnalysisData = {
    strava_connected: false,
    last_sync_at: null,
    weekly_distance: 42.5,
    distance_change: 5.2,
    avg_heart_rate: 142,
    hr_label: "Optimal Range",
    consistency_days: 14,
    streak_change: 1,
    alignment_score: 92,
    alignment_weekly_change: 2.1,
    alignment_description:
        "Elite status maintained. Your pacing consistency is in the top 5% of your age group.",
    volume_data: [
        { day: "M", planned: 8, actual: 10 },
        { day: "T", planned: 6, actual: 5 },
        { day: "W", planned: 10, actual: 9 },
        { day: "T", planned: 5, actual: 6 },
        { day: "F", planned: 8, actual: 7 },
        { day: "S", planned: 12, actual: 0 },
        { day: "S", planned: 6, actual: 0 },
    ],
    recent_activities: [
        {
            id: 1,
            name: "Tuesday Tempo Intervals",
            type: "Run",
            start_date: new Date(Date.now() - 86400000).toISOString(),
            city: "London, UK",
            distance_km: 10.24,
            target_distance_km: 10.0,
            average_pace: "4:55 /km",
            target_pace: "5:00 /km",
            moving_time_formatted: "50:24",
            target_time: "50:00",
            elevation_gain: 124,
            target_elevation: "Flat",
            average_heartrate: null,
            target_hr: null,
            badge: "PERFECT MATCH",
            ai_note:
                "Excellent pacing control. Recovery duration was slightly short, but overall execution was elite.",
            ai_note_type: "analysis",
        },
        {
            id: 2,
            name: "Easy Recovery Loop",
            type: "Run",
            start_date: new Date(Date.now() - 172800000).toISOString(),
            city: "London, UK",
            distance_km: 5.5,
            target_distance_km: 5.0,
            average_pace: "5:15 /km",
            target_pace: "6:00 /km",
            moving_time_formatted: "28:52",
            target_time: "30:00",
            elevation_gain: null,
            target_elevation: null,
            average_heartrate: 138,
            target_hr: "Target: < 130",
            badge: "OVERREACHING",
            ai_note:
                "You ran too fast for a recovery day. Keep the heart rate in Zone 2 to avoid fatigue accumulation.",
            ai_note_type: "coach",
        },
    ],
};

export default function AnalysisPage() {
    useEffect(() => {
        console.log("Insights Page Hit!");
    }, []);
    const { user } = useAuth();
    const [data, setData] = useState<AnalysisData>(DEFAULT_DATA);
    const [loading, setLoading] = useState(true);
    const [syncing, setSyncing] = useState(false);

    const fetchAnalysis = useCallback(async () => {
        try {
            const analysisData = await apiStravaAnalysis();
            setData(analysisData);
        } catch {
            // If API fails, try to at least get connection status
            try {
                const profile = await apiGetProfile();
                setData((prev) => ({
                    ...prev,
                    strava_connected: profile.profile.strava_connected,
                }));
            } catch {
                // Fallback to default demo data
            }
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAnalysis();
    }, [fetchAnalysis]);

    const handleSync = async () => {
        setSyncing(true);
        try {
            await apiStravaSync();
            await fetchAnalysis();
        } catch {
            // ignore
        } finally {
            setSyncing(false);
        }
    };

    const userInitials = user?.name
        ? user.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2)
        : "U";

    if (loading) {
        return (
            <div className="max-w-6xl mx-auto">
                <div className="animate-pulse space-y-5">
                    <div className="h-10 bg-white/5 rounded-2xl w-1/3" />
                    <div className="h-16 bg-white/5 rounded-2xl" />
                    <div className="grid grid-cols-3 gap-3">
                        <div className="h-24 bg-white/5 rounded-2xl" />
                        <div className="h-24 bg-white/5 rounded-2xl" />
                        <div className="h-24 bg-white/5 rounded-2xl" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="h-64 bg-white/5 rounded-2xl" />
                        <div className="h-64 bg-white/5 rounded-2xl" />
                    </div>
                    <div className="h-40 bg-white/5 rounded-2xl" />
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-white tracking-tight">
                    Athlete Performance Analysis
                </h1>
                <div className="flex items-center gap-4">
                    <div className="relative group">
                        <Search
                            size={16}
                            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-[#7f13ec] transition-colors"
                        />
                        <input
                            type="text"
                            placeholder="Search activities..."
                            className="bg-[#1a1228]/80 border border-white/[0.06] rounded-2xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-zinc-600 w-64 focus:outline-none focus:border-[#7f13ec]/50 focus:bg-[#1a1228] transition-all"
                        />
                    </div>
                    <button className="w-10 h-10 rounded-2xl bg-[#1a1228]/80 border border-white/[0.06] flex items-center justify-center text-zinc-500 hover:text-white hover:border-white/10 transition-all cursor-pointer">
                        <Bell size={18} />
                    </button>
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-orange-950/20">
                        {userInitials}
                    </div>
                </div>
            </div>

            {/* Strava Sync Status */}
            <StravaSyncStatus
                connected={data.strava_connected}
                lastSyncAt={data.last_sync_at}
                onSync={handleSync}
                syncing={syncing}
            />

            {/* Stats + Training Alignment Row */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                {/* Left: Training Alignment donut */}
                <div className="lg:col-span-4">
                    <TrainingAlignment
                        score={data.alignment_score}
                        weeklyChange={data.alignment_weekly_change}
                        description={data.alignment_description}
                    />
                </div>

                {/* Right: Stats cards + Volume chart */}
                <div className="lg:col-span-8 flex flex-col gap-5">
                    <WeeklyStatsCards
                        weeklyDistance={data.weekly_distance}
                        distanceChange={data.distance_change}
                        avgHeartRate={data.avg_heart_rate}
                        hrLabel={data.hr_label}
                        consistencyDays={data.consistency_days}
                        streakChange={data.streak_change}
                    />
                    <div className="flex-1">
                        <WeeklyVolumeChart data={data.volume_data} />
                    </div>
                </div>
            </div>

            {/* Recent Activities Section Header */}
            <div className="flex items-center justify-between pt-4">
                <h2 className="text-lg font-bold text-white">Recent Activities</h2>
                <button className="text-sm font-bold text-[#7f13ec] hover:text-[#8f23fc] transition-colors flex items-center gap-1.5 group">
                    View All Activities
                    <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                </button>
            </div>

            {/* Recent Activities */}
            <RecentActivities activities={data.recent_activities} />

            {/* Connect Strava floating button */}
            <ConnectStravaButton connected={data.strava_connected} />
        </div>
    );
}
