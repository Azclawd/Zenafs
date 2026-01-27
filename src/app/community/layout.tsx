"use client";

import { Button } from "@/components/ui/Button";
import { Users, Heart, Dumbbell, Baby, Sparkles, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const groups = [
    { name: "General Wellness", href: "/community", icon: Heart },
    { name: "Mothers Support", href: "/community/groups/mothers", icon: Baby },
    { name: "Fitness & Health", href: "/community/groups/fitness", icon: Dumbbell },
    { name: "Anxiety Circle", href: "/community/groups/anxiety", icon: Users },
];

export default function CommunityLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    return (
        <div className="min-h-screen bg-zen-50">
            {/* Top Navigation */}
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-zen-100">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard/client">
                            <Button variant="ghost" size="icon" className="rounded-full">
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                        </Link>
                        <span className="text-xl font-serif font-bold text-zen-900 flex items-center gap-2">
                            <Sparkles className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                            Community
                        </span>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-zen-50 rounded-full border border-zen-100">
                            <Sparkles className="h-4 w-4 text-yellow-500" />
                            <span className="text-sm font-medium text-zen-700">128 Gratitude Tokens</span>
                        </div>
                        <div className="h-8 w-8 rounded-full bg-zen-200" />
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8 flex gap-8">
                {/* Sidebar */}
                <aside className="w-64 hidden lg:block space-y-8 sticky top-24 h-fit">
                    <div>
                        <h3 className="text-xs font-bold text-zen-400 uppercase tracking-wider mb-4 px-2">Your Groups</h3>
                        <nav className="space-y-1">
                            {groups.map((group) => {
                                const isActive = pathname === group.href;
                                return (
                                    <Link key={group.name} href={group.href}>
                                        <Button
                                            variant="ghost"
                                            className={`w-full justify-start gap-3 ${isActive ? "bg-white shadow-sm text-zen-900 font-medium" : "text-zen-600 hover:text-zen-900 hover:bg-white/50"}`}
                                        >
                                            <group.icon className={`h-4 w-4 ${isActive ? "text-zen-900" : "text-zen-400"}`} />
                                            {group.name}
                                        </Button>
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>

                    <div className="p-4 bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl border border-purple-100">
                        <h4 className="font-medium text-purple-900 mb-2">Daily Prompt</h4>
                        <p className="text-sm text-purple-700 mb-4">What is one small thing that made you smile today?</p>
                        <Button size="sm" className="w-full bg-white text-purple-900 hover:bg-purple-100 border border-purple-200 shadow-sm">
                            Share Answer
                        </Button>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1">
                    {children}
                </main>

                {/* Right Sidebar (Trending/Suggested) */}
                <aside className="w-80 hidden xl:block space-y-6 sticky top-24 h-fit">
                    <div className="bg-white rounded-2xl p-6 border border-zen-100 shadow-sm">
                        <h3 className="font-medium text-zen-900 mb-4">Trending Topics</h3>
                        <div className="flex flex-wrap gap-2">
                            {["#MorningRoutine", "#Gratitude", "#SelfCareSunday", "#Mindfulness"].map(tag => (
                                <span key={tag} className="px-3 py-1 bg-zen-50 text-zen-600 text-sm rounded-full hover:bg-zen-100 cursor-pointer transition-colors">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}
