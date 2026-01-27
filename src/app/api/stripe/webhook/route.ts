import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
    if (!stripe) {
        return new NextResponse("Stripe is not configured", { status: 500 });
    }

    const body = await req.text();
    const headersList = await headers();
    const signature = headersList.get("Stripe-Signature") as string;

    let event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (error: any) {
        return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
    }

    const session = event.data.object as any;
    const supabase = await createClient();

    if (event.type === "checkout.session.completed") {
        // Handle successful payment
        const userId = session.metadata.userId;

        // Example: Update user subscription status or create appointment record
        // This logic depends on what was purchased (subscription vs session)

        if (session.mode === 'subscription') {
            await supabase.from('profiles').update({
                subscription_status: 'active'
            }).eq('id', userId);
        }
    }

    return new NextResponse(null, { status: 200 });
}
