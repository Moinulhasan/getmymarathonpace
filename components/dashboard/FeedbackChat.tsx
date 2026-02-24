"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Send, X, MessageSquare, Loader2, Image as ImageIcon, Paperclip } from "lucide-react";
import { apiGetFeedback, apiSendFeedback, FeedbackMessage } from "@/lib/api";
import { format } from "date-fns";

export default function FeedbackChat() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<FeedbackMessage[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [attachment, setAttachment] = useState<File | null>(null);
    const [attachmentPreview, setAttachmentPreview] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Fetch messages when chat is opened
    useEffect(() => {
        if (isOpen) {
            fetchMessages();
        }
    }, [isOpen]);

    // Scroll to bottom when messages update
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    // Cleanup preview URL
    useEffect(() => {
        return () => {
            if (attachmentPreview) URL.revokeObjectURL(attachmentPreview);
        };
    }, [attachmentPreview]);

    const fetchMessages = async () => {
        setIsLoading(true);
        try {
            const data = await apiGetFeedback();
            setMessages(data);
        } catch (error) {
            console.error("Failed to fetch feedback:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setAttachment(file);
            const preview = URL.createObjectURL(file);
            setAttachmentPreview(preview);
        }
    };

    const removeAttachment = () => {
        setAttachment(null);
        if (attachmentPreview) {
            URL.revokeObjectURL(attachmentPreview);
            setAttachmentPreview(null);
        }
    };

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if ((!newMessage.trim() && !attachment) || isSending) return;

        const messageText = newMessage.trim();
        const currentAttachment = attachment;

        setNewMessage("");
        removeAttachment();
        setIsSending(true);

        try {
            const sentMessage = await apiSendFeedback(messageText, currentAttachment || undefined);
            setMessages((prev) => [...prev, sentMessage]);
        } catch (error) {
            console.error("Failed to send feedback:", error);
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-[60]">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="absolute bottom-20 right-0 w-[350px] sm:w-[400px] h-[500px] bg-[#1a1425] border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="bg-[#2a1d3d] p-4 border-b border-white/10 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400">
                                    <MessageSquare size={18} />
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold text-white">System Feedback</h3>
                                    <p className="text-[10px] text-zinc-400">We typically reply within 24h</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div
                            ref={scrollRef}
                            className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
                        >
                            {isLoading && messages.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full gap-2 text-zinc-500">
                                    <Loader2 className="animate-spin" size={20} />
                                    <p className="text-xs">Loading history...</p>
                                </div>
                            ) : messages.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-center p-6 space-y-2">
                                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-zinc-500 mb-2">
                                        <MessageSquare size={24} />
                                    </div>
                                    <p className="text-sm text-zinc-300 font-medium">No messages yet</p>
                                    <p className="text-xs text-zinc-500">
                                        Have a suggestion or found a bug? Send us a message below!
                                    </p>
                                </div>
                            ) : (
                                messages.map((msg) => (
                                    <div
                                        key={msg.id}
                                        className={`flex ${msg.is_from_user ? "justify-end" : "justify-start"}`}
                                    >
                                        <div
                                            className={`max-w-[80%] overflow-hidden rounded-2xl text-sm ${msg.is_from_user
                                                ? "bg-indigo-600 text-white rounded-tr-none"
                                                : "bg-white/5 text-zinc-200 border border-white/10 rounded-tl-none"
                                                }`}
                                        >
                                            {msg.attachment_url && (
                                                <div className="p-1">
                                                    <img
                                                        src={msg.attachment_url}
                                                        alt="Attachment"
                                                        className="rounded-xl max-w-full h-auto object-cover border border-white/5"
                                                    />
                                                </div>
                                            )}
                                            <div className="p-3">
                                                <p className="leading-relaxed">{msg.message}</p>
                                                <p className={`text-[10px] mt-1.5 ${msg.is_from_user ? "text-indigo-200/70" : "text-zinc-500"
                                                    }`}>
                                                    {format(new Date(msg.created_at), "HH:mm")}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Preview Area */}
                        {attachmentPreview && (
                            <div className="px-4 py-2 border-t border-white/10 bg-black/20 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-10 h-10 rounded-lg overflow-hidden border border-white/10 bg-black/40">
                                        <img src={attachmentPreview} alt="Preview" className="w-full h-full object-cover" />
                                    </div>
                                    <span className="text-[10px] text-zinc-400 truncate max-w-[150px]">{attachment?.name}</span>
                                </div>
                                <button
                                    onClick={removeAttachment}
                                    className="p-1 hover:bg-white/10 rounded-full text-zinc-400 hover:text-white transition-colors"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        )}

                        {/* Input Area */}
                        <form
                            onSubmit={handleSend}
                            className="p-4 bg-[#2a1d3d]/50 border-t border-white/10 flex items-center gap-2"
                        >
                            <label className="p-2.5 rounded-xl bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer">
                                <ImageIcon size={18} />
                                <input
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    onClick={(e) => (e.currentTarget.value = '')}
                                />
                            </label>
                            <input
                                type="text"
                                placeholder="Type your message..."
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-indigo-500/50 transition-colors"
                            />
                            <button
                                type="submit"
                                disabled={!newMessage.trim() || isSending}
                                className="p-2.5 rounded-xl bg-indigo-600 text-white disabled:opacity-50 disabled:bg-zinc-700 hover:bg-indigo-500 transition-colors"
                            >
                                {isSending ? (
                                    <Loader2 className="animate-spin" size={18} />
                                ) : (
                                    <Send size={18} />
                                )}
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Trigger Button */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 ${isOpen ? "bg-zinc-800 text-zinc-400 rotate-90" : "bg-indigo-600 text-white"
                    }`}
            >
                {isOpen ? <X size={24} /> : <MessageCircle size={28} />}
            </motion.button>
        </div>
    );
}
