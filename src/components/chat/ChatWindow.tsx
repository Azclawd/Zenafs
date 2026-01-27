"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Send, User } from "lucide-react";

interface Message {
    id: string;
    content: string;
    sender_id: string;
    receiver_id: string;
    created_at: string;
    is_read: boolean;
}

interface ChatWindowProps {
    otherUserId: string;
    otherUserName: string;
    currentUserId: string;
}

export function ChatWindow({ otherUserId, otherUserName, currentUserId }: ChatWindowProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const supabase = createClient();

    const scrollToBottom = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    };

    // Fetch messages
    const fetchMessages = async () => {
        const { data, error } = await supabase
            .from("messages")
            .select("*")
            .or(`and(sender_id.eq.${currentUserId},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${currentUserId})`)
            .order("created_at", { ascending: true });

        if (!error && data) {
            setMessages(data);
            // Mark messages as read
            const unreadMessages = data.filter(
                (msg) => msg.receiver_id === currentUserId && !msg.is_read
            );
            if (unreadMessages.length > 0) {
                await supabase
                    .from("messages")
                    .update({ is_read: true })
                    .in(
                        "id",
                        unreadMessages.map((msg) => msg.id)
                    );
            }
        }
        setLoading(false);
    };

    // Send message
    const sendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || sending) return;

        setSending(true);
        try {
            const { data, error } = await supabase
                .from("messages")
                .insert({
                    content: newMessage.trim(),
                    sender_id: currentUserId,
                    receiver_id: otherUserId,
                })
                .select()
                .single();

            if (!error && data) {
                setMessages([...messages, data]);
                setNewMessage("");
                setTimeout(scrollToBottom, 100);
            }
        } catch (error) {
            console.error("Error sending message:", error);
        } finally {
            setSending(false);
        }
    };

    // Set up real-time subscription
    useEffect(() => {
        fetchMessages();

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
                    const newMsg = payload.new as Message;
                    // Only add if it's part of this conversation
                    if (
                        (newMsg.sender_id === currentUserId && newMsg.receiver_id === otherUserId) ||
                        (newMsg.sender_id === otherUserId && newMsg.receiver_id === currentUserId)
                    ) {
                        setMessages((prev) => {
                            // Avoid duplicates
                            if (prev.find((msg) => msg.id === newMsg.id)) return prev;
                            return [...prev, newMsg];
                        });
                        setTimeout(scrollToBottom, 100);
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [currentUserId, otherUserId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    return (
        <Card className="h-[600px] flex flex-col border-none shadow-sm bg-white">
            <CardHeader className="border-b border-zen-100 py-4">
                <CardTitle className="text-lg font-medium flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-zen-100 flex items-center justify-center text-zen-600">
                        <User className="h-5 w-5" />
                    </div>
                    <div>
                        <div className="text-zen-900">{otherUserName}</div>
                        <div className="text-xs text-green-600 font-normal flex items-center gap-1">
                            <span className="h-2 w-2 rounded-full bg-green-500"></span>
                            Online
                        </div>
                    </div>
                </CardTitle>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
                {/* Messages Area */}
                <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-zen-50/30">
                    {loading ? (
                        <div className="text-center text-zen-500 py-8">Loading messages...</div>
                    ) : messages.length === 0 ? (
                        <div className="text-center text-zen-500 py-8">
                            No messages yet. Start the conversation!
                        </div>
                    ) : (
                        messages.map((message) => {
                            const isOwn = message.sender_id === currentUserId;
                            return (
                                <div
                                    key={message.id}
                                    className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
                                >
                                    <div
                                        className={`max-w-[70%] rounded-2xl px-4 py-3 text-sm ${
                                            isOwn
                                                ? "bg-zen-900 text-white rounded-br-none"
                                                : "bg-white border border-zen-100 text-zen-800 rounded-bl-none shadow-sm"
                                        }`}
                                    >
                                        <p>{message.content}</p>
                                        <p
                                            className={`text-[10px] mt-1 text-right ${
                                                isOwn ? "text-zen-300" : "text-zen-400"
                                            }`}
                                        >
                                            {new Date(message.created_at).toLocaleTimeString([], {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </p>
                                    </div>
                                </div>
                            );
                        })
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white border-t border-zen-100">
                    <form onSubmit={sendMessage} className="flex gap-2">
                        <Input
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type a message..."
                            className="flex-1 bg-zen-50 border-zen-200 focus:ring-zen-900"
                            disabled={sending}
                        />
                        <Button
                            type="submit"
                            size="icon"
                            disabled={!newMessage.trim() || sending}
                            className="bg-zen-900 hover:bg-zen-800 text-white rounded-xl h-10 w-10"
                        >
                            <Send className="h-4 w-4" />
                        </Button>
                    </form>
                </div>
            </CardContent>
        </Card>
    );
}
