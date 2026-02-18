"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Button from "@/components/ui/Button";
import { fadeInUp } from "@/lib/animations";

export default function CTASection() {
    return (
        <section
            id="cta"
            className="relative py-24 sm:py-32 overflow-hidden"
            aria-label="Call to action"
        >
            {/* Animated Gradient Background */}
            <div className="absolute inset-0">
                <motion.div
                    className="absolute inset-0"
                    style={{
                        background:
                            "linear-gradient(135deg, rgba(99,102,241,0.12), rgba(168,85,247,0.08), rgba(6,182,212,0.12), rgba(99,102,241,0.08))",
                        backgroundSize: "400% 400%",
                    }}
                    animate={{
                        backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
                <div className="absolute inset-0 bg-zinc-950/60" />
            </div>

            {/* Glow Orbs */}
            <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-64 h-64 rounded-full bg-indigo-500/10 blur-[100px] pointer-events-none" />
            <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-64 h-64 rounded-full bg-purple-500/10 blur-[100px] pointer-events-none" />

            <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <motion.div
                    variants={fadeInUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                >
                    <p className="text-sm font-medium text-indigo-400 uppercase tracking-wider mb-4">
                        Start Training Today
                    </p>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight mb-6 leading-tight">
                        Ready to{" "}
                        <span className="gradient-text">break your limits?</span>
                    </h2>
                    <p className="text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto mb-10">
                        Join thousands of runners who stopped guessing and started training
                        with precision. Your race-day plan is one click away.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Button variant="primary" size="lg" href="#">
                            Generate My Plan
                            <ArrowRight size={18} />
                        </Button>
                        <Button variant="ghost" size="lg" href="#pricing">
                            View Pricing
                        </Button>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
