"use client";

import { motion } from "framer-motion";
import { TrendingDown, BedDouble, Shuffle } from "lucide-react";
import SectionWrapper from "@/components/ui/SectionWrapper";
import GradientText from "@/components/ui/GradientText";
import { fadeInUp } from "@/lib/animations";

const problems = [
    {
        icon: Shuffle,
        title: "Random Mileage",
        description:
            "Running without a structured volume leads to stagnant results and cardiovascular bottlenecks.",
        color: "from-red-500/20 to-red-500/5",
        iconColor: "text-red-400",
        borderColor: "hover:border-red-500/30",
    },
    {
        icon: BedDouble,
        title: "No Recovery",
        description:
            "Overtraining without scheduled deload weeks causes hormonal burnout and muscle fatigue.",
        color: "from-amber-500/20 to-amber-500/5",
        iconColor: "text-amber-400",
        borderColor: "hover:border-amber-500/30",
    },
    {
        icon: TrendingDown,
        title: "No Progression",
        description:
            "Failing to increase intensity correctly halts gains and increases long-term injury risk.",
        color: "from-orange-500/20 to-orange-500/5",
        iconColor: "text-orange-400",
        borderColor: "hover:border-orange-500/30",
    },
];

export default function ProblemSection() {
    return (
        <SectionWrapper id="problems">
            <motion.div variants={fadeInUp} className="text-center mb-16">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
                    Most Runners{" "}
                    <GradientText>Plateau</GradientText>
                </h2>
                <p className="mt-4 text-zinc-500 text-lg max-w-2xl mx-auto">
                    Standard training blocks are static. Life isn&apos;t. Without AI
                    adaptation, you&apos;re either under-training or over-straining.
                </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
                {problems.map((problem) => (
                    <motion.div
                        key={problem.title}
                        variants={fadeInUp}
                        className={`group relative p-8 rounded-2xl border border-white/5 bg-white/[0.02] transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl ${problem.borderColor}`}
                    >
                        <div
                            className={`absolute inset-0 rounded-2xl bg-gradient-to-b ${problem.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                        />
                        <div className="relative z-10">
                            <div className={`w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-6 ${problem.iconColor} group-hover:scale-110 transition-transform duration-300`}>
                                <problem.icon size={24} />
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-3">
                                {problem.title}
                            </h3>
                            <p className="text-zinc-500 leading-relaxed text-sm">
                                {problem.description}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </SectionWrapper>
    );
}
