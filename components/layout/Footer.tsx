import { Github, Twitter, Instagram, Mail } from "lucide-react";

const footerLinks = [
    { label: "Features", href: "#features" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Pricing", href: "#pricing" },
    { label: "Privacy", href: "#" },
    { label: "Terms", href: "#" },
];

const socialLinks = [
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Github, href: "#", label: "GitHub" },
    { icon: Mail, href: "#", label: "Email" },
];

export default function Footer() {
    return (
        <footer className="border-t border-white/5 bg-zinc-950" role="contentinfo">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
                    {/* Logo + Description */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-500 flex items-center justify-center">
                                <span className="text-white font-bold text-xs">R</span>
                            </div>
                            <span className="text-lg font-bold text-white">
                                RunGen <span className="gradient-text">AI</span>
                            </span>
                        </div>
                        <p className="text-sm text-zinc-500 max-w-xs">
                            AI-powered structured running plans designed around your pace,
                            your goals, and your race day.
                        </p>
                    </div>

                    {/* Links */}
                    <nav className="flex flex-wrap gap-6" aria-label="Footer navigation">
                        {footerLinks.map((link) => (
                            <a
                                key={link.label}
                                href={link.href}
                                className="text-sm text-zinc-500 hover:text-white transition-colors duration-200"
                            >
                                {link.label}
                            </a>
                        ))}
                    </nav>

                    {/* Social */}
                    <div className="flex items-center gap-3">
                        {socialLinks.map((social) => (
                            <a
                                key={social.label}
                                href={social.href}
                                aria-label={social.label}
                                className="w-9 h-9 rounded-lg border border-white/5 bg-white/5 flex items-center justify-center text-zinc-500 hover:text-white hover:border-indigo-500/30 hover:bg-indigo-500/10 transition-all duration-200"
                            >
                                <social.icon size={16} />
                            </a>
                        ))}
                    </div>
                </div>

                <div className="mt-10 pt-8 border-t border-white/5 text-center">
                    <p className="text-xs text-zinc-600">
                        © {new Date().getFullYear()} RunGen AI. All rights reserved. Built for
                        elite runners.
                    </p>
                </div>
            </div>
        </footer>
    );
}
