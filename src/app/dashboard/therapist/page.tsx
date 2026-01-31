import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getProfile, getTherapistClients, getTherapistAppointments } from "@/lib/database/queries";
import Link from "next/link";
import { Calendar, Users, TrendingUp, AlertCircle } from "lucide-react";
import TheraKpiCard from "@/components/dashboard/therapist/TheraKpiCard";
import TheraScheduleCard from "@/components/dashboard/therapist/TheraScheduleCard";
import TheraRightRail from "@/components/dashboard/therapist/TheraRightRail";

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

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                    <TheraKpiCard label="Active clients" value={clients.length} helper="Under your care" icon={Users} tone="blue" />
                    <TheraKpiCard label="Today" value={todayAppointments.length} helper="Sessions scheduled" icon={Calendar} tone="teal" />
                    <TheraKpiCard label="Pending" value={pendingAppointments.length} helper="Awaiting confirmation" icon={AlertCircle} tone="amber" />
                    <TheraKpiCard label="This week" value={upcomingAppointments.filter(apt => {
                        const aptDate = new Date(apt.start_time);
                        const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
                        return aptDate <= weekFromNow;
                    }).length} helper="Upcoming sessions" icon={TrendingUp} tone="slate" />
                </div>

                <TheraScheduleCard
                    viewAllHref="/dashboard/therapist/appointments"
                    items={todayAppointments as any}
                />

                {/* Placeholder for next bento: Upcoming sessions list/table */}
                <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5">
                    <div className="text-base font-semibold text-slate-900">Upcoming sessions</div>
                    <div className="mt-2 text-sm text-slate-600">We’ll add the TheraDash-style table next.</div>
                </div>
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
