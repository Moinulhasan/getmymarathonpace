"use client";

interface DayVolume {
    day: string;
    planned: number;
    actual: number;
}

interface WeeklyVolumeChartProps {
    data: DayVolume[];
}

export default function WeeklyVolumeChart({ data }: WeeklyVolumeChartProps) {
    const maxVal = Math.max(...data.flatMap((d) => [d.planned, d.actual]), 1);

    return (
        <div className="bg-[#1a1228]/80 border border-white/[0.06] rounded-2xl p-6 h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <h3 className="text-sm font-bold text-white">Weekly Volume</h3>
                    <span className="text-[11px] text-zinc-500 font-medium">Planned vs Actual</span>
                </div>
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#a855f7]" />
                        <span className="text-[9px] uppercase tracking-[0.15em] text-zinc-500 font-bold">Planned</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#7f13ec]" />
                        <span className="text-[9px] uppercase tracking-[0.15em] text-zinc-500 font-bold">Actual</span>
                    </div>
                </div>
            </div>

            {/* Chart */}
            <div className="flex-1 flex items-end gap-5 min-h-[140px] px-2">
                {data.map((d) => (
                    <div key={d.day} className="flex-1 flex flex-col items-center gap-3">
                        <div className="w-full flex items-end justify-center gap-1.5 h-[120px]">
                            {/* Planned bar */}
                            <div
                                className="w-2 rounded-t-sm bg-[#a855f7]/30 transition-all duration-700 hover:bg-[#a855f7]/50"
                                style={{ height: `${(d.planned / maxVal) * 100}%` }}
                            />
                            {/* Actual bar */}
                            <div
                                className="w-2 rounded-t-sm bg-[#7f13ec] transition-all duration-700 shadow-[0_0_10px_rgba(127,19,236,0.3)] hover:shadow-[0_0_15px_rgba(127,19,236,0.5)]"
                                style={{ height: `${(d.actual / maxVal) * 100}%` }}
                            />
                        </div>
                        <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">{d.day}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
