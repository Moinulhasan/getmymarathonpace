"use client";

import { useCallback, useEffect, useRef } from "react";

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

declare global {
    interface Window {
        google?: {
            accounts: {
                id: {
                    initialize: (config: {
                        client_id: string;
                        callback: (response: { credential: string }) => void;
                        auto_select?: boolean;
                    }) => void;
                    prompt: () => void;
                    renderButton: (
                        element: HTMLElement,
                        config: {
                            theme?: string;
                            size?: string;
                            width?: number;
                            type?: string;
                        }
                    ) => void;
                };
            };
        };
    }
}

interface UseGoogleLoginOptions {
    onSuccess: (credential: string) => void;
    onError?: (error: string) => void;
}

export function useGoogleLogin({ onSuccess, onError }: UseGoogleLoginOptions) {
    const scriptLoadedRef = useRef(false);
    const initializedRef = useRef(false);

    // Load the Google Identity Services script
    useEffect(() => {
        if (scriptLoadedRef.current) return;
        if (typeof window === "undefined") return;

        // Check if already loaded
        if (document.querySelector('script[src="https://accounts.google.com/gsi/client"]')) {
            scriptLoadedRef.current = true;
            return;
        }

        const script = document.createElement("script");
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.defer = true;
        script.onload = () => {
            scriptLoadedRef.current = true;
        };
        document.head.appendChild(script);
    }, []);

    const triggerGoogleLogin = useCallback(() => {
        if (!GOOGLE_CLIENT_ID) {
            onError?.("Google Client ID not configured. Set NEXT_PUBLIC_GOOGLE_CLIENT_ID in .env.local");
            return;
        }

        if (!window.google) {
            onError?.("Google Identity Services not loaded yet. Please try again.");
            return;
        }

        if (!initializedRef.current) {
            window.google.accounts.id.initialize({
                client_id: GOOGLE_CLIENT_ID,
                callback: (response) => {
                    if (response.credential) {
                        onSuccess(response.credential);
                    } else {
                        onError?.("Google login failed. Please try again.");
                    }
                },
            });
            initializedRef.current = true;
        }

        // Trigger One Tap / popup
        window.google.accounts.id.prompt();
    }, [onSuccess, onError]);

    return { triggerGoogleLogin, isReady: !!GOOGLE_CLIENT_ID };
}
