"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
    Eye,
    Heart,
    Clock,
    ChevronRight,
    Send,
    User,
    MessageSquare,
    ArrowLeft,
} from "lucide-react";
import type { BlogPost } from "@/lib/blog-data";
import GradientText from "@/components/ui/GradientText";
import Link from "next/link";

const tagColors: Record<string, string> = {
    "Course Strategy": "bg-purple-600",
    "PB Chasing": "bg-purple-600",
    Physiology: "bg-emerald-600",
    Performance: "bg-emerald-600",
    Fueling: "bg-purple-600",
    "World Majors": "bg-purple-600",
};

interface Comment {
    id: number;
    name: string;
    text: string;
    date: string;
    avatar: string;
}

const initialComments: Comment[] = [
    {
        id: 1,
        name: "Alex Rivera",
        text: "This breakdown of the Berlin course is exactly what I needed. Adjusting my pacing strategy now for my spring marathon!",
        date: "Oct 13, 2024",
        avatar: "AR",
    },
    {
        id: 2,
        name: "Priya Sharma",
        text: "The elevation profile chart is incredible. Never realized how flat Berlin really is compared to my local routes.",
        date: "Oct 14, 2024",
        avatar: "PS",
    },
];

export default function BlogDetailContent({ post }: { post: BlogPost }) {
    const [favCount, setFavCount] = useState(post.favorites);
    const [isFav, setIsFav] = useState(false);
    const [comments, setComments] = useState<Comment[]>(initialComments);
    const [commentName, setCommentName] = useState("");
    const [commentText, setCommentText] = useState("");

    const toggleFav = () => {
        setIsFav(!isFav);
        setFavCount((c) => (isFav ? c - 1 : c + 1));
    };

    const addComment = () => {
        if (!commentName.trim() || !commentText.trim()) return;
        const newComment: Comment = {
            id: Date.now(),
            name: commentName,
            text: commentText,
            date: "Just now",
            avatar: commentName.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase(),
        };
        setComments([newComment, ...comments]);
        setCommentName("");
        setCommentText("");
    };

    return (
        <>
            {/* ── Hero ── */}
            <div className="relative h-[420px] sm:h-[480px] lg:h-[520px] overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-br ${post.imageBg}`} />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/60 to-transparent" />

                <div className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-12">
                    {/* Back Button */}
                    <Link
                        href="/blog"
                        className="absolute top-24 left-4 sm:left-6 lg:left-8 inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors group"
                    >
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        Back to Blog
                    </Link>

                    {/* Tags */}
                    <div className="flex items-center gap-3 mb-4">
                        {post.tags.map((tag) => (
                            <span
                                key={tag}
                                className={`px-3 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider text-white ${tagColors[tag] || "bg-purple-600"}`}
                            >
                                {tag}
                            </span>
                        ))}
                        <span className="flex items-center gap-1.5 text-xs text-zinc-400">
                            <Clock size={12} />
                            {post.readTime}
                        </span>
                        <span className="text-xs text-zinc-500">{post.date}</span>
                    </div>

                    {/* Title */}
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight max-w-3xl">
                        {post.title.split(":")[0]}:{" "}
                        <GradientText>{post.title.split(":").slice(1).join(":").trim() || ""}</GradientText>
                    </h1>

                    {/* Author Row with Stats */}
                    <div className="flex flex-wrap items-center gap-6 mt-6">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-xs font-bold text-white">
                                {post.author.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                            </div>
                            <div>
                                <p className="text-sm font-medium text-white">{post.author}</p>
                                <p className="text-xs text-zinc-500">{post.authorRole}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 text-xs text-zinc-400">
                            <span className="flex items-center gap-1.5">
                                <Eye size={14} />
                                {post.reads.toLocaleString()} reads
                            </span>
                            <button
                                onClick={toggleFav}
                                className={`flex items-center gap-1.5 transition-colors ${isFav ? "text-rose-400" : "text-zinc-400 hover:text-rose-400"}`}
                            >
                                <Heart size={14} className={isFav ? "fill-rose-400" : ""} />
                                {favCount.toLocaleString()} favorites
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Body ── */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
                <div className="flex flex-col lg:flex-row gap-10 lg:gap-14">
                    {/* Main Article */}
                    <article className="flex-1 min-w-0 max-w-3xl">
                        {post.content.map((block, i) => {
                            switch (block.type) {
                                case "heading":
                                    return (
                                        <h2
                                            key={i}
                                            className="text-xl sm:text-2xl font-bold text-white mt-10 mb-4"
                                        >
                                            {block.text}
                                        </h2>
                                    );
                                case "paragraph":
                                    return (
                                        <p
                                            key={i}
                                            className="text-[15px] text-zinc-400 leading-[1.85] mb-5"
                                        >
                                            {block.text}
                                        </p>
                                    );
                                case "blockquote":
                                    return (
                                        <blockquote
                                            key={i}
                                            className="relative my-8 py-6 px-6 sm:px-8 rounded-xl border-l-4 border-purple-500 bg-purple-500/5"
                                        >
                                            <p className="text-base sm:text-lg italic text-zinc-300 leading-relaxed font-medium">
                                                {block.text}
                                            </p>
                                            {block.cite && (
                                                <cite className="block mt-3 text-sm text-purple-400 not-italic">
                                                    — {block.cite}
                                                </cite>
                                            )}
                                        </blockquote>
                                    );
                                case "chart":
                                    return (
                                        <div
                                            key={i}
                                            className="my-8 rounded-xl border border-white/5 bg-white/[0.02] p-5 sm:p-6"
                                        >
                                            <div className="flex items-center justify-between mb-4">
                                                <h3 className="text-sm font-semibold text-white">
                                                    {block.text}
                                                </h3>
                                                <ChevronRight size={16} className="text-zinc-600" />
                                            </div>
                                            <p className="text-xs text-zinc-600 mb-3">Berlin — Avg Finish: Average</p>
                                            {/* Mock elevation chart */}
                                            <div className="relative h-28">
                                                <svg viewBox="0 0 500 100" className="w-full h-full" preserveAspectRatio="none">
                                                    <defs>
                                                        <linearGradient id="elev-fill" x1="0" y1="0" x2="0" y2="1">
                                                            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.3" />
                                                            <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                                                        </linearGradient>
                                                    </defs>
                                                    <path
                                                        d="M0,60 Q50,55 100,58 Q150,50 200,52 Q250,48 300,55 Q350,45 400,50 Q450,53 500,48"
                                                        stroke="#6366f1"
                                                        strokeWidth="2"
                                                        fill="none"
                                                    />
                                                    <path
                                                        d="M0,60 Q50,55 100,58 Q150,50 200,52 Q250,48 300,55 Q350,45 400,50 Q450,53 500,48 L500,100 L0,100 Z"
                                                        fill="url(#elev-fill)"
                                                    />
                                                </svg>
                                                <div className="absolute bottom-0 left-0 right-0 flex justify-between text-[10px] text-zinc-600 px-1">
                                                    {["Start", "5km", "10km", "15km", "20km", "25km", "30km", "35km", "40km", "Finish"].map((l) => (
                                                        <span key={l}>{l}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                case "table":
                                    return (
                                        <div
                                            key={i}
                                            className="my-8 rounded-xl border border-white/5 bg-white/[0.02] overflow-hidden"
                                        >
                                            <div className="px-5 py-3 border-b border-white/5">
                                                <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
                                                    {block.text}
                                                </h3>
                                            </div>
                                            <table className="w-full">
                                                <tbody>
                                                    {block.rows?.map((row, ri) => (
                                                        <tr key={ri} className="border-b border-white/[0.03] last:border-0">
                                                            <td className="px-5 py-2.5 text-sm text-zinc-400">{row[0]}</td>
                                                            <td className="px-5 py-2.5 text-sm text-white font-mono text-right">{row[1]}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    );
                                default:
                                    return null;
                            }
                        })}

                        {/* ── Comments Section ── */}
                        <div className="mt-16 pt-10 border-t border-white/5">
                            <div className="flex items-center gap-3 mb-8">
                                <MessageSquare size={20} className="text-indigo-400" />
                                <h2 className="text-xl font-bold text-white">
                                    Comments ({comments.length})
                                </h2>
                            </div>

                            {/* Add Comment Form */}
                            <div className="rounded-xl border border-white/5 bg-white/[0.02] p-5 sm:p-6 mb-8">
                                <div className="flex flex-col sm:flex-row gap-3 mb-3">
                                    <input
                                        type="text"
                                        placeholder="Your name"
                                        value={commentName}
                                        onChange={(e) => setCommentName(e.target.value)}
                                        className="flex-1 bg-white/[0.04] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 transition-all"
                                    />
                                </div>
                                <textarea
                                    placeholder="Share your thoughts…"
                                    value={commentText}
                                    onChange={(e) => setCommentText(e.target.value)}
                                    rows={3}
                                    className="w-full bg-white/[0.04] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 transition-all resize-none mb-3"
                                />
                                <button
                                    onClick={addComment}
                                    className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-sm font-semibold rounded-lg transition-all"
                                >
                                    <Send size={14} />
                                    Post Comment
                                </button>
                            </div>

                            {/* Comments List */}
                            <div className="space-y-5">
                                {comments.map((c) => (
                                    <motion.div
                                        key={c.id}
                                        initial={{ opacity: 0, y: 12 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="rounded-xl border border-white/5 bg-white/[0.02] p-5"
                                    >
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-[10px] font-bold text-white">
                                                {c.avatar}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-white">
                                                    {c.name}
                                                </p>
                                                <p className="text-[11px] text-zinc-600">
                                                    {c.date}
                                                </p>
                                            </div>
                                        </div>
                                        <p className="text-sm text-zinc-400 leading-relaxed">
                                            {c.text}
                                        </p>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </article>

                    {/* ── Sidebar ── */}
                    <aside className="w-full lg:w-[320px] shrink-0 space-y-6">
                        {/* CTA Card */}
                        <div className="rounded-2xl border border-purple-500/20 bg-[#110e1f] p-6">
                            <h3 className="text-lg font-bold text-white mb-2">
                                {post.sidebar.heading}
                            </h3>
                            <p className="text-sm text-zinc-500 leading-relaxed mb-5">
                                {post.sidebar.description}
                            </p>
                            <a
                                href="/#pricing"
                                className="block w-full text-center py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-sm font-semibold transition-all"
                            >
                                {post.sidebar.cta}
                            </a>
                        </div>

                        {/* Recommended */}
                        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
                            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                                Recommended
                            </h3>
                            <div className="space-y-4">
                                {post.recommended.map((rec, i) => (
                                    <a
                                        key={i}
                                        href={`/blog/${rec.slug}`}
                                        className="flex items-start gap-3 group"
                                    >
                                        <div className="w-10 h-10 rounded-lg bg-white/[0.04] border border-white/5 flex items-center justify-center text-lg shrink-0">
                                            {rec.icon}
                                        </div>
                                        <p className="text-sm text-zinc-400 leading-snug group-hover:text-white transition-colors font-medium">
                                            {rec.title}
                                        </p>
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Stats Card */}
                        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
                            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                                Article Stats
                            </h3>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="flex items-center gap-2 text-sm text-zinc-500">
                                        <Eye size={14} className="text-indigo-400" />
                                        Total Reads
                                    </span>
                                    <span className="text-sm font-bold text-white font-mono">
                                        {post.reads.toLocaleString()}
                                    </span>
                                </div>
                                <div className="h-px bg-white/5" />
                                <div className="flex items-center justify-between">
                                    <span className="flex items-center gap-2 text-sm text-zinc-500">
                                        <Heart size={14} className={isFav ? "text-rose-400 fill-rose-400" : "text-rose-400"} />
                                        Total Favorites
                                    </span>
                                    <span className="text-sm font-bold text-white font-mono">
                                        {favCount.toLocaleString()}
                                    </span>
                                </div>
                                <div className="h-px bg-white/5" />
                                <div className="flex items-center justify-between">
                                    <span className="flex items-center gap-2 text-sm text-zinc-500">
                                        <MessageSquare size={14} className="text-purple-400" />
                                        Comments
                                    </span>
                                    <span className="text-sm font-bold text-white font-mono">
                                        {comments.length}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </>
    );
}
