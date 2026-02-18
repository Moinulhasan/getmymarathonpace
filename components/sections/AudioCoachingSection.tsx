"use client";

import { motion } from "framer-motion";
import { Headphones, Activity, Heart, Gauge } from "lucide-react";
import SectionWrapper from "@/components/ui/SectionWrapper";
import GradientText from "@/components/ui/GradientText";
import { fadeInUp } from "@/lib/animations";

const coachingFeatures = [
    {
        icon: Activity,
        title: "Form Correction",
        description:
            "Immediate feedback on cadence, vertical oscillation, and ground contact time.",
        color: "text-cyan-400",
        bg: "bg-cyan-500/10",
        borderHover: "hover:border-cyan-500/30",
    },
    {
        icon: Heart,
        title: "Heart Rate Monitoring",
        description:
            "Alerts when you drift out of your target aerobic or anaerobic zone.",
        color: "text-rose-400",
        bg: "bg-rose-500/10",
        borderHover: "hover:border-rose-500/30",
    },
    {
        icon: Gauge,
        title: "Smart Pacing",
        description:
            "Dynamic pace adjustments based on remaining energy and route topography.",
        color: "text-amber-400",
        bg: "bg-amber-500/10",
        borderHover: "hover:border-amber-500/30",
    },
];

export default function AudioCoachingSection() {
    return (
        <SectionWrapper id="audio-coaching">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                {/* Left Content */}
                <motion.div variants={fadeInUp} className="space-y-6">
                    <p className="text-sm font-medium text-indigo-400 uppercase tracking-wider">
                        Live Coaching
                    </p>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
                        Real-Time Audio{" "}
                        <GradientText>Coaching</GradientText>
                    </h2>
                    <p className="text-zinc-500 text-lg max-w-lg leading-relaxed">
                        Don&apos;t wait until the run is over to correct your form. RunGen
                        AI analyzes your bio-metrics in real-time and whispers
                        adjustments directly into your ear.
                    </p>

                    {/* Audio Visual */}
                    <div className="flex items-center gap-4 pt-4">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center">
                            <Headphones size={26} className="text-indigo-400" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-white">
                                Whisper Mode Active
                            </p>
                            <p className="text-xs text-zinc-500">
                                Audio cues delivered via bone conduction or earbuds
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Right – Feature Cards */}
                <motion.div variants={fadeInUp} className="space-y-4">
                    {coachingFeatures.map((feature) => (
                        <motion.div
                            key={feature.title}
                            whileHover={{ x: 8 }}
                            transition={{
                                type: "spring",
                                stiffness: 300,
                                damping: 20,
                            }}
                            className={`flex items-start gap-4 p-5 rounded-2xl border border-white/5 bg-white/[0.02] transition-all duration-300 ${feature.borderHover}`}
                        >
                            <div
                                className={`w-11 h-11 rounded-xl ${feature.bg} flex items-center justify-center shrink-0`}
                            >
                                <feature.icon
                                    size={22}
                                    className={feature.color}
                                />
                            </div>
                            <div>
                                <h3 className="text-base font-semibold text-white mb-1">
                                    {feature.title}
                                </h3>
                                <p className="text-sm text-zinc-500 leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </SectionWrapper>
    );
}
