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
        <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col fixed inset-y-0">
            {/* Header (calm) */}
            <div className="p-6 border-b border-slate-200">
                <Link href="/" className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-slate-900 flex items-center justify-center">
                        <Sparkles className="h-4 w-4 text-white" />
                    </div>
                    <div>
                        <span className="text-lg font-semibold text-slate-900">Zenafs</span>
                        <p className="text-xs font-medium text-slate-500">
                            {role === "therapist" ? "Therapist Portal" : "Client Portal"}
                        </p>
                    </div>
                </Link>
            </div>

            {/* User */}
            <div className="p-4">
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-semibold text-slate-700">
                            {userName[0]?.toUpperCase() || "U"}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-slate-900 truncate">{userName}</p>
                            <p className="text-xs text-slate-500 capitalize">{role}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation (TheraDash style) */}
            <nav className="flex-1 p-4 space-y-1">
                {sidebarItems.map((item, index) => {
                    const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "group flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-slate-100 text-slate-900"
                                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                            )}
                            style={{
                                animationDelay: `${index * 50}ms`,
                            }}
                        >
                            <div className={cn(
                                "h-9 w-9 rounded-xl flex items-center justify-center",
                                isActive ? "bg-white border border-slate-200" : "bg-slate-100"
                            )}>
                                <item.icon className={cn("h-4 w-4", isActive ? "text-slate-900" : "text-slate-600")} />
                            </div>

                            <span className="flex-1">{item.name}</span>

                            <ChevronRight className={cn(
                                "h-4 w-4 transition-all",
                                isActive ? "opacity-100 text-slate-400" : "opacity-0 group-hover:opacity-100 translate-x-0 group-hover:translate-x-1 text-slate-300"
                            )} />
                        </Link>
                    );
                })}
            </nav>

            {/* Sign Out */}
            <div className="p-4 border-t border-slate-200">
                <button
                    onClick={handleSignOut}
                    className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-rose-600 hover:bg-rose-50 transition-colors w-full"
                >
                    <div className="h-9 w-9 rounded-xl bg-rose-50 flex items-center justify-center">
                        <LogOut className="h-4 w-4" />
                    </div>
                    <span>Sign Out</span>
                </button>
            </div>
        </aside>
    );
}
