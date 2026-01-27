import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getProfile, getTherapistClients } from "@/lib/database/queries";
import Link from "next/link";

export default async function TherapistClients() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) redirect("/login");

    const profile = await getProfile(user.id);

    if (!profile || profile.role !== "therapist") {
        redirect("/dashboard");
    }

    const activeClients = await getTherapistClients(user.id);

    // Get all clients who are not assigned to this therapist
    const { data: allProfiles } = await supabase
        .from("profiles")
        .select("*")
        .eq("role", "client");

    const activeClientIds = new Set(activeClients.map(c => c.id));
    const availableClients = allProfiles?.filter(c => !activeClientIds.has(c.id)) || [];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">My Clients</h1>
                <p className="text-gray-600 mt-2">Manage your client roster</p>
            </div>

            {/* Active Clients */}
            <div className="bg-white rounded-lg shadow p-6 mb-8">
                <h2 className="text-xl font-semibold mb-4">Active Clients ({activeClients.length})</h2>
                {activeClients.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {activeClients.map((client) => (
                            <Link
                                key={client.id}
                                href={`/dashboard/therapist/clients/${client.id}`}
                                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                            >
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                                        <span className="text-xl font-semibold text-teal-600">
                                            {client.full_name?.[0] || "C"}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900">{client.full_name || "Client"}</p>
                                        <p className="text-sm text-gray-500">{client.email}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
                                        Active
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <p className="text-gray-500">No active clients yet</p>
                        <p className="text-sm text-gray-400 mt-2">Assign clients from the available clients below</p>
                    </div>
                )}
            </div>

            {/* Available Clients */}
            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">Available Clients ({availableClients.length})</h2>
                <p className="text-sm text-gray-600 mb-4">
                    These clients are looking for a therapist. Book a session with them to start working together.
                </p>
                {availableClients.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {availableClients.map((client) => (
                            <div key={client.id} className="border border-gray-200 rounded-lg p-4">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                                        <span className="text-xl font-semibold text-gray-600">
                                            {client.full_name?.[0] || "C"}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900">{client.full_name || "Client"}</p>
                                        <p className="text-sm text-gray-500">{client.email}</p>
                                    </div>
                                </div>
                                <Link
                                    href={`/dashboard/therapist/clients/${client.id}`}
                                    className="block w-full text-center bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-700 transition text-sm"
                                >
                                    View Profile
                                </Link>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <p className="text-gray-500">No available clients at the moment</p>
                    </div>
                )}
            </div>
        </div>
    );
}
