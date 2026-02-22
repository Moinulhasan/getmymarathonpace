"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { X, ChevronRight, ChevronLeft, Zap, Scale, Ruler, Calendar, Target, Clock, Map, Dumbbell, Activity, Timer, Loader2, CheckCircle2 } from "lucide-react";
import { apiGetProfile, apiGenerateTrainingPlan, apiSaveTrainingPlan } from "@/lib/api";

type Tab = "biometrics" | "goals" | "preferences" | "preview";

interface GeneratePlanModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

const overlayVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
};

const cardVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
    },
    exit: {
        opacity: 0, scale: 0.95, y: 20, transition: { duration: 0.2 }
    }
};

export default function GeneratePlanModal({ isOpen, onClose, onSuccess }: GeneratePlanModalProps) {
    const [currentTab, setCurrentTab] = useState<Tab>("biometrics");
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [planPreview, setPlanPreview] = useState<any[]>([]);
    const [coachInsight, setCoachInsight] = useState<string>("");
    const [genError, setGenError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        weight: "",
        height: "",
        age: "",
        restingHR: "",
        targetRace: "marathon",
        raceDate: "",
        targetTime: "",
        terrain: "road",
        longRunDay: "Sunday",
        daysPerWeek: ["Tue", "Wed", "Thu", "Sat", "Sun"],
        experience: "intermediate"
    });

    // Auto-fetch profile biometrics
    useEffect(() => {
        if (isOpen) {
            const fetchProfile = async () => {
                try {
                    const response = await apiGetProfile();
                    if (response?.profile) {
                        setFormData(prev => ({
                            ...prev,
                            weight: response.profile.weight?.toString() || prev.weight,
                            height: response.profile.height?.toString() || prev.height,
                            age: response.profile.age?.toString() || prev.age,
                        }));
                    }
                } catch (error) {
                    console.error("Failed to fetch profile:", error);
                }
            };
            fetchProfile();
        }
    }, [isOpen]);

    const tabs: { id: Tab; label: string; icon: any }[] = [
        { id: "biometrics", label: "Biometrics", icon: Scale },
        { id: "goals", label: "Goals", icon: Target },
        { id: "preferences", label: "Schedule", icon: Calendar },
        { id: "preview", label: "Preview", icon: Zap },
    ];

    const handleNext = () => {
        if (currentTab === "biometrics") setCurrentTab("goals");
        else if (currentTab === "goals") setCurrentTab("preferences");
    };

    const handleBack = () => {
        if (currentTab === "goals") setCurrentTab("biometrics");
        else if (currentTab === "preferences") setCurrentTab("goals");
        else if (currentTab === "preview") setCurrentTab("preferences");
    };

    const handleGenerate = async () => {
        setIsLoading(true);
        setGenError(null);
        setCurrentTab("preview");
        try {
            const result = await apiGenerateTrainingPlan(formData);
            if (result.plan && Array.isArray(result.plan)) {
                setPlanPreview(result.plan);
                setCoachInsight(result.coach_insight || "");
            } else {
                setPlanPreview([]);
                setGenError("The AI response didn't contain a valid training plan structure.");
            }
        } catch (error: any) {
            console.error("Generation failed:", error);
            setGenError(error.message || "An unexpected error occurred during generation.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await apiSaveTrainingPlan({
                name: `Road to ${formData.targetRace.charAt(0).toUpperCase() + formData.targetRace.slice(1)}`,
                race_type: formData.targetRace,
                race_date: formData.raceDate,
                target_time: formData.targetTime,
                terrain: formData.terrain,
                plan_data: planPreview,
            });
            onClose();
            if (onSuccess) onSuccess();
        } catch (error) {
            console.error("Save failed:", error);
        } finally {
            setIsSaving(false);
        }
    };

    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        variants={overlayVariants}
                        className="absolute inset-0 bg-black/80 backdrop-blur-md"
                        onClick={onClose}
                    />

                    <motion.div
                        variants={cardVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="relative w-full max-w-4xl bg-[#0f0916] border border-white/[0.08] rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
                    >
                        {/* Header */}
                        <div className="p-8 border-b border-white/[0.05] flex items-center justify-between bg-gradient-to-r from-[#1a1228] to-[#0f0916]">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-[#7f13ec]/20 border border-[#7f13ec]/30 flex items-center justify-center">
                                    <Zap size={20} className="text-[#a855f7] fill-[#a855f7]" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-black text-white uppercase tracking-tight">Generate Training Plan</h2>
                                    <p className="text-xs text-zinc-500 font-medium">AI-powered scheduling based on your profile</p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-10 h-10 rounded-full bg-white/[0.05] border border-white/10 flex items-center justify-center text-zinc-500 hover:text-white transition-all cursor-pointer"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Tabs Indicator */}
                        <div className="px-8 pt-6">
                            <div className="flex gap-2">
                                {tabs.map((tab) => {
                                    const Icon = tab.icon;
                                    const isActive = currentTab === tab.id;
                                    const isPreview = tab.id === "preview";
                                    if (isPreview && !planPreview && !isLoading) return null;

                                    return (
                                        <button
                                            key={tab.id}
                                            onClick={() => {
                                                if (tab.id === "preview" && !planPreview) return;
                                                setCurrentTab(tab.id);
                                            }}
                                            disabled={tab.id === "preview" && !planPreview && !isLoading}
                                            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl border transition-all ${isActive
                                                ? "bg-[#7f13ec]/10 border-[#7f13ec]/30 text-white"
                                                : "bg-white/[0.02] border-white/[0.05] text-zinc-500 hover:bg-white/[0.04]"
                                                }`}
                                        >
                                            <Icon size={16} className={isActive ? "text-[#a855f7]" : ""} />
                                            <span className="text-xs font-bold uppercase tracking-widest leading-none">{tab.label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Content Area */}
                        <div className="p-8 flex-1 overflow-y-auto">
                            <AnimatePresence mode="wait">
                                {currentTab === "biometrics" && (
                                    <motion.div
                                        key="biometrics"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="grid grid-cols-1 md:grid-cols-2 gap-6"
                                    >
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Weight (kg)</label>
                                            <div className="relative">
                                                <Scale className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={18} />
                                                <input
                                                    type="number"
                                                    placeholder="70"
                                                    className="w-full bg-white/[0.03] border border-white/[0.08] rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-[#7f13ec]/50 transition-colors"
                                                    value={formData.weight}
                                                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Height (cm)</label>
                                            <div className="relative">
                                                <Ruler className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={18} />
                                                <input
                                                    type="number"
                                                    placeholder="175"
                                                    className="w-full bg-white/[0.03] border border-white/[0.08] rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-[#7f13ec]/50 transition-colors"
                                                    value={formData.height}
                                                    onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Age</label>
                                            <div className="relative">
                                                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={18} />
                                                <input
                                                    type="number"
                                                    placeholder="30"
                                                    className="w-full bg-white/[0.03] border border-white/[0.08] rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-[#7f13ec]/50 transition-colors"
                                                    value={formData.age}
                                                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Resting Heart Rate (BPM)</label>
                                            <div className="relative">
                                                <Activity className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={18} />
                                                <input
                                                    type="number"
                                                    placeholder="55"
                                                    className="w-full bg-white/[0.03] border border-white/[0.08] rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-[#7f13ec]/50 transition-colors"
                                                    value={formData.restingHR}
                                                    onChange={(e) => setFormData({ ...formData, restingHR: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {currentTab === "goals" && (
                                    <motion.div
                                        key="goals"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="space-y-6"
                                    >
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Select Race Goal</label>
                                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                                {["5K", "10K", "Half", "Marathon"].map((race) => (
                                                    <button
                                                        key={race}
                                                        onClick={() => setFormData({ ...formData, targetRace: race.toLowerCase() })}
                                                        className={`py-6 rounded-2xl border flex flex-col items-center gap-2 transition-all ${formData.targetRace === race.toLowerCase()
                                                            ? "bg-[#7f13ec]/10 border-[#7f13ec]/40 text-white"
                                                            : "bg-white/[0.02] border-white/[0.08] text-zinc-500 hover:border-white/20"
                                                            }`}
                                                    >
                                                        <span className="text-lg font-black tracking-tighter">{race}</span>
                                                        <span className="text-[8px] font-bold uppercase tracking-widest opacity-60">Distance</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Race Date</label>
                                                <input
                                                    type="date"
                                                    className="w-full bg-white/[0.03] border border-white/[0.08] rounded-2xl py-4 px-4 text-white focus:outline-none focus:border-[#7f13ec]/50 transition-colors [color-scheme:dark]"
                                                    value={formData.raceDate}
                                                    onChange={(e) => setFormData({ ...formData, raceDate: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Target Time (Optional)</label>
                                                <div className="relative">
                                                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={18} />
                                                    <input
                                                        type="text"
                                                        placeholder="hh:mm:ss"
                                                        className="w-full bg-white/[0.03] border border-white/[0.08] rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-[#7f13ec]/50 transition-colors"
                                                        value={formData.targetTime}
                                                        onChange={(e) => setFormData({ ...formData, targetTime: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {currentTab === "preferences" && (
                                    <motion.div
                                        key="preferences"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="space-y-8"
                                    >
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Weekly Availability</label>
                                            <div className="flex flex-wrap gap-2">
                                                {days.map((day) => {
                                                    const isSelected = formData.daysPerWeek.includes(day);
                                                    return (
                                                        <button
                                                            key={day}
                                                            onClick={() => {
                                                                const newDays = isSelected
                                                                    ? formData.daysPerWeek.filter(d => d !== day)
                                                                    : [...formData.daysPerWeek, day];
                                                                setFormData({ ...formData, daysPerWeek: newDays });
                                                            }}
                                                            className={`w-12 h-12 rounded-xl border flex items-center justify-center text-xs font-bold transition-all ${isSelected
                                                                ? "bg-[#7f13ec] border-[#7f13ec] text-white shadow-lg shadow-[#7f13ec]/20"
                                                                : "bg-white/[0.02] border-white/[0.08] text-zinc-600 hover:border-white/20"
                                                                }`}
                                                        >
                                                            {day.substring(0, 1)}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Preferred Long Run Day</label>
                                                <select
                                                    className="w-full bg-[#1a1228] border border-white/[0.08] rounded-2xl py-4 px-4 text-white focus:outline-none focus:border-[#7f13ec]/50 transition-colors appearance-none"
                                                    value={formData.longRunDay}
                                                    onChange={(e) => setFormData({ ...formData, longRunDay: e.target.value })}
                                                >
                                                    {days.map(d => <option key={d} value={d}>{d}</option>)}
                                                </select>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Terrain Focus</label>
                                                <div className="flex gap-2">
                                                    {['Road', 'Trail', 'Mixed'].map(t => (
                                                        <button
                                                            key={t}
                                                            onClick={() => setFormData({ ...formData, terrain: t.toLowerCase() })}
                                                            className={`flex-1 py-3 rounded-xl border text-[10px] font-bold uppercase tracking-tight transition-all ${formData.terrain === t.toLowerCase()
                                                                ? "bg-[#7f13ec]/20 border-[#7f13ec]/40 text-white"
                                                                : "bg-white/[0.02] border-white/[0.08] text-zinc-600"
                                                                }`}
                                                        >
                                                            {t}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {currentTab === "preview" && (
                                    <motion.div
                                        key="preview"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="h-full flex flex-col"
                                    >
                                        {isLoading ? (
                                            <div className="flex-1 flex flex-col items-center justify-center gap-4 py-20">
                                                <div className="relative">
                                                    <div className="w-20 h-20 border-4 border-[#7f13ec]/20 border-t-[#7f13ec] rounded-full animate-spin" />
                                                    <Zap className="absolute inset-0 m-auto text-[#a855f7] animate-pulse" size={32} />
                                                </div>
                                                <div className="text-center">
                                                    <h3 className="text-lg font-bold text-white mb-1">Architecting Your Journey</h3>
                                                    <p className="text-zinc-500 text-sm">Groq AI is analyzing your biometrics and goals...</p>
                                                </div>
                                            </div>
                                        ) : planPreview && planPreview.length > 0 ? (
                                            <div className="space-y-6">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <h3 className="text-lg font-black text-white uppercase tracking-tight">Plan Preview: {Math.ceil(planPreview.length / 7)}-Week Load</h3>
                                                        <p className="text-xs text-[#a855f7] font-bold uppercase tracking-widest">{planPreview.length > 28 ? 'Comprehensive Preparation' : 'Adaptive Focus Block'}</p>
                                                    </div>
                                                    <div className="flex gap-4">
                                                        <div className="text-right">
                                                            <div className="text-[10px] font-bold text-zinc-500 uppercase">Total Mileage</div>
                                                            <div className="text-xl font-black text-white">
                                                                {planPreview.reduce((acc, day) => {
                                                                    const match = day.detail?.match(/([\d.]+)/);
                                                                    return acc + (match ? parseFloat(match[1]) : 0);
                                                                }, 0).toFixed(1)} km
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <div className="text-[10px] font-bold text-zinc-500 uppercase">Est. Intensity</div>
                                                            <div className="text-xl font-black text-white">
                                                                {Math.round(planPreview.length * 15)} <span className="text-[10px] text-zinc-500">TSS</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-7 gap-2">
                                                    {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
                                                        <div key={i} className="text-center text-[10px] font-black text-zinc-600 uppercase mb-1">{d}</div>
                                                    ))}
                                                    {planPreview.map((day: any, idx: number) => (
                                                        <div
                                                            key={idx}
                                                            className={`aspect-square rounded-xl border p-2 flex flex-col justify-between transition-all hover:scale-105 cursor-default ${day.workout_type === 'rest'
                                                                ? "bg-black/40 border-white/[0.03] opacity-40"
                                                                : day.workout_type === 'long'
                                                                    ? "bg-[#7f13ec]/20 border-[#7f13ec]/40 shadow-lg shadow-[#7f13ec]/10"
                                                                    : "bg-white/[0.03] border-white/[0.08]"
                                                                }`}
                                                        >
                                                            <div className="text-[8px] font-black text-zinc-500">{day.day_number}</div>
                                                            <div className="flex flex-col items-center flex-1 justify-center gap-1">
                                                                <span className={`text-[10px] font-black leading-none text-center ${day.workout_type === 'long' ? 'text-white' : 'text-zinc-300'}`}>
                                                                    {day.label}
                                                                </span>
                                                                <span className="text-[8px] font-bold text-zinc-500">{day.detail}</span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>

                                                <div className="bg-[#7f13ec]/5 border border-[#7f13ec]/20 rounded-2xl p-4 flex gap-4 items-start">
                                                    <div className="w-8 h-8 rounded-lg bg-[#7f13ec]/20 flex items-center justify-center flex-shrink-0">
                                                        <Activity size={16} className="text-[#a855f7]" />
                                                    </div>
                                                    <div>
                                                        <h4 className="text-xs font-black text-[#a855f7] uppercase tracking-wider mb-1">Coach&apos;s Strategy</h4>
                                                        <p className="text-xs text-zinc-400 leading-relaxed italic">
                                                            &quot;{coachInsight || "This plan focuses on progressive overload and specific training zones tailored to your profile."}&quot;
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex-1 flex flex-col items-center justify-center py-20 text-center">
                                                <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-6 mx-auto">
                                                    <X size={32} className="text-red-500" />
                                                </div>
                                                <h3 className="text-lg font-bold text-white mb-2 uppercase">Execution Paused</h3>
                                                <p className="text-zinc-500 text-sm max-w-sm mx-auto mb-8 leading-relaxed">
                                                    {genError || "The AI architect encountered an issue while generating your block. This can happen due to API timeouts or schema mismatches."}
                                                </p>
                                                <button
                                                    onClick={handleGenerate}
                                                    className="px-8 py-3 rounded-2xl bg-white/[0.05] border border-white/10 text-[#a855f7] font-black uppercase text-xs tracking-widest hover:bg-[#7f13ec] hover:text-white transition-all active:scale-95"
                                                >
                                                    Resubmit Request
                                                </button>
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Footer */}
                        <div className="p-8 border-t border-white/[0.05] bg-black/20 flex items-center justify-between">
                            <button
                                onClick={handleBack}
                                disabled={currentTab === "biometrics" || isLoading || isSaving}
                                className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold transition-all ${currentTab === "biometrics"
                                    ? "opacity-0 pointer-events-none"
                                    : "text-zinc-400 hover:text-white hover:bg-white/5 disabled:opacity-50"
                                    }`}
                            >
                                <ChevronLeft size={18} /> Back
                            </button>

                            {currentTab === "preview" ? (
                                <button
                                    onClick={handleSave}
                                    disabled={!planPreview || isLoading || isSaving}
                                    className="flex items-center gap-2 px-8 py-3 rounded-2xl bg-[#7f13ec] text-white text-sm font-black uppercase tracking-widest shadow-xl shadow-[#7f13ec]/25 hover:bg-[#a855f7] transition-all active:scale-95 disabled:opacity-50"
                                >
                                    {isSaving ? (
                                        <>
                                            <Loader2 size={18} className="animate-spin" /> Saving...
                                        </>
                                    ) : (
                                        <>
                                            Accept & Activate <CheckCircle2 size={18} />
                                        </>
                                    )}
                                </button>
                            ) : currentTab === "preferences" ? (
                                <button
                                    onClick={handleGenerate}
                                    disabled={isLoading}
                                    className="flex items-center gap-2 px-8 py-3 rounded-2xl bg-gradient-to-r from-[#7f13ec] to-[#a855f7] text-white text-sm font-black uppercase tracking-widest shadow-xl shadow-[#7f13ec]/25 hover:shadow-[#7f13ec]/40 transition-all active:scale-95 disabled:opacity-50"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 size={18} className="animate-spin" /> Architecting...
                                        </>
                                    ) : (
                                        <>
                                            Generate Preview <Zap size={18} />
                                        </>
                                    )}
                                </button>
                            ) : (
                                <button
                                    onClick={handleNext}
                                    className="flex items-center gap-2 px-8 py-3 rounded-2xl bg-white text-black text-sm font-bold hover:bg-zinc-200 transition-all active:scale-95"
                                >
                                    Next Step <ChevronRight size={18} />
                                </button>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
