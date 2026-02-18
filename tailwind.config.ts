import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: "class",
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./lib/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ["Inter", "system-ui", "sans-serif"],
                display: ["Inter", "sans-serif"],
            },
            colors: {
                primary: "#7f13ec",
                "background-light": "#f7f6f8",
                "background-dark": "#191022",
                accent: {
                    indigo: "#7f13ec",
                    purple: "#a855f7",
                    cyan: "#06b6d4",
                },
            },
            borderRadius: {
                DEFAULT: "0.5rem",
                lg: "1rem",
                xl: "1.5rem",
                full: "9999px",
            },
            animation: {
                float: "float 4s ease-in-out infinite",
                "float-delayed": "float 5s ease-in-out infinite 1s",
                "float-slow": "float 6s ease-in-out infinite 2s",
                "glow-pulse": "glow-pulse 3s ease-in-out infinite",
                "gradient-shift": "gradient-shift 8s ease infinite",
                "scroll-left": "scroll-left 25s linear infinite",
                "scroll-left-slow": "scroll-left 30s linear infinite",
            },
            keyframes: {
                float: {
                    "0%, 100%": { transform: "translateY(-8px)" },
                    "50%": { transform: "translateY(8px)" },
                },
                "glow-pulse": {
                    "0%, 100%": { opacity: "0.4" },
                    "50%": { opacity: "0.8" },
                },
                "gradient-shift": {
                    "0%, 100%": { backgroundPosition: "0% 50%" },
                    "50%": { backgroundPosition: "100% 50%" },
                },
                "scroll-left": {
                    "0%": { transform: "translateX(0)" },
                    "100%": { transform: "translateX(-50%)" },
                },
            },
            backgroundImage: {
                "accent-gradient":
                    "linear-gradient(135deg, #7f13ec, #a855f7, #06b6d4)",
                "accent-gradient-r":
                    "linear-gradient(135deg, #06b6d4, #a855f7, #7f13ec)",
            },
        },
    },
    plugins: [],
};

export default config;
