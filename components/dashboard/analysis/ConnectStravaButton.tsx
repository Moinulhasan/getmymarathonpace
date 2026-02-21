"use client";

import { apiStravaConnect } from "@/lib/api";

export default function ConnectStravaButton({ connected }: { connected: boolean }) {
    if (connected) return null;

    const handleConnect = async () => {
        try {
            const res = await apiStravaConnect();
            window.location.href = res.url;
        } catch {
            alert("Failed to initiate Strava connection.");
        }
    };

    return (
        <button
            onClick={handleConnect}
            className="fixed bottom-6 left-6 z-50 flex items-center gap-2.5 px-6 py-3.5 rounded-2xl text-white font-bold text-sm transition-all hover:scale-105 cursor-pointer shadow-lg shadow-[#FC4C02]/30"
            style={{
                background: "linear-gradient(135deg, #FC4C02, #E8430A)",
            }}
        >
            {/* Strava icon */}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0l-7 13.828h4.169" />
            </svg>
            Connect Strava
        </button>
    );
}
