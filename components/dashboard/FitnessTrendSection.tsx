import { Zap, Heart } from "lucide-react";
import { AnalysisData } from "@/lib/api";

interface FitnessTrendSectionProps {
    analysis?: AnalysisData | null;
}

// SVG path data (Keeping these as reference for the aesthetic chart)
const fitnessPath = "M 30 180 C 60 175, 90 170, 120 160 C 150 150, 180 145, 210 130 C 240 120, 270 110, 300 95 C 330 85, 360 75, 390 65 C 420 58, 450 50, 480 40 C 510 35, 540 30, 570 25";
const fatiguePath = "M 30 200 C 60 195, 90 185, 120 180 C 150 175, 180 165, 210 155 C 240 145, 270 135, 300 120 C 330 110, 360 100, 390 85 C 420 75, 450 65, 480 55 C 510 50, 540 48, 570 50";

export default function FitnessTrendSection({ analysis }: FitnessTrendSectionProps) {
    return (
        <div className="flex flex-col xl:flex-row gap-4">
            {/* Chart */}
            <div className="flex-1 glass-card p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="text-lg font-bold text-white uppercase tracking-tight">Fitness Trend</h3>
                            {analysis?.last_sync_at && (
                                <span className="px-1.5 py-0.5 rounded bg-green-500/10 text-[8px] font-black text-green-500 uppercase">Synced</span>
                            )}
                        </div>
                        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                            Training Stress Balance (TSB)
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-[#a855f7]" />
                            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Fitness</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-cyan-400" />
                            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Fatigue</span>
                        </div>
                    </div>
                </div>

                <div className="relative w-full overflow-hidden">
                    <svg
                        viewBox="0 0 600 220"
                        className="w-full h-auto"
                        preserveAspectRatio="xMidYMid meet"
                    >
                        {/* Grid lines */}
                        {[60, 110, 160].map((y) => (
                            <line
                                key={y}
                                x1="30"
                                y1={y}
                                x2="570"
                                y2={y}
                                stroke="rgba(255,255,255,0.04)"
                                strokeDasharray="4 4"
                            />
                        ))}

                        {/* Fatigue line (behind) */}
                        <path
                            d={fatiguePath}
                            fill="none"
                            stroke="#06b6d4"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeDasharray="8 6"
                            opacity="0.7"
                        />

                        {/* Fitness area gradient */}
                        <defs>
                            <linearGradient id="fitGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#a855f7" stopOpacity="0.3" />
                                <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
                            </linearGradient>
                        </defs>
                        <path
                            d={`${fitnessPath} L 570 210 L 30 210 Z`}
                            fill="url(#fitGrad)"
                        />

                        {/* Fitness line */}
                        <path
                            d={fitnessPath}
                            fill="none"
                            stroke="#a855f7"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                        />

                        {/* X axis labels */}
                        <text x="30" y="215" fill="#52525b" fontSize="9" fontWeight="800" fontFamily="Inter" opacity="0.5">MTD</text>
                        <text x="520" y="215" fill="#52525b" fontSize="9" fontWeight="800" fontFamily="Inter" opacity="0.8">TODAY</text>
                    </svg>
                </div>
            </div>

            {/* Side Cards */}
            <div className="flex flex-row xl:flex-col gap-4 xl:w-64">
                {/* Current Form */}
                <div className="flex-1 glass-card p-5 border-l-2 border-l-[#a855f7]">
                    <div className="flex items-center gap-2.5 mb-3">
                        <div className="w-8 h-8 rounded-lg bg-[#7f13ec]/20 flex items-center justify-center">
                            <Zap size={16} className="text-[#a855f7]" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                            Consistency
                        </span>
                    </div>
                    <p className="text-2xl font-black text-green-400 mb-2 leading-none">{analysis?.consistency_days || 0}d</p>
                    <p className="text-[11px] text-zinc-500 font-bold leading-relaxed uppercase tracking-tight">
                        {analysis?.streak_change && analysis.streak_change > 0
                            ? `+${analysis.streak_change}d increase from last week.`
                            : "Maintain your streak for peak form."}
                    </p>
                </div>

                {/* Resting HR (Avg Heart Rate as proxy for Resting HR if not available) */}
                <div className="flex-1 glass-card p-5 border-l-2 border-l-orange-400">
                    <div className="flex items-center gap-2.5 mb-3">
                        <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center">
                            <Heart size={16} className="text-orange-400" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                            Avg Heart Rate
                        </span>
                    </div>
                    <p className="text-2xl font-black text-white mb-2 leading-none">
                        {analysis?.avg_heart_rate || 0} <span className="text-xs font-bold text-zinc-500 uppercase tracking-tighter">bpm</span>
                    </p>
                    <p className="text-[11px] text-zinc-500 font-bold leading-relaxed uppercase tracking-tight italic">
                        &quot;{analysis?.hr_label || "No data yet"}&quot; zone efficiency.
                    </p>
                </div>
            </div>
        </div>
    );
}
