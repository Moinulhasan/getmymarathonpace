"use client";

import { useState, useEffect } from "react";
import EventHeroCard from "@/components/dashboard/EventHeroCard";
import PersonalBestsCard from "@/components/dashboard/PersonalBestsCard";
import WeekPlanSection from "@/components/dashboard/WeekPlanSection";
import FitnessTrendSection from "@/components/dashboard/FitnessTrendSection";
import { apiGetProfile, apiStravaAnalysis, apiGetCurrentTrainingPlan, ProfileResponse, AnalysisData } from "@/lib/api";
import { Loader2 } from "lucide-react";

export default function DashboardPage() {
    const [profile, setProfile] = useState<ProfileResponse | null>(null);
    const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
    const [plan, setPlan] = useState<any | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const [profileRes, analysisRes, planRes] = await Promise.all([
                    apiGetProfile(),
                    apiStravaAnalysis(),
                    apiGetCurrentTrainingPlan()
                ]);
                setProfile(profileRes);
                setAnalysis(analysisRes);
                setPlan(planRes.plan);
            } catch (error) {
                console.error("Failed to fetch dashboard data:", error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchData();
    }, []);

    if (isLoading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <Loader2 className="w-8 h-8 text-[#7f13ec] animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            {/* Top Row: Event + Personal Bests */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2">
                    <EventHeroCard plan={plan} />
                </div>
                <div>
                    <PersonalBestsCard pbList={profile?.personal_bests || []} />
                </div>
            </div>

            {/* Week Plan */}
            <WeekPlanSection plan={plan} />

            {/* Fitness Trend */}
            <FitnessTrendSection analysis={analysis} />
        </div>
    );
}
