import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getProfile, getTherapistClients, getTherapistAppointments } from "@/lib/database/queries";
import TheraRightRail from "@/components/dashboard/therapist/TheraRightRail";
import AnimatedDashboardContent from "@/components/dashboard/therapist/AnimatedDashboardContent";

export default async function TherapistDashboard() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) redirect("/login");

    const profile = await getProfile(user.id);

    if (!profile || profile.role !== "therapist") {
        redirect("/dashboard");
    }

    const clients = await getTherapistClients(user.id);
    const appointments = await getTherapistAppointments(user.id);

    const now = new Date();
    const upcomingAppointments = appointments.filter(apt =>
        new Date(apt.start_time) > now && apt.status !== "cancelled"
    );

    const todayAppointments = upcomingAppointments.filter(apt => {
        const aptDate = new Date(apt.start_time);
        return aptDate.toDateString() === now.toDateString();
    });

    const pendingAppointments = appointments.filter(apt => apt.status === "pending");

    const next = upcomingAppointments[0];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Main */}
            <div className="lg:col-span-8 space-y-6">
                <div>
                    <div className="text-sm font-medium text-slate-500">Therapist Portal</div>
                    <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-900">
                        Welcome back, Dr. {profile?.full_name || "Therapist"}
                    </h1>
                    <p className="mt-1 text-sm text-slate-600">Your practice dashboard</p>
                </div>

                <AnimatedDashboardContent
                    clientsCount={clients.length}
                    todayCount={todayAppointments.length}
                    pendingCount={pendingAppointments.length}
                    weekCount={upcomingAppointments.filter(apt => {
                        const aptDate = new Date(apt.start_time);
                        const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
                        return aptDate <= weekFromNow;
                    }).length}
                    todayAppointments={todayAppointments as any}
                    upcomingAppointments={upcomingAppointments as any}
                />
            </div>

            {/* Right rail */}
            <div className="lg:col-span-4">
                <div className="lg:sticky lg:top-6">
                    <TheraRightRail
                        nextSession={next ? {
                            start: next.start_time,
                            clientLabel: `Client #${next.client_id.substring(0,8)}`,
                            href: "/dashboard/therapist/appointments",
                        } : null}
                    />
                </div>
            </div>
        </div>
    );
}
