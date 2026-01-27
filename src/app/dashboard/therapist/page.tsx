import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getProfile, getTherapistClients, getTherapistAppointments } from "@/lib/database/queries";
import Link from "next/link";
import { Calendar, Users, TrendingUp, Clock, UserCircle, CheckCircle2, AlertCircle, Sparkles, Award, Target } from "lucide-react";
import { Marquee } from "@/components/ui/Marquee";

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

    // Quick stats for marquee
    const stats = [
        { label: "Total Clients", value: clients.length, icon: Users },
        { label: "Today's Sessions", value: todayAppointments.length, icon: Calendar },
        { label: "Pending Requests", value: pendingAppointments.length, icon: AlertCircle },
        { label: "This Week", value: upcomingAppointments.filter(apt => {
            const aptDate = new Date(apt.start_time);
            const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
            return aptDate <= weekFromNow;
        }).length, icon: TrendingUp },
    ];

    return (
        <div className="space-y-8 pb-20">
            {/* Marquee Stats Banner */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-2 shadow-2xl">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-white/50 via-white to-white/50 animate-beam"></div>

                <Marquee speed="normal" pauseOnHover className="py-4">
                    {stats.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <div key={index} className="flex items-center gap-3 px-6 py-2 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                                <Icon className="w-5 h-5 text-white" strokeWidth={2.5} />
                                <div>
                                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                                    <p className="text-xs text-white/80 font-medium">{stat.label}</p>
                                </div>
                            </div>
                        );
                    })}
                </Marquee>
            </div>

            {/* Welcome Section */}
            <div className="space-y-3">
                <h1 className="text-4xl md:text-5xl font-bold">
                    <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent">
                        Welcome back,
                    </span>
                    <br />
                    <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        Dr. {profile?.full_name || "Therapist"}
                    </span>
                </h1>
                <p className="text-xl text-gray-600 font-medium flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-blue-500" />
                    Your practice dashboard
                </p>
            </div>

            {/* Main Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white to-blue-50 border-2 border-blue-200 p-6 shadow-lg hover:shadow-2xl transition-all duration-300">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full blur-3xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
                    <div className="relative">
                        <div className="flex items-center justify-between mb-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                                <Users className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-3xl font-bold text-gray-900">{clients.length}</span>
                        </div>
                        <p className="text-sm font-semibold text-gray-700">Active Clients</p>
                        <p className="text-xs text-gray-500 mt-1">Under your care</p>
                    </div>
                </div>

                <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white to-purple-50 border-2 border-purple-200 p-6 shadow-lg hover:shadow-2xl transition-all duration-300">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full blur-3xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
                    <div className="relative">
                        <div className="flex items-center justify-between mb-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                                <Calendar className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-3xl font-bold text-gray-900">{todayAppointments.length}</span>
                        </div>
                        <p className="text-sm font-semibold text-gray-700">Today's Sessions</p>
                        <p className="text-xs text-gray-500 mt-1">Scheduled for today</p>
                    </div>
                </div>

                <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white to-amber-50 border-2 border-amber-200 p-6 shadow-lg hover:shadow-2xl transition-all duration-300">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full blur-3xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
                    <div className="relative">
                        <div className="flex items-center justify-between mb-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                                <AlertCircle className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-3xl font-bold text-gray-900">{pendingAppointments.length}</span>
                        </div>
                        <p className="text-sm font-semibold text-gray-700">Pending Requests</p>
                        <p className="text-xs text-gray-500 mt-1">Awaiting confirmation</p>
                    </div>
                </div>

                <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white to-teal-50 border-2 border-teal-200 p-6 shadow-lg hover:shadow-2xl transition-all duration-300">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-teal-100 to-emerald-100 rounded-full blur-3xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
                    <div className="relative">
                        <div className="flex items-center justify-between mb-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                                <TrendingUp className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-3xl font-bold text-gray-900">{upcomingAppointments.length}</span>
                        </div>
                        <p className="text-sm font-semibold text-gray-700">Upcoming</p>
                        <p className="text-xs text-gray-500 mt-1">All future sessions</p>
                    </div>
                </div>
            </div>

            {/* Today's Schedule & Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Today's Schedule */}
                <div className="lg:col-span-2 relative overflow-hidden rounded-2xl bg-white border-2 border-gray-200 shadow-xl">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 animate-beam"></div>

                    <div className="p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                <Clock className="w-6 h-6 text-blue-600" />
                                Today's Schedule
                            </h2>
                            <Link
                                href="/dashboard/therapist/appointments"
                                className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition"
                            >
                                View All →
                            </Link>
                        </div>

                        {todayAppointments.length > 0 ? (
                            <div className="space-y-3">
                                {todayAppointments.slice(0, 4).map((apt, index) => (
                                    <div
                                        key={apt.id}
                                        className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 p-4 hover:border-blue-300 transition-all duration-200"
                                        style={{ animationDelay: `${index * 100}ms` }}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="relative">
                                                <div className="absolute inset-0 bg-blue-400 rounded-full blur-lg opacity-0 group-hover:opacity-50 transition-opacity"></div>
                                                <div className="relative w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                                                    <UserCircle className="w-6 h-6 text-white" />
                                                </div>
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-semibold text-gray-900">
                                                    Client #{apt.client_id.substring(0, 8)}
                                                </p>
                                                <p className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                                                    <Clock className="w-4 h-4" />
                                                    {new Date(apt.start_time).toLocaleTimeString("en-US", {
                                                        hour: "2-digit",
                                                        minute: "2-digit"
                                                    })} - {new Date(apt.end_time).toLocaleTimeString("en-US", {
                                                        hour: "2-digit",
                                                        minute: "2-digit"
                                                    })}
                                                </p>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-lg ${
                                                apt.status === "confirmed" ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white" :
                                                apt.status === "pending" ? "bg-gradient-to-r from-yellow-500 to-orange-600 text-white" :
                                                "bg-gray-100 text-gray-700"
                                            }`}>
                                                {apt.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <div className="relative inline-block mb-4">
                                    <div className="absolute inset-0 bg-gray-300 rounded-full blur-xl opacity-30"></div>
                                    <div className="relative w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                                        <Calendar className="w-8 h-8 text-gray-400" />
                                    </div>
                                </div>
                                <p className="text-gray-600 font-medium">No sessions scheduled for today</p>
                                <p className="text-sm text-gray-500 mt-1">Enjoy your day off!</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="space-y-4">
                    <Link
                        href="/dashboard/therapist/clients"
                        className="group relative overflow-hidden block rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 p-6 shadow-xl hover:shadow-2xl transition-all duration-300"
                    >
                        <div className="absolute inset-0 bg-white rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity"></div>
                        <div className="relative">
                            <UserCircle className="w-10 h-10 text-white mb-3" strokeWidth={2.5} />
                            <h3 className="text-xl font-bold text-white mb-2">Manage Clients</h3>
                            <p className="text-blue-100 text-sm">View and assign clients →</p>
                        </div>
                    </Link>

                    <Link
                        href="/dashboard/therapist/appointments"
                        className="group relative overflow-hidden block rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 p-6 shadow-xl hover:shadow-2xl transition-all duration-300"
                    >
                        <div className="absolute inset-0 bg-white rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity"></div>
                        <div className="relative">
                            <Calendar className="w-10 h-10 text-white mb-3" strokeWidth={2.5} />
                            <h3 className="text-xl font-bold text-white mb-2">All Appointments</h3>
                            <p className="text-purple-100 text-sm">View full schedule →</p>
                        </div>
                    </Link>

                    <Link
                        href="/dashboard/therapist/settings"
                        className="group relative overflow-hidden block rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 p-6 shadow-xl hover:shadow-2xl transition-all duration-300"
                    >
                        <div className="absolute inset-0 bg-white rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity"></div>
                        <div className="relative">
                            <Target className="w-10 h-10 text-white mb-3" strokeWidth={2.5} />
                            <h3 className="text-xl font-bold text-white mb-2">Settings</h3>
                            <p className="text-teal-100 text-sm">Update profile →</p>
                        </div>
                    </Link>
                </div>
            </div>

            {/* Recent Clients - Horizontal Scroll */}
            {clients.length > 0 && (
                <div className="relative overflow-hidden rounded-2xl bg-white border-2 border-gray-200 p-6 shadow-xl">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-500 via-emerald-500 to-cyan-500"></div>

                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <Award className="w-6 h-6 text-teal-600" />
                        Your Clients
                    </h2>

                    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                        {clients.slice(0, 8).map((client, index) => (
                            <Link
                                key={client.id}
                                href={`/dashboard/therapist/clients/${client.id}`}
                                className="group flex-shrink-0 w-48 relative overflow-hidden rounded-xl bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 p-4 hover:border-teal-300 shadow-lg hover:shadow-xl transition-all duration-200"
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                <div className="flex flex-col items-center text-center">
                                    <div className="relative mb-3">
                                        <div className="absolute inset-0 bg-teal-400 rounded-full blur-lg opacity-0 group-hover:opacity-50 transition-opacity"></div>
                                        <div className="relative w-16 h-16 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                                            <span className="text-2xl font-bold text-white">
                                                {client.full_name?.[0] || "C"}
                                            </span>
                                        </div>
                                    </div>
                                    <p className="font-semibold text-gray-900 truncate w-full">{client.full_name || "Client"}</p>
                                    <p className="text-xs text-gray-500 truncate w-full mt-1">{client.email}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
