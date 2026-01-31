import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // Get role from metadata (no database query)
    const role = (user.user_metadata?.role || user.app_metadata?.role || "client") as "client" | "therapist";

    // Get basic profile info with one simple query
    const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, email")
        .eq("id", user.id)
        .single();

    return (
        <div className="flex h-screen bg-slate-50">
            {/* Sidebar */}
            <DashboardSidebar
                role={role}
                userName={profile?.full_name || profile?.email || "User"}
            />

            {/* Main Content */}
            <main className="flex-1 md:ml-64 overflow-y-auto">
                <div className="max-w-7xl mx-auto p-4 md:p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
