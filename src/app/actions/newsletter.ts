"use server";

import { createClient } from "@/lib/supabase/server";

export async function subscribeNewsletter(formData: FormData) {
    const supabase = await createClient();

    const email = formData.get("email") as string;

    if (!email) {
        return { error: "Email is required" };
    }

    const { error } = await supabase.from("newsletter_subscribers").insert({
        email,
    });

    if (error) {
        if (error.code === '23505') { // Unique violation
            return { error: "You are already subscribed!" };
        }
        console.error("Error subscribing:", error);
        return { error: "Failed to subscribe. Please try again." };
    }

    return { success: true };
}
