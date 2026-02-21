"use client";

import { RefreshCw, Link2 } from "lucide-react";
import Link from "next/link";

interface StravaSyncStatusProps {
    connected: boolean;
    lastSyncAt: string | null;
    onSync: () => void;
    syncing: boolean;
}

export default function StravaSyncStatus({ connected, lastSyncAt, onSync, syncing }: StravaSyncStatusProps) {
    const timeSince = (dateStr: string) => {
        const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 60000);
        if (diff < 1) return "just now";
        if (diff < 60) return `${diff} minute${diff > 1 ? "s" : ""} ago`;
        if (diff < 1440) return `${Math.floor(diff / 60)} hour${Math.floor(diff / 60) > 1 ? "s" : ""} ago`;
        return `${Math.floor(diff / 1440)} day${Math.floor(diff / 1440) > 1 ? "s" : ""} ago`;
    };

    if (!connected) return null;

    return (
        <div className="flex items-center justify-between bg-[#1a1228]/80 border border-white/[0.06] rounded-2xl px-5 py-3.5">
            <div className="flex items-center gap-3">
                {/* Strava icon */}
                <div className="w-10 h-10 rounded-full bg-[#FC4C02]/10 flex items-center justify-center">
                    <Link2 size={20} className="text-[#FC4C02]" />
                </div>
                <div>
                    <div className="flex items-center gap-2">
                        <span className="text-white font-semibold text-sm">Strava Sync Status</span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="w-2 h-2 rounded-full bg-green-400 inline-block" />
                        <span className="text-zinc-400 text-xs">
                            Connected • Last sync: {lastSyncAt ? timeSince(lastSyncAt) : "Never"}
                        </span>
                    </div>
                </div>
            </div>
            {/* Sync Actions */}
            <div className="flex items-center gap-3">
                <button
                    onClick={onSync}
                    disabled={syncing || !connected}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg ${connected
                        ? "bg-[#7f13ec] hover:bg-[#8f23fc] text-white shadow-purple-950/20"
                        : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                        }`}
                >
                    <RefreshCw size={16} className={syncing ? "animate-spin" : ""} />
                    {syncing ? "Syncing..." : "Sync Now"}
                </button>
                <Link
                    href="/dashboard/profile"
                    className="px-5 py-2.5 rounded-xl bg-white/[0.03] border border-white/5 text-sm font-bold text-zinc-300 hover:bg-white/[0.06] transition-all"
                >
                    Manage Connection
                </Link>
            </div>
        </div>
    );
}
