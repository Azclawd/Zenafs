import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Users, Sparkles, MessageCircle, MoreHorizontal } from "lucide-react";
import { redirect } from "next/navigation";
import { formatDistanceToNow } from "date-fns";

export default async function CommunityPage() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // Fetch community groups
    const { data: groups } = await supabase
        .from("community_groups")
        .select("*")
        .order("created_at", { ascending: false });

    // Fetch community posts with author and gratitude count
    const { data: posts } = await supabase
        .from("community_posts")
        .select("*, author:profiles!author_id(full_name), gratitude_tokens(count)")
        .order("created_at", { ascending: false })
        .limit(20);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-serif font-medium text-zen-900">Community</h1>
                <p className="text-zen-600 mt-2">Connect with others on similar wellness journeys</p>
            </div>

            {/* Community Groups */}
            {groups && groups.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {groups.map((group) => (
                        <Card key={group.id} className="border-none shadow-sm bg-white hover:shadow-md transition-shadow cursor-pointer">
                            <CardContent className="p-6 text-center">
                                <div className="h-12 w-12 rounded-full bg-zen-100 flex items-center justify-center mx-auto mb-3">
                                    <Users className="h-6 w-6 text-zen-600" />
                                </div>
                                <h3 className="font-medium text-zen-900 text-sm">{group.name}</h3>
                                <p className="text-xs text-zen-500 mt-1">{group.category}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Feed */}
            <div className="max-w-2xl mx-auto space-y-6">
                {/* Create Post */}
                <Card className="border-none shadow-sm bg-white">
                    <CardContent className="p-4">
                        <div className="flex gap-4">
                            <div className="h-10 w-10 rounded-full bg-zen-100 flex-shrink-0" />
                            <div className="flex-1">
                                <input
                                    type="text"
                                    placeholder="Share a moment of gratitude or a small win..."
                                    className="w-full bg-transparent border-none focus:ring-0 text-lg placeholder:text-zen-400 p-2"
                                    disabled
                                />
                                <div className="flex justify-end mt-2">
                                    <Button className="bg-zen-900 text-white hover:bg-zen-800 rounded-full px-6" disabled>
                                        Post
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Posts */}
                {posts && posts.length > 0 ? (
                    <div className="space-y-4">
                        {posts.map((post) => (
                            <Card key={post.id} className="border-none shadow-sm bg-white">
                                <CardContent className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center text-zen-700 font-medium">
                                                {post.author?.full_name?.[0] || "A"}
                                            </div>
                                            <div>
                                                <p className="font-medium text-zen-900">
                                                    {post.author?.full_name || "Anonymous"}
                                                </p>
                                                <p className="text-xs text-zen-500">
                                                    {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                                                </p>
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="icon" className="text-zen-400">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </div>

                                    <p className="text-zen-800 text-lg leading-relaxed mb-4">{post.content}</p>

                                    <div className="flex items-center gap-6 pt-4 border-t border-zen-50">
                                        <button className="flex items-center gap-2 text-zen-500 hover:text-pink-500 transition-colors">
                                            <div className="p-2 rounded-full hover:bg-pink-50">
                                                <Sparkles className="h-5 w-5" />
                                            </div>
                                            <span className="font-medium">{post.gratitude_count || 0}</span>
                                        </button>

                                        <button className="flex items-center gap-2 text-zen-500 hover:text-zen-900 transition-colors">
                                            <div className="p-2 rounded-full hover:bg-zen-50">
                                                <MessageCircle className="h-5 w-5" />
                                            </div>
                                            <span className="font-medium">Comment</span>
                                        </button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <Card className="border-none shadow-sm bg-white">
                        <CardContent className="py-12 text-center">
                            <Users className="h-12 w-12 text-zen-300 mx-auto mb-4" />
                            <p className="text-zen-500">No posts yet. Be the first to share!</p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
