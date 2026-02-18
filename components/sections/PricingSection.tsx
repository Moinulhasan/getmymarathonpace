"use client";

import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import SectionWrapper from "@/components/ui/SectionWrapper";
import GradientText from "@/components/ui/GradientText";
import Button from "@/components/ui/Button";
import { fadeInUp } from "@/lib/animations";

const plans = [
    {
        name: "Basic Track",
        price: "0",
        currency: "USD",
        period: "/month",
        description: "Get started with a static training plan",
        features: [
            "Static 5K Training Plan",
            "Manual Run Logging",
            "Basic Pace Calculator",
        ],
        cta: "Start Free",
        highlighted: false,
    },
    {
        name: "Elite Adaptive",
        price: "19",
        currency: "USD",
        period: "/month",
        description: "Unlock the full power of AI adaptation",
        features: [
            "Full AI Adaptation Engine",
            "Garmin & Strava Auto-Sync",
            "Biological Data Analysis",
            "Injury Prevention Alerts",
            "Custom Race Nutrition Plan",
        ],
        cta: "Go Elite",
        highlighted: true,
    },
];

export default function PricingSection() {
    return (
        <SectionWrapper id="pricing">
            <motion.div variants={fadeInUp} className="text-center mb-16">
                <p className="text-sm font-medium text-indigo-400 uppercase tracking-wider mb-3">
                    Pricing
                </p>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
                    Start Training{" "}
                    <GradientText>Today</GradientText>
                </h2>
                <p className="mt-4 text-zinc-500 text-lg max-w-2xl mx-auto">
                    From casual jogger to elite marathoner, we have you covered.
                </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                {plans.map((plan) => (
                    <motion.div
                        key={plan.name}
                        variants={fadeInUp}
                        whileHover={{ scale: 1.03, y: -8 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className={`relative p-8 rounded-2xl border transition-all duration-300 ${plan.highlighted
                            ? "border-indigo-500/40 bg-gradient-to-b from-indigo-500/10 via-purple-500/5 to-transparent shadow-xl shadow-indigo-500/10"
                            : "border-white/5 bg-white/[0.02]"
                            }`}
                    >
                        {plan.highlighted && (
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 px-3 py-1 text-xs font-medium text-white">
                                    <Sparkles size={12} />
                                    Most Popular
                                </span>
                            </div>
                        )}

                        <div className="mb-8">
                            <h3 className="text-xl font-semibold text-white mb-2">
                                {plan.name}
                            </h3>
                            <p className="text-sm text-zinc-500 mb-6">{plan.description}</p>
                            <div className="flex items-baseline gap-1">
                                <span className="text-4xl font-bold text-white">
                                    {plan.price === "0" ? "Free" : `$${plan.price}`}
                                </span>
                                {plan.price !== "0" && (
                                    <span className="text-sm text-zinc-500">
                                        {plan.period}
                                    </span>
                                )}
                            </div>
                        </div>

                        <ul className="space-y-3 mb-8" role="list">
                            {plan.features.map((feature) => (
                                <li key={feature} className="flex items-center gap-3">
                                    <div
                                        className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${plan.highlighted
                                            ? "bg-indigo-500/20 text-indigo-400"
                                            : "bg-white/5 text-zinc-500"
                                            }`}
                                    >
                                        <Check size={12} />
                                    </div>
                                    <span className="text-sm text-zinc-400">{feature}</span>
                                </li>
                            ))}
                        </ul>

                        <Button
                            variant={plan.highlighted ? "primary" : "secondary"}
                            size="lg"
                            className="w-full"
                            href="#cta"
                        >
                            {plan.cta}
                        </Button>
                    </motion.div>
                ))}
            </div>
        </SectionWrapper>
    );
}
