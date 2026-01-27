"use client";

import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Heart, MessageCircle, Share2, MoreHorizontal, Sparkles } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Post {
    id: string;
    author: {
        name: string;
        avatar?: string;
    };
    content: string;
    gratitudeCount: number;
    timestamp: string;
    hasGivenGratitude: boolean;
}

export function Feed({ groupId }: { groupId?: string }) {
    const [posts, setPosts] = useState<Post[]>([
        {
            id: "1",
            author: { name: "Sarah J." },
            content: "Today I managed to go for a walk despite feeling anxious. It's a small win, but I'm proud of myself. 🌿",
            gratitudeCount: 12,
            timestamp: "2 hours ago",
            hasGivenGratitude: false
        },
        {
            id: "2",
            author: { name: "Michael C." },
            content: "Grateful for this community. Reading your stories gives me so much hope.",
            gratitudeCount: 8,
            timestamp: "4 hours ago",
            hasGivenGratitude: true
        }
    ]);

    const handleGiveGratitude = (postId: string) => {
        setPosts(posts.map(post => {
            if (post.id === postId) {
                return {
                    ...post,
                    gratitudeCount: post.hasGivenGratitude ? post.gratitudeCount - 1 : post.gratitudeCount + 1,
                    hasGivenGratitude: !post.hasGivenGratitude
                };
            }
            return post;
        }));
    };

    return (
        <div className="space-y-6 max-w-2xl mx-auto">
            {/* Create Post Input */}
            <Card className="border-none shadow-sm bg-white p-4">
                <div className="flex gap-4">
                    <div className="h-10 w-10 rounded-full bg-zen-100 flex-shrink-0" />
                    <div className="flex-1">
                        <input
                            type="text"
                            placeholder="Share a moment of gratitude or a small win..."
                            className="w-full bg-transparent border-none focus:ring-0 text-lg placeholder:text-zen-400"
                        />
                        <div className="flex justify-end mt-4">
                            <Button className="bg-zen-900 text-white hover:bg-zen-800 rounded-full px-6">
                                Post
                            </Button>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Feed */}
            <div className="space-y-4">
                {posts.map((post) => (
                    <motion.div
                        key={post.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <Card className="border-none shadow-sm bg-white overflow-hidden">
                            <CardHeader className="flex flex-row items-start justify-between pb-2">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center text-zen-700 font-medium">
                                        {post.author.name[0]}
                                    </div>
                                    <div>
                                        <p className="font-medium text-zen-900">{post.author.name}</p>
                                        <p className="text-xs text-zen-500">{post.timestamp}</p>
                                    </div>
                                </div>
                                <Button variant="ghost" size="icon" className="text-zen-400">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <p className="text-zen-800 text-lg leading-relaxed">{post.content}</p>

                                <div className="flex items-center gap-6 pt-4 border-t border-zen-50">
                                    <button
                                        onClick={() => handleGiveGratitude(post.id)}
                                        className={`flex items-center gap-2 transition-colors ${post.hasGivenGratitude ? "text-pink-500" : "text-zen-500 hover:text-pink-500"}`}
                                    >
                                        <div className={`p-2 rounded-full ${post.hasGivenGratitude ? "bg-pink-50" : "bg-transparent group-hover:bg-pink-50"}`}>
                                            <Sparkles className={`h-5 w-5 ${post.hasGivenGratitude ? "fill-current" : ""}`} />
                                        </div>
                                        <span className="font-medium">{post.gratitudeCount}</span>
                                    </button>

                                    <button className="flex items-center gap-2 text-zen-500 hover:text-zen-900 transition-colors">
                                        <div className="p-2 rounded-full hover:bg-zen-50">
                                            <MessageCircle className="h-5 w-5" />
                                        </div>
                                        <span className="font-medium">Comment</span>
                                    </button>

                                    <button className="flex items-center gap-2 text-zen-500 hover:text-zen-900 transition-colors ml-auto">
                                        <div className="p-2 rounded-full hover:bg-zen-50">
                                            <Share2 className="h-5 w-5" />
                                        </div>
                                    </button>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
