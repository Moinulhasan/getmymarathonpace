"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { apiStravaCallback } from "@/lib/api";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";

export default function StravaCallbackPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const [message, setMessage] = useState("Connecting your Strava account...");

    useEffect(() => {
        const code = searchParams.get("code");
        const error = searchParams.get("error");

        if (error || !code) {
            setStatus("error");
            setMessage(error === "access_denied" ? "Strava authorization was denied." : "Missing authorization code.");
            setTimeout(() => router.push("/dashboard/profile"), 3000);
            return;
        }

        (async () => {
            try {
                const res = await apiStravaCallback(code);
                setStatus("success");
                setMessage(res.message);
                setTimeout(() => router.push("/dashboard/profile"), 2000);
            } catch (err: unknown) {
                setStatus("error");
                const e = err as { data?: { message?: string }; message?: string };
                setMessage(e.data?.message || e.message || "Failed to connect Strava.");
                setTimeout(() => router.push("/dashboard/profile"), 3000);
            }
        })();
    }, [searchParams, router]);

    return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <div className="glass-card p-8 max-w-sm w-full text-center space-y-4">
                {status === "loading" && (
                    <Loader2 size={40} className="animate-spin text-[#FC4C02] mx-auto" />
                )}
                {status === "success" && (
                    <CheckCircle2 size={40} className="text-green-400 mx-auto" />
                )}
                {status === "error" && (
                    <XCircle size={40} className="text-red-400 mx-auto" />
                )}
                <p className="text-white font-semibold">{message}</p>
                <p className="text-zinc-500 text-xs">Redirecting to profile...</p>
            </div>
        </div>
    );
}
