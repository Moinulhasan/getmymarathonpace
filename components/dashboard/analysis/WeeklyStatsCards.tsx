"use client";

interface WeeklyStatsCardsProps {
    weeklyDistance: number;
    distanceChange: number;
    avgHeartRate: number;
    hrLabel: string;
    consistencyDays: number;
    streakChange: number;
}

export default function WeeklyStatsCards({
    weeklyDistance,
    distanceChange,
    avgHeartRate,
    hrLabel,
    consistencyDays,
    streakChange,
}: WeeklyStatsCardsProps) {
    const cards = [
        {
            label: "WEEKLY DISTANCE",
            value: weeklyDistance.toFixed(1),
            unit: "km",
            badge: `${distanceChange >= 0 ? "+" : ""}${distanceChange.toFixed(1)}%`,
            badgeColor: distanceChange >= 0 ? "text-green-400" : "text-red-400",
        },
        {
            label: "AVG. HEART RATE",
            value: avgHeartRate,
            unit: "",
            badge: hrLabel,
            badgeColor: "text-zinc-500",
            subUnit: "bpm",
        },
        {
            label: "CONSISTENCY",
            value: consistencyDays,
            unit: "days",
            badge: `${streakChange >= 0 ? "+" : ""}${streakChange} streak`,
            badgeColor: "text-[#a855f7]",
        },
    ];

    return (
        <div className="grid grid-cols-3 gap-3">
            {cards.map((card) => (
                <div
                    key={card.label}
                    className="bg-[#1a1228]/80 border border-white/[0.06] rounded-2xl p-4 flex flex-col items-center justify-center text-center relative overflow-hidden"
                >
                    <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-zinc-500 mb-3">
                        {card.label}
                    </span>
                    <div className="flex items-baseline justify-center gap-1.5 w-full">
                        <span className="text-3xl font-bold text-white tracking-tight">{card.value}</span>
                        {card.unit && <span className="text-sm text-zinc-400 font-medium">{card.unit}</span>}
                        {card.badge && (
                            <span className={`text-[11px] font-bold ml-1 ${card.badgeColor}`}>
                                {card.badge}
                            </span>
                        )}
                    </div>
                    {card.subUnit && (
                        <div className="mt-1 flex flex-col items-center">
                            <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold">{card.subUnit}</span>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
