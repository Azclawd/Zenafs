

import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Users, Calendar, Clock, AlertCircle, DollarSign, TrendingUp, MoreHorizontal, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { redirect } from "next/navigation";

export default async function TherapistDashboardPage() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // Fetch stats
    const { count: activeClients } = await supabase
        .from("profiles")
        .select("*", { count: 'exact', head: true })
        .eq("role", "client"); // In a real app, this would be linked to the therapist

    const { count: todaysSessions } = await supabase
        .from("appointments")
        .select("*", { count: 'exact', head: true })
        .eq("therapist_id", user.id)
        .gte("start_time", new Date().toISOString().split('T')[0])
        .lt("start_time", new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0]);

    // Fetch schedule
    const { data: schedule } = await supabase
        .from("appointments")
        .select("*, client:profiles!client_id(full_name)")
        .eq("therapist_id", user.id)
        .order("start_time", { ascending: true })
        .limit(5);

    return (
        <div className="space-y-8 pt-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-4xl font-serif font-medium text-zen-900">Dr. {user.user_metadata.full_name || 'Therapist'}</h1>
                    <p className="text-zen-600 mt-1">Here's your practice overview for today.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="border-zen-200 text-zen-900 hover:bg-zen-50">
                        Manage Availability
                    </Button>
                    <Button className="bg-zen-900 text-white hover:bg-zen-800">
                        Create New Note
                    </Button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-none shadow-sm bg-white rounded-3xl">
                    <CardContent className="p-6 flex items-center gap-4">
                        <div className="h-14 w-14 rounded-2xl bg-zen-50 flex items-center justify-center text-zen-900">
                            <Users className="h-7 w-7" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-zen-500 uppercase tracking-wider">Active Clients</p>
                            <h3 className="text-3xl font-serif font-medium text-zen-900">{activeClients || 0}</h3>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm bg-white rounded-3xl">
                    <CardContent className="p-6 flex items-center gap-4">
                        <div className="h-14 w-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                            <Calendar className="h-7 w-7" />
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-medium text-zen-500 uppercase tracking-wider">Today's Sessions</p>
                            <h3 className="text-3xl font-serif font-medium text-zen-900">{todaysSessions || 0}</h3>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm bg-white rounded-3xl">
                    <CardContent className="p-6 flex items-center gap-4">
                        <div className="h-14 w-14 rounded-2xl bg-green-50 flex items-center justify-center text-green-600">
                            <DollarSign className="h-7 w-7" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-zen-500 uppercase tracking-wider">Monthly Income</p>
                            <h3 className="text-3xl font-serif font-medium text-zen-900">$12,450</h3>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Schedule Column */}
                <div className="lg:col-span-2 space-y-8">
                    <Card className="border-none shadow-sm bg-white rounded-3xl">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-xl font-serif text-zen-900">Upcoming Schedule</CardTitle>
                            <p className="text-sm text-zen-500">{new Date().toLocaleDateString()}</p>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {schedule && schedule.length > 0 ? (
                                    schedule.map((session) => (
                                        <div key={session.id} className="flex items-center justify-between p-4 rounded-2xl bg-zen-50 hover:bg-zen-100 transition-colors group">
                                            <div className="flex items-center gap-6">
                                                <div className="text-zen-900 font-bold w-20 font-serif">
                                                    {new Date(session.start_time).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-zen-900">{session.client?.full_name || 'Client'}</h4>
                                                    <p className="text-sm text-zen-500">Individual Therapy</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <span className={cn(
                                                    "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider",
                                                    session.status === "completed" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                                                )}>
                                                    {session.status}
                                                </span>
                                                <Button variant="ghost" size="icon" className="text-zen-400 hover:text-zen-900">
                                                    <MoreHorizontal className="h-5 w-5" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-zen-500 text-center py-4">No upcoming sessions.</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Pending Actions */}
                <div className="space-y-8">
                    <Card className="border-none shadow-sm bg-white rounded-3xl">
                        <CardHeader>
                            <CardTitle className="text-xl font-serif text-zen-900">Pending Actions</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="p-4 bg-orange-50 rounded-2xl border border-orange-100">
                                    <div className="flex items-start gap-3">
                                        <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5" />
                                        <div>
                                            <h4 className="font-bold text-orange-900">Unpaid Invoices (2)</h4>
                                            <p className="text-sm text-orange-700 mt-1">Total outstanding: $300.00</p>
                                            <Button size="sm" variant="link" className="text-orange-900 p-0 h-auto mt-2 font-bold">
                                                Send Reminders
                                            </Button>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4 bg-zen-50 rounded-2xl border border-zen-100">
                                    <div className="flex items-start gap-3">
                                        <TrendingUp className="h-5 w-5 text-zen-600 mt-0.5" />
                                        <div>
                                            <h4 className="font-bold text-zen-900">Session Notes (3)</h4>
                                            <p className="text-sm text-zen-600 mt-1">Complete notes for today's sessions.</p>
                                            <Button size="sm" variant="link" className="text-zen-900 p-0 h-auto mt-2 font-bold">
                                                View Pending
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-zen-900 text-white border-none shadow-xl rounded-3xl">
                        <CardContent className="p-8">
                            <h3 className="text-2xl font-serif font-medium mb-2">Invite Clients</h3>
                            <p className="text-zen-300 mb-6 text-sm">Send a secure link to connect with new clients.</p>
                            <Button className="w-full bg-white text-zen-900 hover:bg-zen-100">
                                Generate Invite Link
                            </Button>
                        </CardContent>
                    </Card>
                </div>

            </div>
        </div>
    );
}
