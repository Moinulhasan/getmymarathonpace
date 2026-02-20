"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
    Pencil,
    Share2,
    Trophy,
    User,
    Shield,
    TrendingUp,
    Clock,
    Flame,
    CheckCircle2,
    Loader2,
    Save,
    X,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import {
    apiGetProfile,
    apiUpdateProfile,
    apiUpdateBiometrics,
    apiChangePassword,
    apiUpdatePersonalBests,
    apiStravaConnect,
    apiStravaDisconnect,
    apiStravaSync,
    UserProfile,
    PersonalBest,
} from "@/lib/api";

// ─── Default Personal Bests Template ──────────────────────────
const defaultPBs: PersonalBest[] = [
    { distance: "5K", time: "", date_achieved: "" },
    { distance: "10K", time: "", date_achieved: "" },
    { distance: "HALF", time: "", date_achieved: "" },
    { distance: "FULL", time: "", date_achieved: "" },
    { distance: "ULTRA", time: "", date_achieved: "" },
];

// ─── Time & Date Selector Helpers ──────────────────────────────
const MONTHS_MAP: Record<string, string> = { "01": "JAN", "02": "FEB", "03": "MAR", "04": "APR", "05": "MAY", "06": "JUN", "07": "JUL", "08": "AUG", "09": "SEP", "10": "OCT", "11": "NOV", "12": "DEC" };
const MONTHS_REV: Record<string, string> = Object.fromEntries(Object.entries(MONTHS_MAP).map(([k, v]) => [v, k]));
const HOURS = Array.from({ length: 13 }, (_, i) => i.toString());
const MINS_SECS = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, "0"));

function parseTime(timeStr: string): { h: string; m: string; s: string } {
    if (!timeStr) return { h: "", m: "", s: "" };
    const parts = timeStr.split(":");
    if (parts.length === 3) return { h: parts[0], m: parts[1], s: parts[2] };
    if (parts.length === 2) return { h: "0", m: parts[0], s: parts[1] };
    return { h: "", m: "", s: "" };
}

function buildTime(h: string, m: string, s: string): string {
    if (!h && !m && !s) return "";
    return `${h || "0"}:${(m || "00").padStart(2, "0")}:${(s || "00").padStart(2, "0")}`;
}

// Convert "MMM YYYY" (stored) → "YYYY-MM" (for input type=month)
function dateToMonthInput(dateStr: string): string {
    if (!dateStr) return "";
    const parts = dateStr.trim().split(" ");
    if (parts.length === 2) {
        const mm = MONTHS_REV[parts[0].toUpperCase()];
        if (mm) return `${parts[1]}-${mm}`;
    }
    return "";
}

// Convert "YYYY-MM" (from input) → "MMM YYYY" (for storage)
function monthInputToDate(val: string): string {
    if (!val) return "";
    const [year, mm] = val.split("-");
    const month = MONTHS_MAP[mm];
    return month ? `${month} ${year}` : "";
}

const selectClass = "h-9 px-2 rounded-md bg-white/[0.06] border border-white/[0.08] text-white text-xs focus:outline-none focus:border-[#7f13ec]/60 focus:ring-1 focus:ring-[#7f13ec]/20 transition-all appearance-none cursor-pointer shadow-inner shadow-black/20";

