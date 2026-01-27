"use server";

import { createClient } from "@/lib/supabase/server";

export async function submitContactForm(formData: FormData) {
    const supabase = await createClient();

    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const email = formData.get("email") as string;
    const message = formData.get("message") as string;

    if (!firstName || !lastName || !email || !message) {
        return { error: "All fields are required" };
    }

    const { error } = await supabase.from("contact_submissions").insert({
        first_name: firstName,
        last_name: lastName,
        email,
        message,
    });

    if (error) {
        console.error("Error submitting form:", error);
        return { error: "Failed to submit form. Please try again." };
    }

    return { success: true };
}
