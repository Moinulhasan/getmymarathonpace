"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import FeedbackChat from "@/components/dashboard/FeedbackChat";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.replace("/");
        }
    }, [isLoading, isAuthenticated, router]);

    // Show nothing while checking auth
    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center bg-[#0f0a18]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-3 border-[#7f13ec] border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm text-zinc-500">Loading...</p>
                </div>
            </div>
        );
    }

    // If not authenticated, don't render (will redirect)
    if (!isAuthenticated) {
        return null;
    }

    return (
        <>
            <DashboardSidebar>{children}</DashboardSidebar>
            <FeedbackChat />
        </>
    );
}
