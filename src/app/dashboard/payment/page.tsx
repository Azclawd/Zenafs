import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { CreditCard, CheckCircle2 } from "lucide-react";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function PaymentPage() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // Fetch user profile
    const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

    // Only show payment page for clients
    if (profile?.role !== "client") {
        redirect("/dashboard");
    }

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            <div>
                <h1 className="text-3xl font-serif font-medium text-zen-900">Payments & Billing</h1>
                <p className="text-zen-600 mt-2">Manage your payments securely through Stripe</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="border-none shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-lg font-medium">Payment Methods</CardTitle>
                        <CardDescription>Securely managed by Stripe</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="p-6 border-2 border-dashed border-zen-200 rounded-xl text-center">
                            <CreditCard className="h-8 w-8 text-zen-400 mx-auto mb-2" />
                            <p className="text-sm text-zen-600 mb-3">
                                No payment method added yet
                            </p>
                            <Link href="/dashboard/client/book">
                                <Button variant="outline" size="sm">
                                    Book Session to Add Payment
                                </Button>
                            </Link>
                        </div>
                        <p className="text-xs text-zen-500 text-center">
                            Your payment information is securely stored by Stripe and never touches our servers
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-lg font-medium">Subscription Status</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {profile?.subscription_status ? (
                            <>
                                <div className="flex items-center gap-2 p-4 bg-green-50 rounded-lg">
                                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                                    <span className="font-medium text-green-900 capitalize">
                                        {profile.subscription_status}
                                    </span>
                                </div>
                                <div className="space-y-2 pt-4">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-zen-600">Plan Type</span>
                                        <span className="font-medium text-zen-900">Pay Per Session</span>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-zen-600 mb-4">No active subscription</p>
                                <Link href="/dashboard/client/book">
                                    <Button className="bg-zen-900 text-white hover:bg-zen-800">
                                        Book Your First Session
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            <Card className="border-none shadow-sm">
                <CardHeader>
                    <CardTitle className="text-lg font-medium">Booking History</CardTitle>
                    <CardDescription>View your past session bookings and payments</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-12">
                        <p className="text-zen-500 text-sm">
                            Your booking history will appear here after your first session
                        </p>
                        <Link href="/dashboard/sessions">
                            <Button variant="link" className="mt-2">
                                View All Sessions
                            </Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
