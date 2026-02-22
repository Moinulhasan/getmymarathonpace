"use client";

import { useState, useEffect, useMemo } from "react";
import {
    Map as MapIcon,
    Unplug,
    ChevronRight,
    Zap,
    Navigation,
    ArrowUpRight,
    Info,
    Loader2,
    MapPin,
    Calendar,
    Route as RouteIcon,
    Search,
    Plus,
    Minus,
    Layers,
    Mountain,
    Clock,
    Activity,
    TrendingUp
} from "lucide-react";
import { apiGetStravaRoutes, apiStravaConnect } from "@/lib/api";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface StravaRoute {
    id: number;
    name: string;
    description: string;
    distance: number;
    elevation_gain: number;
    map_urls: {
        url: string;
        retina_url: string;
    };
    type: number; // 1 for run, 2 for ride
    sub_type: number;
    created_at: string;
    updated_at: string;
}

export default function RoutesPage() {
    const [routes, setRoutes] = useState<StravaRoute[]>([]);
    const [selectedRoute, setSelectedRoute] = useState<StravaRoute | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isConnecting, setIsConnecting] = useState(false);

    const fetchRoutes = async () => {
        setIsLoading(true);
        try {
            const data = await apiGetStravaRoutes();
            setIsConnected(data.strava_connected);
            if (data.routes && data.routes.length > 0) {
                setRoutes(data.routes);
                setSelectedRoute(data.routes[0]);
            }
        } catch (error) {
            console.error("Failed to fetch routes:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchRoutes();
    }, []);

    const handleConnectStrava = async () => {
        setIsConnecting(true);
        try {
            const { url } = await apiStravaConnect();
            window.location.href = url;
        } catch (error) {
            console.error("Failed to connect Strava:", error);
            setIsConnecting(false);
        }
    };

    const elevationProfileData = useMemo(() => {
        // Mocking an elevation profile based on route elevation gain
        if (!selectedRoute) return [];
        const base = 100;
        const gain = selectedRoute.elevation_gain || 500;
        return Array.from({ length: 40 }, (_, i) => ({
            dist: (i / 39) * (selectedRoute.distance / 1609.34), // miles
            elev: base + Math.sin(i / 5) * (gain / 4) + (i / 40) * gain + Math.random() * 20
        }));
    }, [selectedRoute]);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-[#7f13ec]/20 border-t-[#7f13ec] rounded-full animate-spin" />
                    <Navigation className="absolute inset-0 m-auto text-[#a855f7] animate-pulse" size={24} />
                </div>
                <p className="text-zinc-500 text-sm font-medium animate-pulse uppercase tracking-widest">Scanning Intelligence...</p>
            </div>
        );
    }

    if (!isConnected) {
        return (
            <div className="max-w-4xl mx-auto py-12 px-4 text-center">
                <div className="w-24 h-24 bg-[#ff5722]/10 border border-[#ff5722]/20 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 relative group">
                    <Unplug size={40} className="text-[#ff5722] group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-[#ff5722]/20 rounded-[2.5rem] blur-2xl -z-10 group-hover:bg-[#ff5722]/30 transition-colors" />
                </div>

                <h1 className="text-3xl sm:text-4xl font-black text-white italic uppercase tracking-tighter mb-4">
                    Data Connection Required
                </h1>
                <p className="text-zinc-400 text-base max-w-lg mx-auto mb-10 leading-relaxed font-medium">
                    RunGen AI requires access to your Strava Routes to provide specialized intelligence and personalized training segments.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button
                        onClick={handleConnectStrava}
                        disabled={isConnecting}
                        className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-[#ff5722] hover:bg-[#ff7043] text-white rounded-2xl text-sm font-black uppercase tracking-widest shadow-xl shadow-orange-950/20 transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100"
                    >
                        {isConnecting ? <Loader2 className="animate-spin" size={20} /> : <Unplug size={20} />}
                        Connect Strava
                    </button>
                    <Link
                        href="/dashboard"
                        className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-white text-sm font-black uppercase tracking-widest hover:bg-white/10 transition-all"
                    >
                        Return to Hub
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            {/* Top Grid: Map + Insights */}
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
                {/* Large Map Area */}
                <div className="xl:col-span-3 aspect-[16/10] xl:aspect-auto xl:h-[500px] relative rounded-[2.5rem] overflow-hidden bg-[#0f0916] border border-white/[0.08] group shadow-2xl">
                    {/* Search Bar on Map */}
                    <div className="absolute top-6 left-6 z-20 w-full max-w-xs transition-all duration-500 group-hover:max-w-md">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                            <input
                                type="text"
                                placeholder="Explore local trails..."
                                className="w-full bg-[#1a1228]/90 backdrop-blur-xl border border-white/[0.1] rounded-2xl py-3 pl-12 pr-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#7f13ec]/50 shadow-2xl"
                            />
                        </div>
                    </div>

                    {/* Map Mockup Background */}
                    <div className="absolute inset-0 bg-[#130E1E]">
                        {/* Grid Background */}
                        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

                        {/* Route Line (SVG Mockup) */}
                        <svg className="absolute inset-0 w-full h-full p-20 pointer-events-none" viewBox="0 0 1000 600">
                            <motion.path
                                d="M150,450 Q300,400 450,450 T750,200"
                                fill="none"
                                stroke="#fff"
                                strokeWidth="4"
                                strokeLinecap="round"
                                initial={{ pathLength: 0, opacity: 0 }}
                                animate={{ pathLength: 1, opacity: 0.8 }}
                                transition={{ duration: 2, ease: "easeInOut" }}
                            />
                            <motion.circle
                                cx="150" cy="450" r="6" fill="#fff"
                                initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1 }}
                            />
                            <motion.circle
                                cx="750" cy="200" r="6" fill="#7f13ec"
                                initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 2 }}
                            />
                            {/* Route Label */}
                            <text x="400" y="320" fill="gray" fontSize="12" fontWeight="bold" opacity="0.4">1200 - 800</text>
                        </svg>

                        {/* Map Controls */}
                        <div className="absolute right-6 top-6 flex flex-col gap-3 z-20">
                            <button className="w-10 h-10 rounded-xl bg-[#1a1228]/90 backdrop-blur-md border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-all shadow-xl"><Plus size={20} /></button>
                            <button className="w-10 h-10 rounded-xl bg-[#1a1228]/90 backdrop-blur-md border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-all shadow-xl"><Minus size={20} /></button>
                            <button className="w-10 h-10 rounded-xl bg-[#1a1228]/90 backdrop-blur-md border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-all shadow-xl"><Layers size={18} /></button>
                        </div>
                    </div>
                </div>

                {/* Route Insights Sidebar */}
                <div className="space-y-4">
                    <h3 className="text-[10px] font-black text-[#a855f7] uppercase tracking-[0.2em] mb-4">Route Insights</h3>

                    {/* Total Distance */}
                    <div className="glass-card p-5 border-l-2 border-l-[#7f13ec]/40 bg-gradient-to-br from-[#1a1228] to-[#0f0916]">
                        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Total Distance</p>
                        <div className="flex items-baseline gap-1.5">
                            <p className="text-2xl font-black text-white italic">{(selectedRoute?.distance ? selectedRoute.distance / 1609.34 : 0).toFixed(1)}</p>
                            <span className="text-xs font-bold text-zinc-500 uppercase">miles</span>
                        </div>
                    </div>

                    {/* Elevation Gain */}
                    <div className="glass-card p-5 border-l-2 border-l-cyan-500/40 bg-gradient-to-br from-[#1a1228] to-[#0f0916]">
                        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Elevation Gain</p>
                        <div className="flex items-baseline gap-1.5 mb-2">
                            <p className="text-2xl font-black text-white italic">{Math.round((selectedRoute?.elevation_gain || 0) * 3.28084).toLocaleString()}</p>
                            <span className="text-xs font-bold text-zinc-500 uppercase">ft</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-green-400 text-[9px] font-black uppercase tracking-widest">
                            <TrendingUp size={10} /> Severe Incline (Grade 4)
                        </div>
                    </div>

                    {/* Surface Type */}
                    <div className="glass-card p-5 border-l-2 border-l-orange-500/40 bg-gradient-to-br from-[#1a1228] to-[#0f0916]">
                        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Surface Type</p>
                        <div className="flex items-center gap-2 text-white">
                            <Mountain className="text-orange-400" size={18} />
                            <p className="text-base font-black italic uppercase tracking-tight">Technical Trail</p>
                        </div>
                    </div>

                    {/* AI Estimated Time */}
                    <div className="relative group perspective-1000">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-[#7f13ec] to-[#a855f7] rounded-[2rem] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                        <div className="relative glass-card p-6 bg-[#0f0916] border-[#7f13ec]/30 flex flex-col justify-between overflow-hidden">
                            <div className="absolute top-4 right-4 text-[#7f13ec]/20"><Activity size={48} className="animate-pulse" /></div>
                            <div>
                                <p className="text-[10px] font-black text-[#a855f7] uppercase tracking-widest mb-2 italic">AI Est. Time</p>
                                <p className="text-3xl font-black text-white italic leading-tight mb-2">2h 45m</p>
                                <p className="text-[10px] text-zinc-500 leading-relaxed font-medium">
                                    Based on your recent 50km training load and current recovery score of 88%.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Middle Section: Elevation Profile */}
            <div className="space-y-6">
                <div className="flex items-end justify-between">
                    <div>
                        <h2 className="text-xl font-black text-white italic uppercase tracking-tighter">Elevation Profile</h2>
                        <p className="text-xs text-zinc-500 font-medium">Real-time grade analysis and terrain difficulty</p>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-[#7f13ec]" />
                            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Ascent</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500" />
                            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Grade %</span>
                        </div>
                    </div>
                </div>

                <div className="glass-card p-8 bg-[#0f0916] border-white/[0.05] relative min-h-[220px]">
                    <svg className="w-full h-40 overflow-visible" viewBox="0 0 1000 160">
                        {/* Area Gradient Definition */}
                        <defs>
                            <linearGradient id="elevGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#7f13ec" stopOpacity="0.6" />
                                <stop offset="100%" stopColor="#7f13ec" stopOpacity="0" />
                            </linearGradient>
                        </defs>

                        {/* The Elevation Path */}
                        <path
                            d={`M 0 160 ${elevationProfileData.map((d, i) => `L ${(i / 39) * 1000} ${140 - ((d.elev - 100) / (selectedRoute?.elevation_gain || 500)) * 100}`).join(' ')} L 1000 160 Z`}
                            fill="url(#elevGradient)"
                        />
                        <path
                            d={`M 0 ${140 - ((elevationProfileData[0]?.elev - 100) / (selectedRoute?.elevation_gain || 500)) * 100} ${elevationProfileData.map((d, i) => `L ${(i / 39) * 1000} ${140 - ((d.elev - 100) / (selectedRoute?.elevation_gain || 500)) * 100}`).join(' ')}`}
                            fill="none"
                            stroke="#7f13ec"
                            strokeWidth="2"
                        />

                        {/* Peak Indicator */}
                        <motion.circle
                            cx="550" cy="85" r="4" fill="#22c55e"
                            initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ repeat: Infinity, duration: 2 }}
                        />

                        {/* Labels */}
                        <line x1="0" y1="160" x2="1000" y2="160" stroke="white" strokeOpacity="0.1" strokeWidth="1" />
                        {["0mi", "3.5mi", "7mi", "10.5mi", `${(selectedRoute?.distance ? selectedRoute.distance / 1609.34 : 0).toFixed(1)}mi`].map((label, i) => (
                            <text key={i} x={i * 250} y="180" textAnchor={i === 4 ? 'end' : i === 0 ? 'start' : 'middle'} fill="gray" fontSize="10" fontWeight="black" textTransform="uppercase">{label}</text>
                        ))}
                    </svg>
                </div>
            </div>

            {/* Bottom Section: Lists */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Routes */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-black text-[#a855f7] uppercase tracking-[0.2em] italic">Recent Routes</h3>
                        <button onClick={fetchRoutes} className="text-[10px] font-bold text-zinc-500 hover:text-white uppercase tracking-widest transition-colors flex items-center gap-1">View All <ChevronRight size={12} /></button>
                    </div>
                    <div className="space-y-3">
                        {routes.slice(0, 3).map((r) => (
                            <button
                                key={r.id}
                                onClick={() => setSelectedRoute(r)}
                                className={`w-full glass-card p-4 flex items-center justify-between hover:bg-white/5 transition-all group border-l-0 ${selectedRoute?.id === r.id ? 'border-[#7f13ec]/40 bg-white/5' : 'border-white/[0.05]'}`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-10 rounded-lg bg-zinc-900 overflow-hidden relative border border-white/5">
                                        <div className="absolute inset-0 bg-[#7f13ec]/20" />
                                        <MapIcon className="absolute inset-0 m-auto text-zinc-700 opacity-30" size={16} />
                                    </div>
                                    <div className="text-left">
                                        <h4 className="text-sm font-black text-white uppercase tracking-tight line-clamp-1">{r.name}</h4>
                                        <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">
                                            {(r.distance / 1609.34).toFixed(1)} miles • {Math.round(r.elevation_gain * 3.28084)} ft gain • 2 days ago
                                        </p>
                                    </div>
                                </div>
                                <ChevronRight className={`text-zinc-700 transition-all ${selectedRoute?.id === r.id ? 'text-[#7f13ec] translate-x-1' : 'group-hover:translate-x-1'}`} size={16} />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Popular Segments */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-black text-[#a855f7] uppercase tracking-[0.2em] italic">Popular Segments</h3>
                        <div className="px-2 py-0.5 rounded bg-[#7f13ec]/20 text-[#a855f7] text-[8px] font-black uppercase tracking-widest">Nearby</div>
                    </div>
                    <div className="space-y-3">
                        {[
                            { name: "The Devil's Backbone", athletes: 842, cr: "04:12", pr: "05:45" },
                            { name: "Creek Bed Slog", athletes: null, cr: "12:44", pr: null, description: "Highly Technical Terrain" }
                        ].map((seg, i) => (
                            <div key={i} className="glass-card p-4 flex items-center justify-between bg-white/[0.02] border-white/[0.05] group hover:border-white/10 transition-all">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-[#0f0916] border border-white/5 flex items-center justify-center text-xs font-black text-zinc-500 group-hover:text-white transition-colors">
                                        {i + 1}
                                    </div>
                                    <div className="text-left">
                                        <h4 className="text-sm font-black text-white uppercase tracking-tight">{seg.name}</h4>
                                        {seg.athletes ? (
                                            <div className="flex items-center gap-1.5 mt-0.5">
                                                <div className="flex -space-x-1.5">
                                                    <div className="w-3 h-3 rounded-full bg-orange-400 border border-black" />
                                                    <div className="w-3 h-3 rounded-full bg-cyan-400 border border-black" />
                                                </div>
                                                <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest">{seg.athletes} athletes tracked this week</p>
                                            </div>
                                        ) : (
                                            <p className="text-[9px] text-[#a855f7] font-black italic uppercase tracking-widest mt-0.5">"{seg.description}"</p>
                                        )}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-[10px] font-black text-[#a855f7] uppercase tracking-tighter mb-0.5 italic">CR {seg.cr}</div>
                                    <div className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest uppercase">{seg.pr ? `Your PR ${seg.pr}` : 'No time yet'}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
