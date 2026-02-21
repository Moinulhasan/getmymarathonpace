"use client";

interface TrainingAlignmentProps {
    score: number;
    weeklyChange: number;
    description: string;
}

export default function TrainingAlignment({
    score,
    weeklyChange,
    description,
}: TrainingAlignmentProps) {
    // SVG donut chart parameters
    const size = 180;
    const strokeWidth = 12;
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (score / 100) * circumference;

    return (
        <div className="bg-[#1a1228]/80 border border-white/[0.06] rounded-2xl p-6 flex flex-col items-center text-center h-full">
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-500 mb-8 self-center">
                TRAINING ALIGNMENT
            </span>

            {/* Donut Chart */}
            <div className="relative mb-8" style={{ width: size, height: size }}>
                {/* SVG for Donut */}
                <svg width={size} height={size} className="transform -rotate-90">
                    {/* Background circle */}
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        fill="none"
                        stroke="rgba(255,255,255,0.03)"
                        strokeWidth={strokeWidth}
                    />
                    {/* Progress arc */}
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        fill="none"
                        stroke="#7f13ec"
                        strokeWidth={strokeWidth}
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        className="transition-all duration-1000 ease-out"
                        style={{
                            filter: "drop-shadow(0 0 12px rgba(127, 19, 236, 0.8))",
                        }}
                    />
                </svg>
                {/* Center text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center transform lg:rotate-0">
                    <span className="text-5xl font-black text-white tracking-tighter">
                        {score}%
                    </span>
                    <span className="text-[11px] font-bold text-green-400 mt-1">
                        {weeklyChange >= 0 ? "+" : ""}{weeklyChange}% WEEKLY
                    </span>
                </div>
            </div>

            <p className="text-xs text-zinc-500 leading-relaxed max-w-[200px] font-medium">
                {description}
            </p>
        </div>
    );
}
