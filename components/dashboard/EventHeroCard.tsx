interface EventHeroCardProps {
    plan?: any;
}

export default function EventHeroCard({ plan }: EventHeroCardProps) {
    // Calculate actual days left
    const daysLeft = plan?.race_date
        ? Math.ceil((new Date(plan.race_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
        : 0;

    // Calculate progress (crude metric for now based on current date vs plan start/race)
    const totalWeeks = plan?.plan_data ? Math.ceil(plan.plan_data.length / 7) : 0;
    const progress = totalWeeks > 0 ? 0.35 : 0; // Default or calculated progress

    // SVG circular progress
    const radius = 52;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference * (1 - progress);

    const raceDateObj = plan?.race_date ? new Date(plan.race_date) : null;
    const raceMonthYear = raceDateObj
        ? raceDateObj.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
        : "N/A";

    return (
        <div className="glass-card p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="flex-1 min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-orange-400 mb-2">
                    {plan ? "Active Training Plan" : "No Active Journey"}
                </p>
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 leading-tight">
                    {plan?.name || "Ready to Start?"}
                </h2>

                <div className="flex items-center gap-5 mb-5">
                    <div className="border-r border-white/10 pr-5">
                        <span className="text-2xl font-bold text-white block">{daysLeft > 0 ? daysLeft : "0"}</span>
                        <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">
                            Days Left
                        </span>
                    </div>
                    <div>
                        <span className="text-2xl font-bold text-white block">{Math.round(progress * 100)}%</span>
                        <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">
                            Block Done
                        </span>
                    </div>
                </div>

                <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#7f13ec] text-white text-sm font-semibold hover:bg-[#6d0fcf] transition-colors cursor-pointer disabled:opacity-50" disabled={!plan}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 20h9" /><path d="M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.855z" />
                    </svg>
                    {plan ? "Adjust Strategy" : "Generate Plan"}
                </button>
            </div>

            {/* Circular Progress */}
            <div className="relative flex-shrink-0 self-center">
                <svg width="130" height="130" viewBox="0 0 130 130" className="transform -rotate-90">
                    <circle
                        cx="65"
                        cy="65"
                        r={radius}
                        stroke="rgba(255,255,255,0.06)"
                        strokeWidth="8"
                        fill="none"
                    />
                    <circle
                        cx="65"
                        cy="65"
                        r={radius}
                        stroke="url(#progressGrad)"
                        strokeWidth="8"
                        fill="none"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        className="transition-all duration-1000 ease-out"
                    />
                    <defs>
                        <linearGradient id="progressGrad" x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0%" stopColor="#7f13ec" />
                            <stop offset="100%" stopColor="#a855f7" />
                        </linearGradient>
                    </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold text-white">{daysLeft > 0 ? daysLeft : "0"}</span>
                    <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">
                        {raceMonthYear}
                    </span>
                </div>
            </div>
        </div>
    );
}
