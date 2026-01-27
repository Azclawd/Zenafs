"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function BookSession() {
    const [loading, setLoading] = useState(false);
    const [therapist, setTherapist] = useState<any>(null);
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [duration, setDuration] = useState("60");
    const [message, setMessage] = useState("");
    const router = useRouter();

    useEffect(() => {
        loadTherapist();
    }, []);

    async function loadTherapist() {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) return;

        // Get therapist from most recent appointment
        const { data: appointments } = await supabase
            .from("appointments")
            .select("therapist_id")
            .eq("client_id", user.id)
            .order("created_at", { ascending: false })
            .limit(1);

        if (appointments && appointments.length > 0) {
            const { data: therapistData } = await supabase
                .from("profiles")
                .select("*")
                .eq("id", appointments[0].therapist_id)
                .single();

            setTherapist(therapistData);
        }
    }

    async function handleBooking(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();

            if (!user || !therapist) {
                setMessage("Please ensure you have a therapist assigned");
                setLoading(false);
                return;
            }

            // Combine date and time
            const startTime = new Date(`${date}T${time}`);
            const endTime = new Date(startTime.getTime() + parseInt(duration) * 60000);

            const { error } = await supabase
                .from("appointments")
                .insert({
                    client_id: user.id,
                    therapist_id: therapist.id,
                    start_time: startTime.toISOString(),
                    end_time: endTime.toISOString(),
                    status: "pending",
                    payment_status: "unpaid"
                });

            if (error) throw error;

            setMessage("Session booked successfully! Your therapist will confirm shortly.");
            setTimeout(() => router.push("/dashboard/client"), 2000);
        } catch (error: any) {
            console.error("Booking error:", error);
            setMessage(error.message || "Failed to book session");
        } finally {
            setLoading(false);
        }
    }

    if (!therapist) {
        return (
            <div className="max-w-2xl mx-auto px-4 py-8">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">No Therapist Assigned</h2>
                    <p className="text-gray-600">A therapist will be assigned to you soon. Please check back later.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Book a Session</h1>
            <p className="text-gray-600 mb-8">Schedule a therapy session with {therapist.full_name}</p>

            {/* Therapist Info */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center">
                        <span className="text-2xl font-semibold text-teal-600">
                            {therapist.full_name?.[0] || "T"}
                        </span>
                    </div>
                    <div>
                        <p className="font-semibold text-gray-900">{therapist.full_name}</p>
                        <p className="text-sm text-gray-500">{therapist.email}</p>
                    </div>
                </div>
            </div>

            {/* Booking Form */}
            <form onSubmit={handleBooking} className="bg-white rounded-lg shadow p-6">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Date
                        </label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            min={new Date().toISOString().split("T")[0]}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Time
                        </label>
                        <input
                            type="time"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Duration
                        </label>
                        <select
                            value={duration}
                            onChange={(e) => setDuration(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        >
                            <option value="30">30 minutes</option>
                            <option value="60">60 minutes</option>
                            <option value="90">90 minutes</option>
                        </select>
                    </div>

                    {message && (
                        <div className={`p-4 rounded-lg ${
                            message.includes("success")
                                ? "bg-green-50 text-green-800"
                                : "bg-red-50 text-red-800"
                        }`}>
                            {message}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-teal-600 text-white py-3 rounded-lg font-medium hover:bg-teal-700 transition disabled:bg-gray-400"
                    >
                        {loading ? "Booking..." : "Book Session"}
                    </button>
                </div>
            </form>
        </div>
    );
}
