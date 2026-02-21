import { Trophy } from "lucide-react";
import { PersonalBest } from "@/lib/api";

interface PersonalBestsCardProps {
    pbList?: PersonalBest[];
}

export default function PersonalBestsCard({ pbList = [] }: PersonalBestsCardProps) {
    return (
        <div className="glass-card p-5 h-full">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-white uppercase tracking-tight">Records</h3>
                <Trophy size={18} className="text-[#a855f7]" />
            </div>
            <div className="space-y-2.5">
                {pbList.length > 0 ? pbList.map((pb, idx) => (
                    <div
                        key={idx}
                        className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-[#a855f7]/30 transition-colors group"
                    >
                        <span className="text-[10px] font-black text-zinc-500 w-8 uppercase">
                            {pb.distance}
                        </span>
                        <span className="text-base font-black text-white flex-1 tracking-tight">
                            {pb.time}
                        </span>
                        <span
                            className="text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-white/5 text-zinc-500 group-hover:text-zinc-300 transition-colors"
                        >
                            {pb.date_achieved ? new Date(pb.date_achieved).getFullYear() : "PB"}
                        </span>
                    </div>
                )) : (
                    <div className="flex flex-col items-center justify-center py-8 opacity-40">
                        <Trophy size={24} className="mb-2 text-zinc-600" />
                        <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">No Records Set</p>
                    </div>
                )}
            </div>
        </div>
    );
}
