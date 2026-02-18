"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import SectionWrapper from "@/components/ui/SectionWrapper";
import GradientText from "@/components/ui/GradientText";
import { fadeInUp } from "@/lib/animations";

const testimonials = [
    {
        name: "Sarah Jenkins",
        role: "Marathoner",
        quote:
            "The adaptive plan caught my overtraining before I got injured. Shaved 17 minutes off my time.",
        avatar: "SJ",
        gradient: "from-rose-500 to-pink-500",
    },
    {
        name: "Marcus Chen",
        role: "5K Specialist",
        quote:
            "The speed work sessions were brutal but perfectly calculated. Finally broke the 20-minute barrier.",
        avatar: "MC",
        gradient: "from-sky-500 to-cyan-500",
    },
    {
        name: "Elena Rodriguez",
        role: "Ultra Runner",
        quote:
            "I never understood how to fuel properly until RunGen's AI nutrition planner took over.",
        avatar: "ER",
        gradient: "from-amber-500 to-orange-500",
    },
    {
        name: "David Okonjo",
        role: "Half Marathon",
        quote:
            "The dynamic hill training suggestions were exactly what I needed for my hilly local course.",
        avatar: "DO",
        gradient: "from-emerald-500 to-teal-500",
    },
];

function TestimonialCard({ t }: { t: (typeof testimonials)[0] }) {
    return (
        <div className="group relative min-w-[340px] w-[340px] flex-shrink-0 p-6 sm:p-8 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-indigo-500/20 transition-all duration-300">
            <Quote size={24} className="text-indigo-500/20 mb-4" />
            <p className="text-sm text-zinc-400 leading-relaxed mb-6 italic">
                &quot;{t.quote}&quot;
            </p>
            <div className="flex items-center gap-3">
                <div
                    className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.gradient} flex items-center justify-center text-xs font-bold text-white`}
                >
                    {t.avatar}
                </div>
                <div>
                    <p className="text-sm font-semibold text-white">{t.name}</p>
                    <p className="text-xs text-zinc-500">{t.role}</p>
                </div>
                <div className="ml-auto flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                        <Star
                            key={i}
                            size={12}
                            className="text-amber-400 fill-amber-400"
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default function TestimonialsSection() {
    return (
        <SectionWrapper id="testimonials">
            <motion.div variants={fadeInUp} className="text-center mb-12">
                <p className="text-sm font-medium text-indigo-400 uppercase tracking-wider mb-3">
                    Testimonials
                </p>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
                    Elite{" "}
                    <GradientText>Results</GradientText>
                </h2>
            </motion.div>

            {/* Infinite Auto-Scroll */}
            <motion.div variants={fadeInUp} className="overflow-hidden relative">
                {/* Fade edges */}
                <div className="absolute left-0 top-0 bottom-0 w-16 z-10 bg-gradient-to-r from-[#0a0a0a] to-transparent pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-16 z-10 bg-gradient-to-l from-[#0a0a0a] to-transparent pointer-events-none" />

                <div className="flex gap-6 animate-scroll-left-slow hover:[animation-play-state:paused]">
                    {testimonials.map((t) => (
                        <TestimonialCard key={t.name} t={t} />
                    ))}
                    {/* Duplicate for seamless loop */}
                    {testimonials.map((t) => (
                        <TestimonialCard key={`dup-${t.name}`} t={t} />
                    ))}
                </div>
            </motion.div>
        </SectionWrapper>
    );
}
