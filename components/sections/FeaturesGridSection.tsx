"use client";

import { motion } from "framer-motion";
import {
    TrendingUp,
    Timer,
    Dumbbell,
    CalendarClock,
    BarChart3,
    Shield,
} from "lucide-react";
import SectionWrapper from "@/components/ui/SectionWrapper";
import GradientText from "@/components/ui/GradientText";
import { fadeInUp } from "@/lib/animations";

const features = [
    {
        icon: TrendingUp,
        title: "Adaptive Mileage",
        description:
            "Mileage fluctuates based on your HRV and sleep data to optimize adaptation.",
    },
    {
        icon: Timer,
        title: "Tapering Logic",
        description:
            "Scientifically backed taper phase to ensure your legs are fresh for race day.",
    },
    {
        icon: Dumbbell,
        title: "Strength Integration",
        description:
            "Built-in stability and strength routines tailored to correct your gait imbalances.",
    },
    {
        icon: CalendarClock,
        title: "Race Countdown",
        description:
            "Real-time countdown and milestone alerts as you approach your goal event.",
    },
    {
        icon: BarChart3,
        title: "Performance Tracking",
        description:
            "Granular VO2 Max estimation and pace trend analysis after every single run.",
    },
    {
        icon: Shield,
        title: "Injury Risk Mitigation",
        description:
            "Early warning system detected via variance in your average ground contact time.",
    },
];

function FeatureCard({ feature }: { feature: (typeof features)[0] }) {
    return (
        <div className="group relative min-w-[300px] w-[300px] flex-shrink-0 p-6 sm:p-8 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-indigo-500/20 transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-white/5 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:border-indigo-500/20 transition-all duration-300">
                <feature.icon size={22} className="text-indigo-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
                {feature.title}
            </h3>
            <p className="text-sm text-zinc-500 leading-relaxed">
                {feature.description}
            </p>
        </div>
    );
}

export default function FeaturesGridSection() {
    return (
        <SectionWrapper id="features">
            <motion.div variants={fadeInUp} className="text-center mb-12">
                <p className="text-sm font-medium text-indigo-400 uppercase tracking-wider mb-3">
                    Core Platform
                </p>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
                    The RunGen{" "}
                    <GradientText>Engine</GradientText>
                </h2>
                <p className="mt-4 text-zinc-500 text-lg max-w-2xl mx-auto">
                    Everything you need to reach the podium, powered by data science.
                </p>
            </motion.div>

            {/* Infinite Auto-Scroll */}
            <motion.div variants={fadeInUp} className="overflow-hidden relative">
                {/* Fade edges */}
                <div className="absolute left-0 top-0 bottom-0 w-16 z-10 bg-gradient-to-r from-[#0a0a0a] to-transparent pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-16 z-10 bg-gradient-to-l from-[#0a0a0a] to-transparent pointer-events-none" />

                <div className="flex gap-6 animate-scroll-left hover:[animation-play-state:paused]">
                    {features.map((f) => (
                        <FeatureCard key={f.title} feature={f} />
                    ))}
                    {/* Duplicate for seamless loop */}
                    {features.map((f) => (
                        <FeatureCard key={`dup-${f.title}`} feature={f} />
                    ))}
                </div>
            </motion.div>
        </SectionWrapper>
    );
}
