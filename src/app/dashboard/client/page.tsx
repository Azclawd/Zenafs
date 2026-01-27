import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Calendar, MessageCircle, BookOpen, Settings, Sparkles, TrendingUp, Heart, CheckCircle2 } from "lucide-react";

export default async function ClientDashboard() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) redirect("/login");

    // ONE simple query - just get basic profile info
    const { data: profile } = await supabase
        .from("profiles")
        .select("id, email, full_name, role")
        .eq("id", user.id)
        .single();

    const quickActions = [
        {
            name: "Book Session",
            href: "/dashboard/client/book",
            icon: Calendar,
            gradient: "from-teal-500 via-emerald-500 to-cyan-500",
            description: "Schedule your next therapy appointment",
            badge: "Popular"
        },
        {
            name: "Messages",
            href: "/dashboard/client/chat",
            icon: MessageCircle,
            gradient: "from-purple-500 via-pink-500 to-rose-500",
            description: "Chat with your therapist",
            badge: null
        },
        {
            name: "My Journey",
            href: "/dashboard/client/journey",
            icon: BookOpen,
            gradient: "from-amber-500 via-orange-500 to-red-500",
            description: "View your progress and notes",
            badge: null
        },
        {
            name: "Settings",
            href: "/dashboard/client/settings",
            icon: Settings,
            gradient: "from-slate-500 via-gray-500 to-zinc-500",
            description: "Manage your profile",
            badge: null
        },
    ];

    return (
        <div className="space-y-8 pb-20">
            {/* Success Banner with animated beam */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 border-2 border-emerald-200 p-8 shadow-xl">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent animate-beam"></div>

                <div className="relative flex items-start gap-4">
                    <div className="flex-shrink-0">
                        <div className="relative">
                            <div className="absolute inset-0 bg-emerald-400 rounded-full blur-xl opacity-50 animate-pulse-glow"></div>
                            <div className="relative w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center shadow-lg">
                                <CheckCircle2 className="w-7 h-7 text-white" strokeWidth={3} />
                            </div>
                        </div>
                    </div>
                    <div className="flex-1">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            Welcome to Your Client Portal! 🎉
                        </h2>
                        <p className="text-gray-700 text-base leading-relaxed">
                            You're successfully logged in and viewing your personalized dashboard. Your therapy journey starts here.
                        </p>
                    </div>
                </div>
            </div>

            {/* Welcome Section with gradient text */}
            <div className="space-y-3">
                <h1 className="text-4xl md:text-5xl font-bold">
                    <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent">
                        Welcome back,
                    </span>
                    <br />
                    <span className="bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-600 bg-clip-text text-transparent">
                        {profile?.full_name || "Friend"}
                    </span>
                </h1>
                <p className="text-xl text-gray-600 font-medium flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-teal-500" />
                    Your therapy journey awaits
                </p>
            </div>

            {/* Stats Cards with hover effects */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white to-gray-50 border border-gray-200 p-6 shadow-lg hover:shadow-2xl transition-all duration-300">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-teal-100 to-emerald-100 rounded-full blur-3xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
                    <div className="relative">
                        <div className="flex items-center justify-between mb-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                                <Heart className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-3xl font-bold text-gray-900">0</span>
                        </div>
                        <p className="text-sm font-semibold text-gray-600">Total Sessions</p>
                        <p className="text-xs text-gray-500 mt-1">Book your first session</p>
                    </div>
                </div>

                <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white to-gray-50 border border-gray-200 p-6 shadow-lg hover:shadow-2xl transition-all duration-300">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full blur-3xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
                    <div className="relative">
                        <div className="flex items-center justify-between mb-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                                <MessageCircle className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-3xl font-bold text-gray-900">0</span>
                        </div>
                        <p className="text-sm font-semibold text-gray-600">Messages</p>
                        <p className="text-xs text-gray-500 mt-1">Start a conversation</p>
                    </div>
                </div>

                <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white to-gray-50 border border-gray-200 p-6 shadow-lg hover:shadow-2xl transition-all duration-300">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full blur-3xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
                    <div className="relative">
                        <div className="flex items-center justify-between mb-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                                <TrendingUp className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-3xl font-bold text-gray-900">0</span>
                        </div>
                        <p className="text-sm font-semibold text-gray-600">Journey Entries</p>
                        <p className="text-xs text-gray-500 mt-1">Track your progress</p>
                    </div>
                </div>
            </div>

            {/* Quick Actions Grid with enhanced cards */}
            <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <span>Quick Actions</span>
                    <div className="h-1 flex-1 bg-gradient-to-r from-gray-200 via-transparent to-transparent rounded-full"></div>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {quickActions.map((action, index) => (
                        <Link
                            key={action.name}
                            href={action.href}
                            className="group relative overflow-hidden rounded-2xl bg-white border-2 border-gray-100 p-6 hover:border-gray-300 shadow-lg hover:shadow-2xl transition-all duration-300"
                            style={{
                                animationDelay: `${index * 100}ms`,
                            }}
                        >
                            {/* Gradient background on hover */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>

                            {/* Badge */}
                            {action.badge && (
                                <div className="absolute top-4 right-4">
                                    <span className="px-3 py-1 bg-gradient-to-r from-teal-500 to-emerald-500 text-white text-xs font-bold rounded-full shadow-lg">
                                        {action.badge}
                                    </span>
                                </div>
                            )}

                            <div className="relative flex items-start gap-4">
                                {/* Icon with glow effect */}
                                <div className="relative flex-shrink-0">
                                    <div className={`absolute inset-0 bg-gradient-to-br ${action.gradient} rounded-2xl blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-300`}></div>
                                    <div className={`relative w-16 h-16 bg-gradient-to-br ${action.gradient} rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300`}>
                                        <action.icon className="w-8 h-8 text-white" strokeWidth={2.5} />
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-gray-800 transition-colors">
                                        {action.name}
                                    </h3>
                                    <p className="text-sm text-gray-600 leading-relaxed">
                                        {action.description}
                                    </p>
                                    <div className="mt-3 flex items-center gap-2 text-sm font-semibold">
                                        <span className={`bg-gradient-to-r ${action.gradient} bg-clip-text text-transparent group-hover:translate-x-1 transition-transform duration-300`}>
                                            Get started →
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Getting Started Guide - Sticky Section */}
            <div className="sticky top-4 z-10">
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-2 border-blue-200 p-8 shadow-xl">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>

                    <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <Sparkles className="w-6 h-6 text-indigo-600" />
                        Getting Started
                    </h3>
                    <div className="space-y-4">
                        {[
                            { text: "Complete your profile in Settings", done: false },
                            { text: "Book your first therapy session", done: false },
                            { text: "Explore the Messages feature", done: false },
                            { text: "Check out your Journey page", done: false },
                        ].map((step, index) => (
                            <div
                                key={index}
                                className="flex items-start gap-4 p-4 rounded-xl bg-white/80 backdrop-blur-sm border border-blue-100 hover:border-blue-300 transition-all duration-200"
                            >
                                <div className={`flex-shrink-0 w-6 h-6 rounded-full border-2 ${
                                    step.done
                                        ? "bg-gradient-to-br from-teal-500 to-emerald-600 border-transparent"
                                        : "border-gray-300"
                                } flex items-center justify-center`}>
                                    {step.done && <CheckCircle2 className="w-4 h-4 text-white" strokeWidth={3} />}
                                </div>
                                <p className="text-base text-gray-700 font-medium flex-1">
                                    {step.text}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
