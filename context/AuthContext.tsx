"use client";

import {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
    useMemo,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import {
    AuthUser,
    getToken,
    setToken,
    removeToken,
    apiGetMe,
    apiLogout,
} from "@/lib/api";

// ─── Context Types ───────────────────────────────────────────────
interface AuthContextType {
    user: AuthUser | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (token: string, user: AuthUser) => void;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    login: () => { },
    logout: async () => { },
});

export const useAuth = () => useContext(AuthContext);

// ─── Provider ────────────────────────────────────────────────────
export function AuthProvider({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch user on mount if token exists
    useEffect(() => {
        const token = getToken();
        if (!token) {
            setIsLoading(false);
            return;
        }

        apiGetMe()
            .then((res) => {
                if (res.user) {
                    setUser(res.user);
                }
            })
            .catch(() => {
                removeToken();
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []);

    // Redirect unauthenticated users away from /dashboard
    useEffect(() => {
        if (isLoading) return;

        const isDashboard = pathname?.startsWith("/dashboard");
        if (isDashboard && !user) {
            router.replace("/");
        }
    }, [isLoading, user, pathname, router]);

    const login = useCallback((token: string, authUser: AuthUser) => {
        setToken(token);
        setUser(authUser);
    }, []);

    const logout = useCallback(async () => {
        try {
            await apiLogout();
        } catch {
            // Ignore errors on logout
        }
        removeToken();
        setUser(null);
        router.push("/");
    }, [router]);

    const value = useMemo(
        () => ({
            user,
            isAuthenticated: !!user,
            isLoading,
            login,
            logout,
        }),
        [user, isLoading, login, logout]
    );

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
}
