import EventHeroCard from "@/components/dashboard/EventHeroCard";
import PersonalBestsCard from "@/components/dashboard/PersonalBestsCard";
import WeekPlanSection from "@/components/dashboard/WeekPlanSection";
import FitnessTrendSection from "@/components/dashboard/FitnessTrendSection";

export default function DashboardPage() {
    return (
        <div className="max-w-6xl mx-auto space-y-6">
            {/* Top Row: Event + Personal Bests */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2">
                    <EventHeroCard />
                </div>
                <div>
                    <PersonalBestsCard />
                </div>
            </div>

            {/* Week Plan */}
            <WeekPlanSection />

            {/* Fitness Trend */}
            <FitnessTrendSection />
        </div>
    );
}
