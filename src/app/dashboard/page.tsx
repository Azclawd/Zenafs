
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Calendar, Video, CreditCard, ArrowRight, User } from "lucide-react";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // Fetch user profile to check role
    const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    // Redirect based on role
    if (profile?.role === "therapist") {
        redirect("/dashboard/therapist");
    } else if (profile?.role === "client") {
        redirect("/dashboard/client");
    }

    // Fetch appointments
    const { data: appointments } = await supabase
        .from("appointments")
        .select("*, therapist:profiles!therapist_id(full_name)")
        .eq("client_id", user.id)
        .order("start_time", { ascending: true });

    // Fetch payments
    const { data: payments } = await supabase
        .from("payments")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

    const nextSession = appointments?.find(a => new Date(a.start_time) > new Date());

    return (
        <div className="space-y-8 pt-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-4xl font-serif font-medium text-zen-900">Welcome back, {user.user_metadata.full_name || 'Client'}</h1>
                    <p className="text-zen-600 mt-1">Here's what's happening with your care.</p>
                </div>
                <Button className="bg-zen-900 text-white hover:bg-zen-800 rounded-full px-6">
                    Book New Session
                </Button>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Next Session Card */}
                    <Card className="border-none shadow-lg bg-gradient-to-br from-zen-900 to-zen-800 text-white overflow-hidden relative rounded-3xl">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
                        <CardContent className="p-8 relative z-10">
                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <p className="text-zen-200 font-medium mb-1 uppercase tracking-wider text-sm">Next Session</p>
                                    <h3 className="text-3xl font-serif font-medium">
                                        {nextSession ? new Date(nextSession.start_time).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }) : "No upcoming sessions"}
                                    </h3>
                                </div>
                                <div className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm">
                                    <Video className="h-6 w-6 text-white" />
                                </div>
                            </div>

                            {nextSession ? (
                                <div className="space-y-6">
                                    <div className="flex items-center gap-6 text-zen-100">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-5 w-5" />
                                            <span className="text-lg">{new Date(nextSession.start_time).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <User className="h-5 w-5" />
                                            <span className="text-lg">Dr. {nextSession.therapist?.full_name || 'Therapist'}</span>
                                        </div>
                                    </div>
                                    <Button className="w-full bg-white text-zen-900 hover:bg-zen-100 font-medium h-12 text-lg">
                                        Join Video Call
                                    </Button>
                                </div>
                            ) : (
                                <p className="text-zen-200">Schedule a session to get started.</p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Upcoming Sessions List */}
                    <Card className="border-none shadow-sm bg-white rounded-3xl">
                        <CardHeader>
                            <CardTitle className="text-xl font-serif text-zen-900">Upcoming Sessions</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {appointments && appointments.length > 0 ? (
                                    appointments.slice(0, 3).map((session) => (
                                        <div key={session.id} className="flex items-center justify-between p-4 rounded-2xl bg-zen-50 hover:bg-zen-100 transition-colors group cursor-pointer">
                                            <div className="flex items-center gap-4">
                                                <div className="h-12 w-12 rounded-xl bg-white flex flex-col items-center justify-center text-zen-900 font-medium shadow-sm">
                                                    <span className="text-xs uppercase text-zen-500">{new Date(session.start_time).toLocaleDateString('en-US', { month: 'short' })}</span>
                                                    <span className="text-lg font-bold">{new Date(session.start_time).getDate()}</span>
                                                </div>
                                                <div>
                                                    <h4 className="font-medium text-zen-900">Individual Therapy</h4>
                                                    <p className="text-sm text-zen-500">with Dr. {session.therapist?.full_name || 'Therapist'}</p>
                                                </div>
                                            </div>
                                            <Button variant="ghost" size="icon" className="text-zen-400 group-hover:text-zen-900">
                                                <ArrowRight className="h-5 w-5" />
                                            </Button>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-zen-500 text-center py-4">No upcoming sessions found.</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-8">
                    {/* My Therapist */}
                    <Card className="border-none shadow-sm bg-white rounded-3xl">
                        <CardHeader>
                            <CardTitle className="text-xl font-serif text-zen-900">My Therapist</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-center p-4">
                                <div className="h-24 w-24 rounded-full bg-zen-100 mx-auto mb-4 overflow-hidden">
                                    <img src="/about-image.jpg" alt="Therapist" className="h-full w-full object-cover" />
                                </div>
                                <h3 className="text-lg font-medium text-zen-900">Dr. Sarah Mitchell</h3>
                                <p className="text-zen-500 text-sm mb-4">Clinical Psychologist</p>
                                <div className="flex gap-2 justify-center">
                                    <Button variant="outline" size="sm" className="rounded-full">Message</Button>
                                    <Button variant="outline" size="sm" className="rounded-full">Profile</Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Payments */}
                    <Card className="border-none shadow-sm bg-white rounded-3xl">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-xl font-serif text-zen-900">Payments</CardTitle>
                            <CreditCard className="h-5 w-5 text-zen-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {payments && payments.length > 0 ? (
                                    payments.slice(0, 3).map((payment) => (
                                        <div key={payment.id} className="flex justify-between items-center text-sm">
                                            <div>
                                                <p className="font-medium text-zen-900">{payment.description || 'Session Fee'}</p>
                                                <p className="text-zen-500">{new Date(payment.created_at).toLocaleDateString()}</p>
                                            </div>
                                            <span className="font-medium text-zen-900">${payment.amount}</span>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-zen-500 text-sm">No payment history.</p>
                                )}
                                <Button className="w-full mt-4 bg-zen-100 text-zen-900 hover:bg-zen-200 border-none">
                                    View All History
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
