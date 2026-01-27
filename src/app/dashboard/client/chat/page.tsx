"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { Send, User, Sparkles, MessageCircle, Clock, CheckCheck } from "lucide-react";

export default function ClientChat() {
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [therapist, setTherapist] = useState<any>(null);
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        loadData();
        const supabase = createClient();

        // Subscribe to new messages
        const channel = supabase
            .channel("messages")
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "messages",
                },
                (payload) => {
                    if (
                        payload.new.sender_id === therapist?.id ||
                        payload.new.receiver_id === therapist?.id
                    ) {
                        setMessages((prev) => [...prev, payload.new]);
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [therapist]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    function scrollToBottom() {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    async function loadData() {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) return;

        setCurrentUser(user);

        // Get therapist from most recent appointment
        const { data: appointments } = await supabase
            .from("appointments")
            .select("therapist_id")
            .eq("client_id", user.id)
            .order("created_at", { ascending: false })
            .limit(1);

        if (appointments && appointments.length > 0) {
            const { data: therapistData } = await supabase
                .from("profiles")
                .select("*")
                .eq("id", appointments[0].therapist_id)
                .single();

            setTherapist(therapistData);

            // Load messages
            if (therapistData) {
                const { data: messagesData } = await supabase
                    .from("messages")
                    .select("*")
                    .or(`and(sender_id.eq.${user.id},receiver_id.eq.${therapistData.id}),and(sender_id.eq.${therapistData.id},receiver_id.eq.${user.id})`)
                    .order("created_at", { ascending: true });

                setMessages(messagesData || []);
            }
        }

        setLoading(false);
    }

    async function sendMessage(e: React.FormEvent) {
        e.preventDefault();

        if (!newMessage.trim() || !therapist || !currentUser || sending) return;

        setSending(true);
        const supabase = createClient();

        const { error } = await supabase.from("messages").insert({
            sender_id: currentUser.id,
            receiver_id: therapist.id,
            content: newMessage.trim(),
            is_read: false,
        });

        if (error) {
            console.error("Error sending message:", error);
        }

        setNewMessage("");
        setSending(false);
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-gray-200 border-t-teal-600 rounded-full animate-spin"></div>
                    <Sparkles className="w-6 h-6 text-teal-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                </div>
            </div>
        );
    }

    if (!therapist) {
        return (
            <div className="max-w-2xl mx-auto">
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 border-2 border-amber-200 p-12 shadow-xl text-center">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 animate-beam"></div>

                    <div className="relative inline-block mb-6">
                        <div className="absolute inset-0 bg-amber-400 rounded-full blur-2xl opacity-30 animate-pulse-glow"></div>
                        <div className="relative w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center shadow-xl">
                            <MessageCircle className="w-10 h-10 text-white" strokeWidth={2.5} />
                        </div>
                    </div>

                    <h2 className="text-2xl font-bold text-gray-900 mb-3">No Therapist Assigned Yet</h2>
                    <p className="text-gray-700 text-lg mb-6">
                        A therapist will be assigned to you soon. Once assigned, you'll be able to chat here.
                    </p>
                    <div className="inline-block px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-xl shadow-lg">
                        Coming Soon
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-[calc(100vh-12rem)]">
            {/* Header with animated gradient */}
            <div className="relative overflow-hidden rounded-t-2xl bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 border-b-0 p-6 shadow-lg">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 animate-beam"></div>

                <div className="relative flex items-center gap-4">
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full blur-lg opacity-50 animate-pulse-glow"></div>
                        <div className="relative w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center shadow-xl">
                            <User className="w-7 h-7 text-white" strokeWidth={2.5} />
                        </div>
                    </div>
                    <div className="flex-1">
                        <h2 className="text-xl font-bold text-gray-900">{therapist.full_name || "Your Therapist"}</h2>
                        <div className="flex items-center gap-2 mt-1">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-sm text-gray-600">Available</span>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Therapist</p>
                        <p className="text-sm text-gray-700">{therapist.email}</p>
                    </div>
                </div>
            </div>

            {/* Messages Area with custom scrollbar */}
            <div className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-50 to-white border-x-2 border-gray-200 p-6 space-y-4">
                {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                        <div className="relative mb-6">
                            <div className="absolute inset-0 bg-teal-400 rounded-full blur-2xl opacity-30 animate-pulse-glow"></div>
                            <div className="relative w-24 h-24 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-full flex items-center justify-center shadow-2xl">
                                <MessageCircle className="w-12 h-12 text-white" strokeWidth={2} />
                            </div>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Start Your Conversation</h3>
                        <p className="text-gray-600 max-w-md">
                            Send your first message to connect with your therapist. They'll respond as soon as possible.
                        </p>
                    </div>
                ) : (
                    messages.map((msg) => {
                        const isMe = msg.sender_id === currentUser?.id;
                        return (
                            <div
                                key={msg.id}
                                className={`flex ${isMe ? "justify-end" : "justify-start"} animate-fade-in`}
                            >
                                <div
                                    className={`group relative max-w-[70%] ${
                                        isMe
                                            ? "bg-gradient-to-br from-teal-500 to-emerald-600 text-white rounded-2xl rounded-tr-md"
                                            : "bg-white border-2 border-gray-200 text-gray-900 rounded-2xl rounded-tl-md"
                                    } px-5 py-3 shadow-lg hover:shadow-xl transition-all duration-200`}
                                >
                                    <p className="text-base leading-relaxed mb-2">{msg.content}</p>
                                    <div className={`flex items-center gap-2 text-xs ${isMe ? "text-teal-100" : "text-gray-500"}`}>
                                        <Clock className="w-3 h-3" />
                                        <span>
                                            {new Date(msg.created_at).toLocaleTimeString("en-US", {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </span>
                                        {isMe && <CheckCheck className="w-4 h-4 ml-1" />}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area with gradient border */}
            <form onSubmit={sendMessage} className="relative overflow-hidden rounded-b-2xl bg-white border-2 border-gray-200 border-t-0 p-6 shadow-lg">
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-teal-500 via-emerald-500 to-cyan-500"></div>

                <div className="relative flex gap-3">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message..."
                        disabled={sending}
                        className="flex-1 px-6 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:ring-4 focus:ring-teal-100 outline-none transition-all text-base placeholder:text-gray-400 disabled:opacity-50"
                    />
                    <button
                        type="submit"
                        disabled={!newMessage.trim() || sending}
                        className="group relative px-8 py-4 bg-gradient-to-r from-teal-500 to-emerald-600 text-white font-semibold rounded-xl hover:from-teal-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 disabled:hover:scale-100"
                    >
                        <div className="absolute inset-0 bg-white rounded-xl opacity-0 group-hover:opacity-20 transition-opacity"></div>
                        <div className="relative flex items-center gap-2">
                            {sending ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    <span>Sending...</span>
                                </>
                            ) : (
                                <>
                                    <Send className="w-5 h-5" strokeWidth={2.5} />
                                    <span>Send</span>
                                </>
                            )}
                        </div>
                    </button>
                </div>
            </form>
        </div>
    );
}
