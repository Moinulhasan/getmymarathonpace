import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
  title: "RunGen AI – AI-Powered Running Plan Generator",
  description:
    "Train smarter with AI-powered structured running plans designed around your body, your pace, and your race date. Generate your personalized plan today.",
  keywords: [
    "running plan",
    "AI training",
    "marathon training",
    "5K plan",
    "race preparation",
    "running coach AI",
    "goal pace",
  ],
  openGraph: {
    title: "RunGen AI – Train Smarter. Hit Your Goal Pace.",
    description:
      "AI-powered structured running plans designed around your body, your pace, and your race date.",
    type: "website",
    locale: "en_US",
    siteName: "RunGen AI",
  },
  twitter: {
    card: "summary_large_image",
    title: "RunGen AI – Train Smarter. Hit Your Goal Pace.",
    description:
      "AI-powered structured running plans designed around your body, your pace, and your race date.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased bg-zinc-950 text-white font-sans">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
