import { Trophy } from "lucide-react";

const personalBests = [
    { distance: "5K", time: "16:45", badge: "-12s", badgeColor: "bg-green-500/20 text-green-400" },
    { distance: "10K", time: "34:20", badge: "TARGET", badgeColor: "bg-orange-500/20 text-orange-400" },
    { distance: "26.2", time: "2:45:00", badge: "2023", badgeColor: "bg-white/10 text-zinc-400" },
];

export default function PersonalBestsCard() {
    return (
        <div className="glass-card p-5 h-full">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-white">Personal Bests</h3>
                <Trophy size={18} className="text-[#a855f7]" />
            </div>
            <div className="space-y-2.5">
                {personalBests.map((pb) => (
                    <div
                        key={pb.distance}
                        className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]"
                    >
                        <span className="text-xs font-semibold text-zinc-500 w-8">
                            {pb.distance}
                        </span>
                        <span className="text-lg font-bold text-white flex-1">
                            {pb.time}
                        </span>
                        <span
                            className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${pb.badgeColor}`}
                        >
                            {pb.badge}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
