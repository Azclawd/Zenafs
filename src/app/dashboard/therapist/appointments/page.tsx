import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getProfile, getTherapistAppointments } from "@/lib/database/queries";

export default async function TherapistAppointments() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) redirect("/login");

    const profile = await getProfile(user.id);

    if (!profile || profile.role !== "therapist") {
        redirect("/dashboard");
    }

    const appointments = await getTherapistAppointments(user.id);

    // Categorize appointments
    const now = new Date();
    const upcoming = appointments.filter(apt =>
        new Date(apt.start_time) > now && apt.status !== "cancelled"
    );
    const past = appointments.filter(apt =>
        new Date(apt.start_time) <= now || apt.status === "completed"
    );
    const pending = appointments.filter(apt => apt.status === "pending");

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Appointments</h1>
                <p className="text-gray-600 mt-2">Manage all your therapy sessions</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow p-6">
                    <p className="text-sm text-gray-600">Upcoming</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{upcoming.length}</p>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                    <p className="text-sm text-gray-600">Pending Approval</p>
                    <p className="text-3xl font-bold text-yellow-600 mt-1">{pending.length}</p>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                    <p className="text-sm text-gray-600">Completed</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{past.filter(a => a.status === "completed").length}</p>
                </div>
            </div>

            {/* Pending Appointments */}
            {pending.length > 0 && (
                <div className="bg-white rounded-lg shadow p-6 mb-8">
                    <h2 className="text-xl font-semibold mb-4">Pending Approval</h2>
                    <div className="space-y-3">
                        {pending.map((apt) => (
                            <div key={apt.id} className="border border-yellow-200 bg-yellow-50 rounded-lg p-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-medium text-gray-900">
                                            Client ID: {apt.client_id.substring(0, 8)}...
                                        </p>
                                        <p className="text-sm text-gray-600 mt-1">
                                            {new Date(apt.start_time).toLocaleDateString("en-US", {
                                                weekday: "long",
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric"
                                            })}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            {new Date(apt.start_time).toLocaleTimeString("en-US", {
                                                hour: "2-digit",
                                                minute: "2-digit"
                                            })} - {new Date(apt.end_time).toLocaleTimeString("en-US", {
                                                hour: "2-digit",
                                                minute: "2-digit"
                                            })}
                                        </p>
                                    </div>
                                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                                        Pending
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Upcoming Appointments */}
            <div className="bg-white rounded-lg shadow p-6 mb-8">
                <h2 className="text-xl font-semibold mb-4">Upcoming Sessions</h2>
                {upcoming.length > 0 ? (
                    <div className="space-y-3">
                        {upcoming.map((apt) => (
                            <div key={apt.id} className="border border-gray-200 rounded-lg p-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-medium text-gray-900">
                                            Client ID: {apt.client_id.substring(0, 8)}...
                                        </p>
                                        <p className="text-sm text-gray-600 mt-1">
                                            {new Date(apt.start_time).toLocaleDateString("en-US", {
                                                weekday: "long",
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric"
                                            })}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            {new Date(apt.start_time).toLocaleTimeString("en-US", {
                                                hour: "2-digit",
                                                minute: "2-digit"
                                            })} - {new Date(apt.end_time).toLocaleTimeString("en-US", {
                                                hour: "2-digit",
                                                minute: "2-digit"
                                            })}
                                        </p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                        apt.status === "confirmed" ? "bg-green-100 text-green-800" :
                                        "bg-gray-100 text-gray-800"
                                    }`}>
                                        {apt.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <p className="text-gray-500">No upcoming sessions</p>
                    </div>
                )}
            </div>

            {/* Past Appointments */}
            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">Past Sessions</h2>
                {past.length > 0 ? (
                    <div className="space-y-3">
                        {past.slice(0, 10).map((apt) => (
                            <div key={apt.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-medium text-gray-900">
                                            Client ID: {apt.client_id.substring(0, 8)}...
                                        </p>
                                        <p className="text-sm text-gray-600 mt-1">
                                            {new Date(apt.start_time).toLocaleDateString("en-US", {
                                                weekday: "long",
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric"
                                            })}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            {new Date(apt.start_time).toLocaleTimeString("en-US", {
                                                hour: "2-digit",
                                                minute: "2-digit"
                                            })} - {new Date(apt.end_time).toLocaleTimeString("en-US", {
                                                hour: "2-digit",
                                                minute: "2-digit"
                                            })}
                                        </p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                        apt.status === "completed" ? "bg-blue-100 text-blue-800" :
                                        apt.status === "cancelled" ? "bg-red-100 text-red-800" :
                                        "bg-gray-100 text-gray-800"
                                    }`}>
                                        {apt.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                        {past.length > 10 && (
                            <p className="text-sm text-gray-500 text-center mt-4">
                                Showing 10 of {past.length} past sessions
                            </p>
                        )}
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <p className="text-gray-500">No past sessions</p>
                    </div>
                )}
            </div>
        </div>
    );
}
