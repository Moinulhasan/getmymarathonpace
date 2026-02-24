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
            onError?.("Google Client ID not configured.");
            return;
        }

        if (!window.google) {
            onError?.("Google Identity Services not loaded yet.");
            return;
        }

        if (!initializedRef.current) {
            window.google.accounts.id.initialize({
                client_id: GOOGLE_CLIENT_ID,
                callback: (response) => {
                    if (response.credential) {
                        onSuccess(response.credential);
                    } else {
                        onError?.("Google login failed.");
                    }
                },
            });
            initializedRef.current = true;
        }

        window.google.accounts.id.prompt();
    }, [onSuccess, onError]);

    const renderGoogleButton = useCallback((containerId: string, options: { theme?: string; size?: string; width?: number } = {}) => {
        if (!GOOGLE_CLIENT_ID || !window.google) return;

        const container = document.getElementById(containerId);
        if (!container) return;

        if (!initializedRef.current) {
            window.google.accounts.id.initialize({
                client_id: GOOGLE_CLIENT_ID,
                callback: (response) => {
                    if (response.credential) {
                        onSuccess(response.credential);
                    } else {
                        onError?.("Google login failed.");
                    }
                },
            });
            initializedRef.current = true;
        }

        window.google.accounts.id.renderButton(container, {
            theme: (options.theme as any) || "filled_blue",
            size: (options.size as any) || "large",
            width: options.width,
            shape: "rectangular",
            text: "continue_with",
        });
    }, [onSuccess, onError]);

    return { triggerGoogleLogin, renderGoogleButton, isReady: !!GOOGLE_CLIENT_ID };
}
