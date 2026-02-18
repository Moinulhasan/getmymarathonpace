"use client";

import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, User } from "lucide-react";
import GradientText from "@/components/ui/GradientText";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { blogPosts } from "@/lib/blog-data";
import Link from "next/link";

const tagColors: Record<string, string> = {
    "Course Strategy": "bg-purple-600",
    "PB Chasing": "bg-purple-600",
    Physiology: "bg-emerald-600",
    Performance: "bg-emerald-600",
    Fueling: "bg-purple-600",
    "World Majors": "bg-purple-600",
};

const cardVisuals: Record<string, React.ReactNode> = {
    "cracking-the-berlin-marathon-course": (
        <div className="relative w-full h-full overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-sky-700 via-indigo-600 to-blue-800" />
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                    <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <span className="text-2xl">🏃</span>
                    </div>
                    <div className="absolute -right-8 -top-4 w-12 h-12 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center">
                        <span className="text-lg">🏃‍♀️</span>
                    </div>
                </div>
            </div>
        </div>
    ),
    "science-of-the-taper": (
        <div className="relative w-full h-full overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-700 via-orange-600 to-yellow-600" />
            <div className="absolute inset-0 flex items-end justify-center">
                <div className="w-20 h-32 rounded-t-full bg-black/30" />
            </div>
            <div className="absolute top-6 right-8 w-16 h-16 rounded-full bg-yellow-400/40 blur-sm" />
        </div>
    ),
    "nutrition-strategies-abbott-six": (
        <div className="relative w-full h-full overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-violet-800 to-indigo-800" />
            <div className="absolute inset-0 flex items-center justify-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-500/30 flex items-center justify-center"><span className="text-sm">🥜</span></div>
                <div className="w-14 h-14 rounded-full bg-green-500/25 flex items-center justify-center"><span className="text-lg">🥗</span></div>
                <div className="w-10 h-10 rounded-full bg-yellow-500/30 flex items-center justify-center"><span className="text-sm">⚡</span></div>
            </div>
        </div>
    ),
};

export default function BlogContent() {
    return (
        <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24"
        >
            {/* Header */}
            {/* Back to Home */}
            <motion.div variants={fadeInUp} className="mb-8">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-white transition-colors group"
                >
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Home
                </Link>
            </motion.div>

            <motion.div variants={fadeInUp} className="mb-14">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-px bg-gradient-to-r from-indigo-500 to-purple-500" />
                    <p className="text-sm font-semibold text-purple-400 uppercase tracking-widest">
                        Premium Insights
                    </p>
                </div>
                <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
                    <div>
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-4">
                            The Elite Edge:{" "}
                            <GradientText>Running Intelligence</GradientText>
                        </h1>
                        <p className="text-zinc-500 text-lg max-w-2xl leading-relaxed">
                            Master your performance with data-driven strategies from
                            world-class marathoners and sports scientists.
                        </p>
                    </div>
                    <a
                        href="#"
                        className="flex items-center gap-2 text-sm font-semibold text-zinc-300 uppercase tracking-wider hover:text-white transition-colors group shrink-0"
                    >
                        View All Articles
                        <ArrowRight
                            size={16}
                            className="group-hover:translate-x-1 transition-transform"
                        />
                    </a>
                </div>
            </motion.div>

            {/* Article Cards Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {blogPosts.map((article) => (
                    <motion.div key={article.slug} variants={fadeInUp}>
                        <Link
                            href={`/blog/${article.slug}`}
                            className="group cursor-pointer rounded-2xl border border-purple-500/20 bg-[#110e1f] overflow-hidden hover:border-purple-500/40 transition-all duration-300 block"
                        >
                            {/* Image Area */}
                            <div className="relative h-48 overflow-hidden">
                                {cardVisuals[article.slug]}

                                {/* Tags */}
                                <div className="absolute top-3 left-3 flex gap-2 z-10">
                                    {article.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className={`px-3 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider text-white ${tagColors[tag] || "bg-purple-600"}`}
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Card Body */}
                            <div className="p-5 sm:p-6">
                                {/* Read Time */}
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-2 h-2 rounded-full bg-emerald-400" />
                                    <span className="text-xs text-zinc-500">
                                        {article.readTime}
                                    </span>
                                </div>

                                {/* Title */}
                                <h2 className="text-lg font-bold text-white mb-3 group-hover:text-indigo-300 transition-colors leading-snug">
                                    {article.title.includes("Barrier") ? "Cracking the Berlin Marathon Course" : article.title}
                                </h2>

                                {/* Excerpt */}
                                <p className="text-sm text-zinc-500 leading-relaxed mb-6">
                                    {article.excerpt}
                                </p>

                                {/* Author & Date separator */}
                                <div className="border-t border-white/5 pt-4 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-5 h-5 rounded-full bg-purple-500/30 flex items-center justify-center">
                                            <User size={10} className="text-purple-400" />
                                        </div>
                                        <span className="text-xs text-zinc-400 font-medium">
                                            {article.author}
                                        </span>
                                    </div>
                                    <span className="text-[11px] text-zinc-600 uppercase tracking-wider font-medium">
                                        {article.date}
                                    </span>
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}