export default function ProfilePage() {
    const { user: authUser } = useAuth();

    // ─── State ────────────────────────────────────────────────
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [personalBests, setPersonalBests] = useState<PersonalBest[]>(defaultPBs);
    const [isLoading, setIsLoading] = useState(true);

    // Editable fields
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [editName, setEditName] = useState("");
    const [editBio, setEditBio] = useState("");

    // Biometrics
    const [weight, setWeight] = useState("");
    const [height, setHeight] = useState("");
    const [age, setAge] = useState("");

    // Password
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // Saving states
    const [savingBio, setSavingBio] = useState(false);
    const [savingBiometrics, setSavingBiometrics] = useState(false);
    const [savingPassword, setSavingPassword] = useState(false);
    const [savingPBs, setSavingPBs] = useState(false);

    // Messages
    const [bioMsg, setBioMsg] = useState("");
    const [bioErr, setBioErr] = useState("");
    const [bioMetricsMsg, setBioMetricsMsg] = useState("");
    const [bioMetricsErr, setBioMetricsErr] = useState("");
    const [pwdMsg, setPwdMsg] = useState("");
    const [pwdErr, setPwdErr] = useState("");
    const [pbMsg, setPbMsg] = useState("");
    const [pbErr, setPbErr] = useState("");
    const [stravaMsg, setStravaMsg] = useState("");
    const [stravaErr, setStravaErr] = useState("");
    const [connectingStrava, setConnectingStrava] = useState(false);
    const [syncingStrava, setSyncingStrava] = useState(false);
    const [disconnectingStrava, setDisconnectingStrava] = useState(false);

    // ─── Fetch Profile ────────────────────────────────────────
    const fetchProfile = useCallback(async () => {
        try {
            const res = await apiGetProfile();
            setProfile(res.profile);

            // Merge server PBs with template
            const serverPBs = res.personal_bests;
            const merged = defaultPBs.map((d) => {
                const found = serverPBs.find((s) => s.distance === d.distance);
                return found || d;
            });
            setPersonalBests(merged);

            // Initialize editable fields
            setEditName(res.profile.name || "");
            setEditBio(res.profile.bio || "");
            setWeight(res.profile.weight?.toString() || "");
            setHeight(res.profile.height?.toString() || "");
            setAge(res.profile.age?.toString() || "");
        } catch {
            // Profile fetch failed — user may need to re-authenticate
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Auto-dismiss messages after 5 seconds
    const timersRef = useRef<Map<string, NodeJS.Timeout>>(new Map());
    const autoHide = useCallback((setter: React.Dispatch<React.SetStateAction<string>>) => {
        const key = setter.toString();
        const existing = timersRef.current.get(key);
        if (existing) clearTimeout(existing);
        const timer = setTimeout(() => { setter(""); timersRef.current.delete(key); }, 5000);
        timersRef.current.set(key, timer);
    }, []);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    // ─── Handlers ─────────────────────────────────────────────
    const handleSaveProfile = async () => {
        setSavingBio(true);
        setBioMsg("");
        setBioErr("");
        try {
            const res = await apiUpdateProfile({ name: editName, bio: editBio });
            setBioMsg(res.message);
            setProfile((p) => p ? { ...p, name: editName, bio: editBio } : p);
            setIsEditingProfile(false);
            autoHide(setBioMsg);
        } catch (err: unknown) {
            const e = err as { data?: { message?: string }; message?: string };
            setBioErr(e.data?.message || e.message || "Update failed.");
            autoHide(setBioErr);
        } finally {
            setSavingBio(false);
        }
    };

    const handleUpdateBiometrics = async () => {
        setSavingBiometrics(true);
        setBioMetricsMsg("");
        setBioMetricsErr("");
        try {
            const res = await apiUpdateBiometrics({
                weight: weight ? parseFloat(weight) : null,
                height: height ? parseFloat(height) : null,
                age: age ? parseInt(age) : null,
            });
            setBioMetricsMsg(res.message);
            setProfile((p) =>
                p
                    ? {
                        ...p,
                        weight: res.biometrics.weight,
                        height: res.biometrics.height,
                        age: res.biometrics.age,
                    }
                    : p
            );
            autoHide(setBioMetricsMsg);
        } catch (err: unknown) {
            const e = err as { data?: { message?: string }; message?: string };
            setBioMetricsErr(e.data?.message || e.message || "Update failed.");
            autoHide(setBioMetricsErr);
        } finally {
            setSavingBiometrics(false);
        }
    };

    const handleChangePassword = async () => {
        setPwdMsg("");
        setPwdErr("");
        if (newPassword !== confirmPassword) {
            setPwdErr("Passwords do not match.");
            return;
        }
        setSavingPassword(true);
        try {
            const res = await apiChangePassword({
                current_password: currentPassword,
                new_password: newPassword,
                new_password_confirmation: confirmPassword,
            });
            setPwdMsg(res.message);
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
            autoHide(setPwdMsg);
        } catch (err: unknown) {
            const e = err as { data?: { message?: string }; message?: string };
            setPwdErr(e.data?.message || e.message || "Password change failed.");
            autoHide(setPwdErr);
        } finally {
            setSavingPassword(false);
        }
    };

    const handleSavePersonalBests = async () => {
        setSavingPBs(true);
        setPbMsg("");
        setPbErr("");
        const filledPBs = personalBests
            .filter((pb) => pb.time && pb.date_achieved)
            .map(({ distance, time, date_achieved }) => ({ distance, time, date_achieved }));
        if (filledPBs.length === 0) {
            setPbErr("Please fill in at least one personal best.");
            setSavingPBs(false);
            autoHide(setPbErr);
            return;
        }
        try {
            const res = await apiUpdatePersonalBests(filledPBs);
            setPbMsg(res.message);
            autoHide(setPbMsg);
            // Re-fetch profile to get the definitive server state
            await fetchProfile();
        } catch (err: unknown) {
            const e = err as { data?: { message?: string }; message?: string };
            setPbErr(e.data?.message || e.message || "Save failed.");
            autoHide(setPbErr);
        } finally {
            setSavingPBs(false);
        }
    };

    const updatePB = (index: number, field: "time" | "date_achieved", value: string) => {
        setPersonalBests((prev) => {
            const updated = [...prev];
            updated[index] = { ...updated[index], [field]: value };
            return updated;
        });
    };

    // ─── Derived values ───────────────────────────────────────
    const displayName = profile?.name || authUser?.name || "User";
    const initials = displayName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    const memberSince = profile?.member_since || "—";

    const bottomStats = [
        {
            icon: TrendingUp,
            value: `${((profile?.total_distance || 0) / 1000).toFixed(0) === "0" ? (profile?.total_distance || 0).toLocaleString() : ((profile?.total_distance || 0)).toLocaleString()} km`,
            label: "Total Distance",
            color: "text-[#a855f7]",
            bg: "bg-[#7f13ec]/15",
        },
        {
            icon: Clock,
            value: `${(profile?.training_hours || 0).toLocaleString()} hrs`,
            label: "Active Training Time",
            color: "text-orange-400",
            bg: "bg-orange-500/15",
        },
        {
            icon: Flame,
            value: `${((profile?.calories_per_week || 0) / 1000).toFixed(1)}k`,
            label: "Calories Burned AVG/Week",
            color: "text-green-400",
            bg: "bg-green-500/15",
        },
    ];

    // ─── Loading ──────────────────────────────────────────────
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 size={32} className="animate-spin text-[#a855f7]" />
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            {/* ── Profile Header Card ── */}
            <div className="glass-card p-5 sm:p-6 flex flex-col sm:flex-row items-center sm:items-start gap-5">
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-[#7f13ec] via-purple-500 to-pink-500 p-[3px]">
                        <div className="w-full h-full rounded-full bg-[#1a1025] flex items-center justify-center overflow-hidden">
                            <span className="text-3xl sm:text-4xl font-bold text-white">
                                {initials}
                            </span>
                        </div>
                    </div>
                    <div className="absolute bottom-1 right-1 w-6 h-6 rounded-full bg-[#7f13ec] border-2 border-[#1a1025] flex items-center justify-center">
                        <CheckCircle2 size={12} className="text-white" />
                    </div>
                </div>

                {/* Info */}
                <div className="flex-1 text-center sm:text-left">
                    {isEditingProfile ? (
                        <div className="space-y-3 mb-4">
                            <div>
                                <label className="block text-[10px] font-semibold uppercase tracking-wider text-zinc-500 mb-1">Name</label>
                                <input
                                    type="text"
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                    className="w-full max-w-sm h-10 px-3 rounded-xl bg-white/[0.05] border border-white/10 text-white text-sm focus:outline-none focus:border-[#7f13ec]/50 focus:ring-1 focus:ring-[#7f13ec]/30 transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-semibold uppercase tracking-wider text-zinc-500 mb-1">Bio</label>
                                <textarea
                                    value={editBio}
                                    onChange={(e) => setEditBio(e.target.value)}
                                    rows={2}
                                    maxLength={500}
                                    className="w-full max-w-lg px-3 py-2 rounded-xl bg-white/[0.05] border border-white/10 text-white text-sm focus:outline-none focus:border-[#7f13ec]/50 focus:ring-1 focus:ring-[#7f13ec]/30 transition-all resize-none"
                                />
                            </div>
                            {bioErr && <p className="text-red-400 text-xs">{bioErr}</p>}
                            {bioMsg && <p className="text-green-400 text-xs">{bioMsg}</p>}
                            <div className="flex gap-2">
                                <button
                                    onClick={handleSaveProfile}
                                    disabled={savingBio}
                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#7f13ec] text-white text-sm font-semibold hover:bg-[#6d0fcf] transition-colors cursor-pointer disabled:opacity-50"
                                >
                                    {savingBio ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                                    Save
                                </button>
                                <button
                                    onClick={() => {
                                        setIsEditingProfile(false);
                                        setEditName(profile?.name || "");
                                        setEditBio(profile?.bio || "");
                                    }}
                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.06] border border-white/10 text-white text-sm font-semibold hover:bg-white/10 transition-all cursor-pointer"
                                >
                                    <X size={14} />
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                                <h1 className="text-2xl font-bold text-white">{displayName}</h1>
                                <span className="inline-flex self-center sm:self-auto items-center px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-[#a855f7] border border-[#a855f7]/40 bg-[#7f13ec]/10">
                                    {profile?.badge || "Beginner"}
                                </span>
                            </div>
                            <p className="text-sm text-zinc-400 leading-relaxed mb-4 max-w-lg">
                                {profile?.bio || "No bio yet. Click Edit Profile to add one."}
                                {" "}Member since {memberSince}.
                            </p>
                            <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                                <button
                                    onClick={() => setIsEditingProfile(true)}
                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#7f13ec] text-white text-sm font-semibold hover:bg-[#6d0fcf] transition-colors cursor-pointer"
                                >
                                    <Pencil size={14} />
                                    Edit Profile
                                </button>
                                <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.06] border border-white/10 text-white text-sm font-semibold hover:bg-white/10 transition-all cursor-pointer">
                                    <Share2 size={14} />
                                    Share Stats
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* ── Personal Bests ── */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <Trophy size={18} className="text-[#a855f7]" />
                        <h2 className="text-lg font-bold text-white">Personal Bests</h2>
                    </div>
                    <button
                        onClick={handleSavePersonalBests}
                        disabled={savingPBs}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#7f13ec]/15 text-[#a855f7] text-xs font-semibold hover:bg-[#7f13ec]/25 transition-colors cursor-pointer disabled:opacity-50"
                    >
                        {savingPBs ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
                        Save PBs
                    </button>
                </div>
                {pbErr && <p className="text-red-400 text-xs mb-2">{pbErr}</p>}
                {pbMsg && <p className="text-green-400 text-xs mb-2">{pbMsg}</p>}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                    {personalBests.map((pb, i) => {
                        const t = parseTime(pb.time);
                        return (
                            <div
                                key={pb.distance}
                                className="glass-card p-4 border-t-2 border-t-[#7f13ec]/40"
                            >
                                <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 mb-2">
                                    {pb.distance}
                                </p>
                                {/* Time Selector: H : MM : SS */}
                                <div className="flex items-center gap-0.5 mb-2">
                                    <select
                                        value={t.h}
                                        onChange={(e) => updatePB(i, "time", buildTime(e.target.value, t.m, t.s))}
                                        className={`${selectClass} w-[38px]`}
                                    >
                                        <option value="" className="bg-zinc-900">H</option>
                                        {HOURS.map((v) => <option key={v} value={v} className="bg-zinc-900">{v}</option>)}
                                    </select>
                                    <span className="text-zinc-500 text-xs font-bold">:</span>
                                    <select
                                        value={t.m}
                                        onChange={(e) => updatePB(i, "time", buildTime(t.h, e.target.value, t.s))}
                                        className={`${selectClass} w-[44px]`}
                                    >
                                        <option value="" className="bg-zinc-900">MM</option>
                                        {MINS_SECS.map((v) => <option key={v} value={v} className="bg-zinc-900">{v}</option>)}
                                    </select>
                                    <span className="text-zinc-500 text-xs font-bold">:</span>
                                    <select
                                        value={t.s}
                                        onChange={(e) => updatePB(i, "time", buildTime(t.h, t.m, e.target.value))}
                                        className={`${selectClass} w-[44px]`}
                                    >
                                        <option value="" className="bg-zinc-900">SS</option>
                                        {MINS_SECS.map((v) => <option key={v} value={v} className="bg-zinc-900">{v}</option>)}
                                    </select>
                                </div>
                                {/* Date Selector: Calendar month picker */}
                                <input
                                    type="month"
                                    value={dateToMonthInput(pb.date_achieved)}
                                    onChange={(e) => updatePB(i, "date_achieved", monthInputToDate(e.target.value))}
                                    max={`${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}`}
                                    className={`${selectClass} w-full`}
                                />
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* ── Basic Details + Account Security ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* Basic Details */}
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <User size={18} className="text-[#a855f7]" />
                        <h2 className="text-lg font-bold text-white">Basic Details</h2>
                    </div>
                    <div className="glass-card p-5 space-y-4">
                        {bioMetricsErr && <p className="text-red-400 text-xs">{bioMetricsErr}</p>}
                        {bioMetricsMsg && <p className="text-green-400 text-xs">{bioMetricsMsg}</p>}
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-[10px] font-semibold uppercase tracking-wider text-zinc-500 mb-1.5">
                                    Weight (KG)
                                </label>
                                <input
                                    type="text"
                                    value={weight}
                                    onChange={(e) => setWeight(e.target.value)}
                                    placeholder="e.g. 68"
                                    className="w-full h-11 px-4 rounded-xl bg-white/[0.05] border border-white/10 text-white text-sm focus:outline-none focus:border-[#7f13ec]/50 focus:ring-1 focus:ring-[#7f13ec]/30 transition-all placeholder:text-zinc-600"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-semibold uppercase tracking-wider text-zinc-500 mb-1.5">
                                    Height (CM)
                                </label>
                                <input
                                    type="text"
                                    value={height}
                                    onChange={(e) => setHeight(e.target.value)}
                                    placeholder="e.g. 178"
                                    className="w-full h-11 px-4 rounded-xl bg-white/[0.05] border border-white/10 text-white text-sm focus:outline-none focus:border-[#7f13ec]/50 focus:ring-1 focus:ring-[#7f13ec]/30 transition-all placeholder:text-zinc-600"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-[10px] font-semibold uppercase tracking-wider text-zinc-500 mb-1.5">
                                Age
                            </label>
                            <input
                                type="text"
                                value={age}
                                onChange={(e) => setAge(e.target.value)}
                                placeholder="e.g. 28"
                                className="w-full h-11 px-4 rounded-xl bg-white/[0.05] border border-white/10 text-white text-sm focus:outline-none focus:border-[#7f13ec]/50 focus:ring-1 focus:ring-[#7f13ec]/30 transition-all placeholder:text-zinc-600"
                            />
                        </div>
                        <button
                            onClick={handleUpdateBiometrics}
                            disabled={savingBiometrics}
                            className="w-full h-11 rounded-xl bg-gradient-to-r from-[#7f13ec] to-[#a855f7] text-white font-semibold text-sm shadow-lg shadow-[#7f13ec]/25 hover:shadow-[#7f13ec]/40 transition-shadow cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {savingBiometrics ? <Loader2 size={16} className="animate-spin" /> : null}
                            Update Biometrics
                        </button>
                    </div>
                </div>

                {/* Account Security */}
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <Shield size={18} className="text-orange-400" />
                        <h2 className="text-lg font-bold text-white">Account Security</h2>
                    </div>
                    <div className="glass-card p-5 space-y-4">
                        {pwdErr && <p className="text-red-400 text-xs">{pwdErr}</p>}
                        {pwdMsg && <p className="text-green-400 text-xs">{pwdMsg}</p>}
                        <div>
                            <label className="block text-[10px] font-semibold uppercase tracking-wider text-zinc-500 mb-1.5">
                                Current Password
                            </label>
                            <input
                                type="password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                placeholder="Enter current password"
                                className="w-full h-11 px-4 rounded-xl bg-white/[0.05] border border-white/10 text-white text-sm focus:outline-none focus:border-[#7f13ec]/50 focus:ring-1 focus:ring-[#7f13ec]/30 transition-all placeholder:text-zinc-600"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-semibold uppercase tracking-wider text-zinc-500 mb-1.5">
                                New Password
                            </label>
                            <input
                                type="password"
                                placeholder="Min. 8 characters"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full h-11 px-4 rounded-xl bg-white/[0.05] border border-white/10 text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-[#7f13ec]/50 focus:ring-1 focus:ring-[#7f13ec]/30 transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-semibold uppercase tracking-wider text-zinc-500 mb-1.5">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                placeholder="Repeat new password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full h-11 px-4 rounded-xl bg-white/[0.05] border border-white/10 text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-[#7f13ec]/50 focus:ring-1 focus:ring-[#7f13ec]/30 transition-all"
                            />
                        </div>
                        <button
                            onClick={handleChangePassword}
                            disabled={savingPassword}
                            className="w-full h-11 rounded-xl bg-white/[0.06] border border-white/10 text-white font-semibold text-sm hover:bg-white/10 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {savingPassword ? <Loader2 size={16} className="animate-spin" /> : null}
                            Change Password
                        </button>
                    </div>
                </div>
            </div>

            {/* ── Strava Connection ── */}
            <div className="glass-card p-5">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#FC4C02]/15 flex items-center justify-center flex-shrink-0">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066l-2.084 4.116z" fill="#FC4C02" />
                                <path d="M10.233 13.828L7.143 7.5H3.078l7.155 14.088 1.991-3.928-2.07-3.832h3.158l-3.079-6.328" fill="#FC4C02" opacity="0.6" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-white">Strava</h2>
                            <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                                {profile?.strava_connected ? "Connected" : "Not Connected"}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {profile?.strava_connected ? (
                            <>
                                <button
                                    onClick={async () => {
                                        setSyncingStrava(true);
                                        setStravaMsg("");
                                        setStravaErr("");
                                        try {
                                            const res = await apiStravaSync();
                                            setStravaMsg(res.message);
                                            autoHide(setStravaMsg);
                                            await fetchProfile();
                                        } catch (err: unknown) {
                                            const e = err as { data?: { message?: string }; message?: string };
                                            setStravaErr(e.data?.message || e.message || "Sync failed.");
                                            autoHide(setStravaErr);
                                        } finally {
                                            setSyncingStrava(false);
                                        }
                                    }}
                                    disabled={syncingStrava}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FC4C02]/15 text-[#FC4C02] text-xs font-semibold hover:bg-[#FC4C02]/25 transition-colors cursor-pointer disabled:opacity-50"
                                >
                                    {syncingStrava ? <Loader2 size={12} className="animate-spin" /> : <TrendingUp size={12} />}
                                    Sync Stats
                                </button>
                                <button
                                    onClick={async () => {
                                        setDisconnectingStrava(true);
                                        setStravaMsg("");
                                        setStravaErr("");
                                        try {
                                            const res = await apiStravaDisconnect();
                                            setStravaMsg(res.message);
                                            autoHide(setStravaMsg);
                                            await fetchProfile();
                                        } catch (err: unknown) {
                                            const e = err as { data?: { message?: string }; message?: string };
                                            setStravaErr(e.data?.message || e.message || "Disconnect failed.");
                                            autoHide(setStravaErr);
                                        } finally {
                                            setDisconnectingStrava(false);
                                        }
                                    }}
                                    disabled={disconnectingStrava}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.06] border border-white/10 text-zinc-400 text-xs font-semibold hover:bg-white/10 transition-all cursor-pointer disabled:opacity-50"
                                >
                                    {disconnectingStrava ? <Loader2 size={12} className="animate-spin" /> : <X size={12} />}
                                    Disconnect
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={async () => {
                                    setConnectingStrava(true);
                                    setStravaErr("");
                                    try {
                                        const res = await apiStravaConnect();
                                        window.location.href = res.url;
                                    } catch (err: unknown) {
                                        const e = err as { data?: { message?: string }; message?: string };
                                        setStravaErr(e.data?.message || e.message || "Failed to connect.");
                                        autoHide(setStravaErr);
                                        setConnectingStrava(false);
                                    }
                                }}
                                disabled={connectingStrava}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FC4C02] text-white text-sm font-semibold hover:bg-[#e04400] transition-colors cursor-pointer disabled:opacity-50"
                            >
                                {connectingStrava ? <Loader2 size={14} className="animate-spin" /> : (
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                        <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066l-2.084 4.116z" fill="#fff" />
                                        <path d="M10.233 13.828L7.143 7.5H3.078l7.155 14.088 1.991-3.928-2.07-3.832h3.158l-3.079-6.328" fill="#fff" opacity="0.6" />
                                    </svg>
                                )}
                                Connect Strava
                            </button>
                        )}
                    </div>
                </div>
                {stravaErr && <p className="text-red-400 text-xs">{stravaErr}</p>}
                {stravaMsg && <p className="text-green-400 text-xs">{stravaMsg}</p>}
                {profile?.strava_connected && (
                    <p className="text-zinc-500 text-xs mt-1">
                        Athlete ID: {profile.strava_athlete_id} • Your running stats are synced from Strava
                    </p>
                )}
                {!profile?.strava_connected && (
                    <p className="text-zinc-500 text-xs">
                        Connect your Strava account to automatically sync your running stats, total distance, and training hours.
                    </p>
                )}
            </div>

            {/* ── Bottom Stats ── */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {bottomStats.map((s) => {
                    const Icon = s.icon;
                    return (
                        <div key={s.label} className="glass-card p-4 flex items-center gap-4">
                            <div
                                className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center flex-shrink-0`}
                            >
                                <Icon size={18} className={s.color} />
                            </div>
                            <div className="min-w-0">
                                <p className="text-lg font-bold text-white">{s.value}</p>
                                <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 truncate">
                                    {s.label}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
