"use client";

import { motion } from "framer-motion";
import { Flag, Pencil, Sparkles } from "lucide-react";
import SectionWrapper from "@/components/ui/SectionWrapper";
import { fadeInUp, staggerContainer } from "@/lib/animations";

const steps = [
    {
        icon: Flag,
        step: 1,
        title: "Set Your Goal",
        description:
            "Select your distance, race date, and target finish time.",
        bg: "bg-purple-600",
        glow: "0 0 30px rgba(147,51,234,0.35)",
    },
    {
        icon: Pencil,
        step: 2,
        title: "Enter Pace",
        description:
            "Sync your last 3 runs to establish your current performance baseline.",
        bg: "bg-cyan-500",
        glow: "0 0 30px rgba(6,182,212,0.35)",
    },
    {
        icon: Sparkles,
        step: 3,
        title: "Get Plan",
        description:
            "AI generates your adaptive schedule and syncs it to your watch.",
        bg: "bg-purple-600",
        glow: "0 0 30px rgba(147,51,234,0.35)",
    },
];

export default function HowItWorksSection() {
    return (
        <SectionWrapper id="how-it-works">
            {/* Heading */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-center mb-20"
            >
                <p className="text-sm font-semibold text-purple-500 uppercase tracking-widest mb-4">
                    Process
                </p>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
                    Your Roadmap to Peak Fitness
                </h2>
            </motion.div>

            {/* Steps Row with Connector Lines */}
            <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                className="relative max-w-4xl mx-auto"
            >
                {/* Connector Lines (behind icons) */}
                <div className="absolute top-[36px] left-[16.67%] right-[16.67%] hidden md:flex items-center z-0 pointer-events-none"
                    style={{ paddingLeft: "36px", paddingRight: "36px" }}
                >
                    <div className="flex-1 h-[3px]" style={{ background: "linear-gradient(to right, #9333ea, #06b6d4)" }} />
                    <div className="flex-1 h-[3px]" style={{ background: "linear-gradient(to right, #06b6d4, #9333ea)" }} />
                </div>

                {/* Steps Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-0">
                    {steps.map((step) => (
                        <motion.div
                            key={step.step}
                            variants={fadeInUp}
                            className="relative flex flex-col items-center text-center"
                        >
                            {/* Icon Box */}
                            <div className="relative z-10 mb-6">
                                <div
                                    className={`w-[72px] h-[72px] ${step.bg} rounded-2xl flex items-center justify-center`}
                                    style={{ boxShadow: step.glow }}
                                >
                                    <step.icon size={28} className="text-white" />
                                </div>
                            </div>

                            {/* Title */}
                            <h3 className="text-lg font-semibold text-white mb-2">
                                {step.step}. {step.title}
                            </h3>

                            {/* Description */}
                            <p className="text-sm text-zinc-500 leading-relaxed max-w-[220px] mx-auto">
                                {step.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </SectionWrapper>
    );
}
