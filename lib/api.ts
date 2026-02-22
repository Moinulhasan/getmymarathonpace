const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

// ─── Types ───────────────────────────────────────────────────────
export interface AuthUser {
    id: number;
    name: string;
    email: string;
}

export interface AuthResponse {
    message: string;
    token?: string;
    user?: AuthUser;
    email?: string;
    requires_otp?: boolean;
    errors?: Record<string, string[]>;
}

// ─── Token Management ────────────────────────────────────────────
export function getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("auth_token");
}

export function setToken(token: string): void {
    localStorage.setItem("auth_token", token);
}

export function removeToken(): void {
    localStorage.removeItem("auth_token");
}

// ─── Base Fetch Helper ───────────────────────────────────────────
async function apiFetch<T = AuthResponse>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const token = getToken();
    const headers: Record<string, string> = {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(options.headers as Record<string, string>),
    };

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    const data = await res.json();

    if (!res.ok) {
        const error = new Error(data.message || "Something went wrong") as Error & {
            status: number;
            data: T;
        };
        error.status = res.status;
        error.data = data;
        throw error;
    }

    return data as T;
}

// ─── Auth API Functions ──────────────────────────────────────────
export async function apiRegister(
    name: string,
    email: string,
    password: string
): Promise<AuthResponse> {
    return apiFetch("/register", {
        method: "POST",
        body: JSON.stringify({ name, email, password }),
    });
}

export async function apiLogin(
    email: string,
    password: string
): Promise<AuthResponse> {
    return apiFetch("/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
    });
}

export async function apiVerifyOtp(
    email: string,
    code: string
): Promise<AuthResponse> {
    return apiFetch("/verify-otp", {
        method: "POST",
        body: JSON.stringify({ email, code }),
    });
}

export async function apiResendOtp(email: string): Promise<AuthResponse> {
    return apiFetch("/resend-otp", {
        method: "POST",
        body: JSON.stringify({ email }),
    });
}

export async function apiGoogleLogin(token: string): Promise<AuthResponse> {
    return apiFetch("/google-login", {
        method: "POST",
        body: JSON.stringify({ token }),
    });
}

export async function apiGetMe(): Promise<AuthResponse> {
    return apiFetch("/me");
}

export async function apiLogout(): Promise<AuthResponse> {
    return apiFetch("/logout", {
        method: "POST",
    });
}

// ─── Profile Types ───────────────────────────────────────────────
export interface PersonalBest {
    id?: number;
    distance: string;
    time: string;
    date_achieved: string;
}

export interface UserProfile {
    id: number;
    name: string;
    email: string;
    bio: string | null;
    badge: string;
    weight: number | null;
    height: number | null;
    age: number | null;
    total_distance: number;
    training_hours: number;
    calories_per_week: number;
    member_since: string;
    strava_connected: boolean;
    strava_athlete_id: string | null;
}

export interface ProfileResponse {
    profile: UserProfile;
    personal_bests: PersonalBest[];
}

// ─── Profile API Functions ───────────────────────────────────────
export async function apiGetProfile(): Promise<ProfileResponse> {
    return apiFetch<ProfileResponse>("/profile");
}

export async function apiUpdateProfile(data: {
    name?: string;
    bio?: string;
    badge?: string;
}): Promise<{ message: string; profile: Partial<UserProfile> }> {
    return apiFetch("/profile", {
        method: "PUT",
        body: JSON.stringify(data),
    });
}

export async function apiUpdateBiometrics(data: {
    weight?: number | null;
    height?: number | null;
    age?: number | null;
}): Promise<{ message: string; biometrics: { weight: number; height: number; age: number } }> {
    return apiFetch("/profile/biometrics", {
        method: "PUT",
        body: JSON.stringify(data),
    });
}

export async function apiChangePassword(data: {
    current_password: string;
    new_password: string;
    new_password_confirmation: string;
}): Promise<{ message: string }> {
    return apiFetch("/profile/password", {
        method: "PUT",
        body: JSON.stringify(data),
    });
}

export async function apiUpdatePersonalBests(
    personal_bests: PersonalBest[]
): Promise<{ message: string; personal_bests: PersonalBest[] }> {
    return apiFetch("/profile/personal-bests", {
        method: "PUT",
        body: JSON.stringify({ personal_bests }),
    });
}

