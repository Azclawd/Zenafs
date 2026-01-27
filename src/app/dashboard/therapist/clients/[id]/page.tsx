import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getProfile, getTherapistNotes, getClientAppointments } from "@/lib/database/queries";
import ClientDetailTabs from "./ClientDetailTabs";

export default async function ClientDetail({ params }: { params: { id: string } }) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) redirect("/login");

    const therapistProfile = await getProfile(user.id);

    if (!therapistProfile || therapistProfile.role !== "therapist") {
        redirect("/dashboard");
    }

    // Get client profile
    const clientProfile = await getProfile(params.id);

    if (!clientProfile || clientProfile.role !== "client") {
        redirect("/dashboard/therapist/clients");
    }

    // Get client's appointments with this therapist
    const allAppointments = await getClientAppointments(params.id);
    const clientAppointments = allAppointments.filter(apt => apt.therapist_id === user.id);

    // Get notes for this client
    const notes = await getTherapistNotes(user.id, params.id);

    // Check if therapist has worked with this client
    const isActiveClient = clientAppointments.length > 0;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Client Header */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center">
                            <span className="text-3xl font-semibold text-teal-600">
                                {clientProfile.full_name?.[0] || "C"}
                            </span>
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">{clientProfile.full_name || "Client"}</h1>
                            <p className="text-gray-600">{clientProfile.email}</p>
                            <div className="flex gap-2 mt-2">
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                    isActiveClient
                                        ? "bg-green-100 text-green-800"
                                        : "bg-gray-100 text-gray-800"
                                }`}>
                                    {isActiveClient ? "Active Client" : "Available"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Client Details Tabs */}
            <ClientDetailTabs
                clientId={params.id}
                therapistId={user.id}
                appointments={clientAppointments}
                notes={notes}
                isActiveClient={isActiveClient}
            />
        </div>
    );
}
