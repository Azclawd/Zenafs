"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Leaf, LayoutDashboard, Users, Calendar, FileText, LogOut, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const sidebarItems = [
    { name: "Overview", href: "/therapist", icon: LayoutDashboard },
    { name: "My Clients", href: "/therapist/clients", icon: Users },
    { name: "Schedule", href: "/therapist/schedule", icon: Calendar },
    { name: "Clinical Notes", href: "/therapist/notes", icon: FileText },
    { name: "Settings", href: "/therapist/settings", icon: Settings },
];

export default function TherapistLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    return (
        <div className="min-h-screen bg-stone-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-stone-900 text-stone-300 border-r border-stone-800 hidden md:flex flex-col fixed inset-y-0">
                <div className="p-6 border-b border-stone-800">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zen-500 text-white">
                            <Leaf className="h-5 w-5" />
                        </div>
                        <span className="text-xl font-serif font-bold text-white">
                            Zenafs <span className="text-xs font-sans font-normal text-stone-400 block">Pro Portal</span>
                        </span>
                    </Link>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    {sidebarItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                                    isActive
                                        ? "bg-stone-800 text-white"
                                        : "hover:bg-stone-800 hover:text-white"
                                )}
                            >
                                <item.icon className="h-5 w-5" />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-stone-800">
                    <Link
                        href="/login"
                        className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-red-400 hover:bg-red-900/20 transition-colors"
                    >
                        <LogOut className="h-5 w-5" />
                        Sign Out
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 p-8">
                {children}
            </main>
        </div>
    );
}