// ─── Strava Types ────────────────────────────────────────────────
export interface StravaStats {
    total_distance_km: number;
    total_runs: number;
    total_moving_seconds: number;
    total_elevation_gain: number;
}

// ─── Strava API Functions ────────────────────────────────────────
export async function apiStravaConnect(): Promise<{ url: string }> {
    return apiFetch("/strava/connect");
}

export async function apiStravaCallback(
    code: string
): Promise<{ message: string; strava: { athlete_id: string; connected_at: string; stats: StravaStats } }> {
    return apiFetch("/strava/callback", {
        method: "POST",
        body: JSON.stringify({ code }),
    });
}

export async function apiStravaDisconnect(): Promise<{ message: string }> {
    return apiFetch("/strava/disconnect", {
        method: "POST",
    });
}

export async function apiStravaSync(): Promise<{ message: string; stats: StravaStats }> {
    return apiFetch("/strava/sync", {
        method: "POST",
    });
}

// ─── Analysis Types ──────────────────────────────────────────
export interface ActivityData {
    id: string | number;
    name: string;
    type: string;
    start_date: string;
    city: string | null;
    distance_km: number;
    target_distance_km: number | null;
    average_pace: string;
    target_pace: string | null;
    moving_time_formatted: string;
    target_time: string | null;
    elevation_gain: number | null;
    target_elevation: string | null;
    average_heartrate: number | null;
    target_hr: string | null;
    badge: string | null;
    ai_note: string | null;
    ai_note_type: "analysis" | "coach" | null;
}

export interface AnalysisData {
    strava_connected: boolean;
    last_sync_at: string | null;
    weekly_distance: number;
    distance_change: number;
    avg_heart_rate: number;
    hr_label: string;
    consistency_days: number;
    streak_change: number;
    alignment_score: number;
    alignment_weekly_change: number;
    alignment_description: string;
    volume_data: { day: string; planned: number; actual: number }[];
    recent_activities: ActivityData[];
}

// ─── Analysis API Function ───────────────────────────────────
export async function apiStravaAnalysis(): Promise<AnalysisData> {
    return apiFetch<AnalysisData>("/strava/analysis");
}

export async function apiGetStravaRoutes(): Promise<{ strava_connected: boolean; routes: any[] }> {
    return apiFetch<{ strava_connected: boolean; routes: any[] }>("/strava/routes");
}

// ─── Training Plan API Functions ─────────────────────────
export async function apiGenerateTrainingPlan(data: any): Promise<any> {
    return apiFetch("/training-plans/generate", {
        method: "POST",
        body: JSON.stringify(data),
    });
}

export async function apiSaveTrainingPlan(data: {
    name: string;
    race_type: string;
    race_date: string;
    target_time?: string;
    terrain?: string;
    plan_data: any[];
}): Promise<{ message: string; plan: any }> {
    return apiFetch("/training-plans", {
        method: "POST",
        body: JSON.stringify(data),
    });
}

export async function apiGetCurrentTrainingPlan(): Promise<{ plan: any | null }> {
    return apiFetch("/training-plans/current");
}

export async function apiGetTrainingPlans(): Promise<{ plans: any[] }> {
    return apiFetch("/training-plans");
}

export async function apiActivateTrainingPlan(id: number | string): Promise<{ message: string; plan: any }> {
    return apiFetch(`/training-plans/${id}/activate`, {
        method: "POST",
    });
}

export async function apiPauseTrainingPlan(id: number | string): Promise<any> {
    return apiFetch(`/training-plans/${id}/pause`, {
        method: "POST",
    });
}

export async function apiArchiveAllTrainingPlans(): Promise<any> {
    return apiFetch("/training-plans/archive-all", {
        method: "POST",
    });
}
// ─── Feedback Types ──────────────────────────────────────────
export interface FeedbackMessage {
    id: number;
    user_id: number;
    message: string;
    is_from_user: boolean;
    status: string;
    created_at: string;
}

// ─── Feedback API Functions ──────────────────────────────────
export async function apiGetFeedback(): Promise<FeedbackMessage[]> {
    return apiFetch<FeedbackMessage[]>("/feedback");
}

export async function apiSendFeedback(message: string): Promise<FeedbackMessage> {
    return apiFetch<FeedbackMessage>("/feedback", {
        method: "POST",
        body: JSON.stringify({ message }),
    });
}
