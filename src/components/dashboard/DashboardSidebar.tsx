"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    LayoutDashboard,
    Calendar,
    Users,
    Settings,
    LogOut,
    MessageCircle,
    UserCircle,
    BookOpen,
    Sparkles,
    ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

interface DashboardSidebarProps {
    role: "client" | "therapist";
    userName: string;
}

export default function DashboardSidebar({ role, userName }: DashboardSidebarProps) {
    const pathname = usePathname();
    const router = useRouter();

    // Define sidebar items based on role
    const sidebarItems = role === "therapist" ? [
        { name: "Dashboard", href: "/dashboard/therapist", icon: LayoutDashboard, gradient: "from-blue-500 to-cyan-500" },
        { name: "Clients", href: "/dashboard/therapist/clients", icon: UserCircle, gradient: "from-purple-500 to-pink-500" },
        { name: "Appointments", href: "/dashboard/therapist/appointments", icon: Calendar, gradient: "from-orange-500 to-red-500" },
        { name: "Settings", href: "/dashboard/therapist/settings", icon: Settings, gradient: "from-gray-500 to-gray-600" },
    ] : [
        { name: "Dashboard", href: "/dashboard/client", icon: LayoutDashboard, gradient: "from-teal-500 to-emerald-500" },
        { name: "Book Session", href: "/dashboard/client/book", icon: Calendar, gradient: "from-blue-500 to-indigo-500" },
        { name: "Messages", href: "/dashboard/client/chat", icon: MessageCircle, gradient: "from-purple-500 to-pink-500" },
        { name: "My Journey", href: "/dashboard/client/journey", icon: BookOpen, gradient: "from-amber-500 to-orange-500" },
        { name: "Settings", href: "/dashboard/client/settings", icon: Settings, gradient: "from-gray-500 to-gray-600" },
    ];

    const handleSignOut = async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        router.push("/login");
    };

    return (
        <aside className="w-64 bg-white/80 backdrop-blur-xl border-r border-gray-200 hidden md:flex flex-col fixed inset-y-0 shadow-xl">
            {/* Header with animated gradient */}
            <div className="p-6 border-b border-gray-200 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-teal-50 via-blue-50 to-purple-50 opacity-50"></div>
                <div className="relative">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-teal-400 to-blue-600 rounded-lg blur-md opacity-75 group-hover:opacity-100 transition-opacity"></div>
                            <div className="relative bg-gradient-to-br from-teal-500 to-blue-600 p-2 rounded-lg">
                                <Sparkles className="h-5 w-5 text-white" />
                            </div>
                        </div>
                        <div>
                            <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                                Zenafs
                            </span>
                            <p className="text-xs font-medium text-gray-600">
                                {role === "therapist" ? "Therapist Portal" : "Client Portal"}
                            </p>
                        </div>
                    </Link>
                </div>
            </div>

            {/* User Info Card with beam effect */}
            <div className="p-4">
                <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-900 to-gray-800 p-4 shadow-lg">
                    {/* Animated beam effect */}
                    <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-white to-transparent animate-beam"></div>

                    <div className="relative">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-blue-500 rounded-full flex items-center justify-center font-bold text-white shadow-lg">
                                {userName[0]?.toUpperCase() || "U"}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-white truncate">{userName}</p>
                                <p className="text-xs text-gray-400 capitalize">{role}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation with hover effects */}
            <nav className="flex-1 p-4 space-y-2">
                {sidebarItems.map((item, index) => {
                    const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "group relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                                isActive
                                    ? "bg-gradient-to-r from-gray-100 to-gray-50 text-gray-900 shadow-md"
                                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            )}
                            style={{
                                animationDelay: `${index * 50}ms`,
                            }}
                        >
                            {/* Active indicator */}
                            {isActive && (
                                <div className={cn(
                                    "absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full bg-gradient-to-b",
                                    item.gradient
                                )}></div>
                            )}

                            {/* Icon with gradient on hover */}
                            <div className="relative">
                                <div className={cn(
                                    "absolute inset-0 bg-gradient-to-br rounded-lg blur-sm opacity-0 group-hover:opacity-75 transition-opacity",
                                    item.gradient
                                )}></div>
                                <div className={cn(
                                    "relative p-1.5 rounded-lg transition-colors",
                                    isActive
                                        ? `bg-gradient-to-br ${item.gradient} text-white`
                                        : "bg-gray-100 text-gray-600 group-hover:bg-gradient-to-br group-hover:text-white"
                                )}>
                                    <item.icon className="h-4 w-4" />
                                </div>
                            </div>

                            <span className="flex-1">{item.name}</span>

                            {/* Chevron on hover */}
                            <ChevronRight className={cn(
                                "h-4 w-4 transition-all",
                                isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100 translate-x-0 group-hover:translate-x-1"
                            )} />
                        </Link>
                    );
                })}
            </nav>

            {/* Sign Out Button with glow effect */}
            <div className="p-4 border-t border-gray-200">
                <button
                    onClick={handleSignOut}
                    className="group relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-all w-full overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative p-1.5 rounded-lg bg-red-100 text-red-600 group-hover:bg-red-600 group-hover:text-white transition-colors">
                        <LogOut className="h-4 w-4" />
                    </div>
                    <span className="relative">Sign Out</span>
                </button>
            </div>

            {/* Bottom gradient decoration */}
            <div className="h-1 bg-gradient-to-r from-teal-500 via-blue-500 to-purple-500"></div>
        </aside>
    );
}
