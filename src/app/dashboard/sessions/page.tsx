import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Calendar, Clock, Video } from "lucide-react";
import { redirect } from "next/navigation";
import { format, isToday, isFuture } from "date-fns";
import Link from "next/link";

export default async function SessionsPage() {
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

    // Fetch appointments based on role
    const appointmentsQuery = supabase
        .from("appointments")
        .select("*, therapist:profiles!therapist_id(full_name), client:profiles!client_id(full_name)")
        .order("start_time", { ascending: true });

    if (profile?.role === "therapist") {
        appointmentsQuery.eq("therapist_id", user.id);
    } else {
        appointmentsQuery.eq("client_id", user.id);
    }

    const { data: appointments } = await appointmentsQuery;

    // Separate upcoming and past sessions
    const now = new Date();
    const upcomingSessions = appointments?.filter((apt) => isFuture(new Date(apt.start_time))) || [];
    const pastSessions = appointments?.filter((apt) => !isFuture(new Date(apt.start_time))) || [];

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-serif font-medium text-zen-900">Your Sessions</h1>
                    <p className="text-zen-600 mt-2">Manage your appointments and join video calls</p>
                </div>
                {profile?.role === "client" && (
                    <Link href="/dashboard/client/book">
                        <Button className="bg-zen-900 text-white hover:bg-zen-800">Book New Session</Button>
                    </Link>
                )}
            </div>

            <div className="space-y-6">
                <h2 className="text-xl font-medium text-zen-900">Upcoming Sessions</h2>
                {upcomingSessions.length > 0 ? (
                    upcomingSessions.map((session) => {
                        const startTime = new Date(session.start_time);
                        const otherPerson =
                            profile?.role === "therapist" ? session.client : session.therapist;
                        const otherPersonArray = Array.isArray(otherPerson) ? otherPerson[0] : otherPerson;

                        return (
                            <Card
                                key={session.id}
                                className={`border-none shadow-sm ${
                                    isToday(startTime) ? "border-l-4 border-l-zen-600" : ""
                                }`}
                            >
                                <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 rounded-full bg-zen-100 flex items-center justify-center text-zen-600">
                                            <Calendar className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-lg text-zen-900">
                                                {profile?.role === "therapist" ? "Session" : "Therapy Session"}
                                            </h3>
                                            <div className="flex items-center gap-4 text-sm text-zen-600">
                                                <span className="flex items-center gap-1">
                                                    <Clock className="h-4 w-4" />
                                                    {format(startTime, "MMM dd, h:mm a")}
                                                </span>
                                                <span>
                                                    with {otherPersonArray?.full_name || "User"}
                                                </span>
                                            </div>
                                            <div className="mt-1">
                                                <span
                                                    className={`text-xs px-2 py-0.5 rounded-full ${
                                                        session.status === "confirmed"
                                                            ? "bg-green-100 text-green-700"
                                                            : session.status === "pending"
                                                            ? "bg-yellow-100 text-yellow-700"
                                                            : "bg-gray-100 text-gray-700"
                                                    }`}
                                                >
                                                    {session.status}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    {isToday(startTime) && (
                                        <Button className="w-full md:w-auto gap-2 bg-zen-900 text-white hover:bg-zen-800">
                                            <Video className="h-4 w-4" /> Join Session
                                        </Button>
                                    )}
                                </CardContent>
                            </Card>
                        );
                    })
                ) : (
                    <Card className="border-none shadow-sm">
                        <CardContent className="p-12 text-center">
                            <Calendar className="h-12 w-12 text-zen-300 mx-auto mb-4" />
                            <p className="text-zen-500">No upcoming sessions scheduled</p>
                            {profile?.role === "client" && (
                                <Link href="/dashboard/client/book">
                                    <Button className="mt-4 bg-zen-900 text-white hover:bg-zen-800">
                                        Book Your First Session
                                    </Button>
                                </Link>
                            )}
                        </CardContent>
                    </Card>
                )}

                <h2 className="text-xl font-medium text-zen-900 pt-4">Past Sessions</h2>
                {pastSessions.length > 0 ? (
                    pastSessions.slice(0, 10).map((session) => {
                        const startTime = new Date(session.start_time);
                        const otherPerson =
                            profile?.role === "therapist" ? session.client : session.therapist;
                        const otherPersonArray = Array.isArray(otherPerson) ? otherPerson[0] : otherPerson;

                        return (
                            <Card key={session.id} className="border-none shadow-sm opacity-75 hover:opacity-100 transition-opacity">
                                <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 rounded-full bg-zen-100 flex items-center justify-center text-zen-500">
                                            <Calendar className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-lg text-zen-700">
                                                {profile?.role === "therapist" ? "Session" : "Therapy Session"}
                                            </h3>
                                            <div className="flex items-center gap-4 text-sm text-zen-500">
                                                <span>{format(startTime, "MMM dd, yyyy")}</span>
                                                <span>with {otherPersonArray?.full_name || "User"}</span>
                                            </div>
                                        </div>
                                    </div>
                                    {profile?.role === "client" && (
                                        <Link href="/dashboard/client/journey">
                                            <Button variant="outline" size="sm">
                                                View Notes
                                            </Button>
                                        </Link>
                                    )}
                                </CardContent>
                            </Card>
                        );
                    })
                ) : (
                    <Card className="border-none shadow-sm">
                        <CardContent className="p-12 text-center">
                            <p className="text-zen-500">No past sessions</p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
