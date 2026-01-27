"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createAppointment(data: {
    clientId: string;
    therapistId: string;
    startTime: string;
    endTime: string;
}) {
    const supabase = await createClient();

    const { data: appointment, error } = await supabase
        .from("appointments")
        .insert({
            client_id: data.clientId,
            therapist_id: data.therapistId,
            start_time: data.startTime,
            end_time: data.endTime,
            status: "pending",
            payment_status: "unpaid",
        })
        .select()
        .single();

    if (error) {
        console.error("Error creating appointment:", error);
        return { success: false, error: error.message };
    }

    revalidatePath("/dashboard/client");
    revalidatePath("/dashboard/therapist");
    return { success: true, data: appointment };
}

export async function sendMessage(senderId: string, receiverId: string, content: string) {
    const supabase = await createClient();

    const { data: message, error } = await supabase
        .from("messages")
        .insert({
            sender_id: senderId,
            receiver_id: receiverId,
            content: content.trim(),
            is_read: false,
        })
        .select()
        .single();

    if (error) {
        console.error("Error sending message:", error);
        return { success: false, error: error.message };
    }

    return { success: true, data: message };
}

export async function createNote(data: {
    therapistId: string;
    clientId: string;
    title: string;
    content: string;
    type: "SOAP" | "DAP" | "General";
    visibility: "private" | "shared";
}) {
    const supabase = await createClient();

    const { data: note, error } = await supabase
        .from("notes")
        .insert({
            therapist_id: data.therapistId,
            client_id: data.clientId,
            title: data.title,
            content: data.content,
            type: data.type,
            visibility: data.visibility,
        })
        .select()
        .single();

    if (error) {
        console.error("Error creating note:", error);
        return { success: false, error: error.message };
    }

    revalidatePath("/dashboard/therapist");
    revalidatePath("/dashboard/client/journey");
    return { success: true, data: note };
}

export async function updateProfile(userId: string, updates: {
    full_name?: string;
    avatar_url?: string;
}) {
    const supabase = await createClient();

    const { error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", userId);

    if (error) {
        console.error("Error updating profile:", error);
        return { success: false, error: error.message };
    }

    revalidatePath("/dashboard");
    return { success: true };
}
