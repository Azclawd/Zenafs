"use server";

import { createClient } from "@/lib/supabase/server";
import { cache } from "react";

// Cache queries for better performance
export const getProfile = cache(async (userId: string) => {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

    if (error) console.error("Error fetching profile:", error);
    return data;
});

export async function getClientAppointments(clientId: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("appointments")
        .select("*")
        .eq("client_id", clientId)
        .order("start_time", { ascending: true });

    if (error) console.error("Error fetching appointments:", error);
    return data || [];
}

export async function getTherapistFromAppointment(clientId: string) {
    const supabase = await createClient();

    // Get the therapist from the most recent appointment
    const { data: appointments } = await supabase
        .from("appointments")
        .select("therapist_id")
        .eq("client_id", clientId)
        .order("created_at", { ascending: false })
        .limit(1);

    if (!appointments || appointments.length === 0) return null;

    const { data: therapist } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", appointments[0].therapist_id)
        .single();

    return therapist;
}

export async function getTherapistClients(therapistId: string) {
    const supabase = await createClient();

    // Get unique clients from appointments
    const { data: appointments } = await supabase
        .from("appointments")
        .select("client_id")
        .eq("therapist_id", therapistId);

    if (!appointments || appointments.length === 0) return [];

    // Get unique client IDs
    const clientIds = [...new Set(appointments.map(apt => apt.client_id))];

    // Fetch client profiles
    const { data: clients } = await supabase
        .from("profiles")
        .select("*")
        .in("id", clientIds);

    return clients || [];
}

export async function getTherapistAppointments(therapistId: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("appointments")
        .select("*")
        .eq("therapist_id", therapistId)
        .order("start_time", { ascending: true });

    if (error) console.error("Error fetching appointments:", error);
    return data || [];
}

export async function getClientNotes(clientId: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("notes")
        .select("*")
        .eq("client_id", clientId)
        .eq("visibility", "shared")
        .order("created_at", { ascending: false });

    if (error) console.error("Error fetching notes:", error);
    return data || [];
}

export async function getTherapistNotes(therapistId: string, clientId?: string) {
    const supabase = await createClient();
    let query = supabase
        .from("notes")
        .select("*")
        .eq("therapist_id", therapistId)
        .order("created_at", { ascending: false });

    if (clientId) {
        query = query.eq("client_id", clientId);
    }

    const { data, error } = await query;
    if (error) console.error("Error fetching notes:", error);
    return data || [];
}

export async function getMessages(userId: string, otherUserId: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("messages")
        .select("*")
        .or(`sender_id.eq.${userId},sender_id.eq.${otherUserId}`)
        .or(`receiver_id.eq.${userId},receiver_id.eq.${otherUserId}`)
        .order("created_at", { ascending: true });

    if (error) console.error("Error fetching messages:", error);

    // Filter to only this conversation
    const filtered = data?.filter(msg =>
        (msg.sender_id === userId && msg.receiver_id === otherUserId) ||
        (msg.sender_id === otherUserId && msg.receiver_id === userId)
    ) || [];

    return filtered;
}
