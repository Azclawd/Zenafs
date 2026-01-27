import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { BookOpen, Calendar, FileText, Sparkles, TrendingUp, Award } from "lucide-react";

export default async function ClientJourney() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) redirect("/login");

    // Get shared notes
    const { data: notes } = await supabase
        .from("notes")
        .select("*")
        .eq("client_id", user.id)
        .eq("visibility", "shared")
        .order("created_at", { ascending: false });

    const noteTypes = {
        "SOAP": { color: "from-blue-500 to-indigo-600", icon: FileText },
        "DAP": { color: "from-purple-500 to-pink-600", icon: Award },
        "General": { color: "from-amber-500 to-orange-600", icon: BookOpen }
    };

    return (
        <div className="space-y-8 pb-20">
            {/* Header with animated gradient */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 border-2 border-amber-200 p-8 shadow-xl">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 animate-beam"></div>

                <div className="relative flex items-start gap-4">
                    <div className="flex-shrink-0">
                        <div className="relative">
                            <div className="absolute inset-0 bg-amber-400 rounded-full blur-xl opacity-50 animate-pulse-glow"></div>
                            <div className="relative w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg">
                                <BookOpen className="w-8 h-8 text-white" strokeWidth={2.5} />
                            </div>
                        </div>
                    </div>
                    <div className="flex-1">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Journey</h1>
                        <p className="text-gray-700 text-lg">
                            Your therapy progress, insights, and notes shared by your therapist.
                        </p>
                    </div>
                    <div className="hidden md:block">
                        <div className="text-right">
                            <p className="text-4xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                                {notes?.length || 0}
                            </p>
                            <p className="text-sm text-gray-600 font-semibold mt-1">Total Notes</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 p-6 shadow-lg hover:shadow-2xl transition-all duration-300">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-teal-100 to-emerald-100 rounded-full blur-3xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
                    <div className="relative">
                        <div className="flex items-center justify-between mb-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                                <TrendingUp className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-3xl font-bold text-gray-900">{notes?.length || 0}</span>
                        </div>
                        <p className="text-sm font-semibold text-gray-700">Progress Entries</p>
                        <p className="text-xs text-gray-500 mt-1">Notes from your therapist</p>
                    </div>
                </div>

                <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 p-6 shadow-lg hover:shadow-2xl transition-all duration-300">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full blur-3xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
                    <div className="relative">
                        <div className="flex items-center justify-between mb-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                                <FileText className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-3xl font-bold text-gray-900">
                                {notes?.filter(n => n.type === "SOAP").length || 0}
                            </span>
                        </div>
                        <p className="text-sm font-semibold text-gray-700">SOAP Notes</p>
                        <p className="text-xs text-gray-500 mt-1">Clinical assessments</p>
                    </div>
                </div>

                <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 p-6 shadow-lg hover:shadow-2xl transition-all duration-300">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full blur-3xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
                    <div className="relative">
                        <div className="flex items-center justify-between mb-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                                <Award className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-3xl font-bold text-gray-900">
                                {notes?.filter(n => n.type === "DAP").length || 0}
                            </span>
                        </div>
                        <p className="text-sm font-semibold text-gray-700">DAP Notes</p>
                        <p className="text-xs text-gray-500 mt-1">Progress documentation</p>
                    </div>
                </div>
            </div>

            {/* Notes Timeline */}
            <div>
                <div className="flex items-center gap-3 mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Your Timeline</h2>
                    <div className="h-1 flex-1 bg-gradient-to-r from-gray-200 via-transparent to-transparent rounded-full"></div>
                </div>

                {!notes || notes.length === 0 ? (
                    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-2 border-blue-200 p-12 shadow-xl text-center">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 animate-beam"></div>

                        <div className="relative inline-block mb-6">
                            <div className="absolute inset-0 bg-blue-400 rounded-full blur-2xl opacity-30 animate-pulse-glow"></div>
                            <div className="relative w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-xl">
                                <BookOpen className="w-10 h-10 text-white" strokeWidth={2.5} />
                            </div>
                        </div>

                        <h3 className="text-2xl font-bold text-gray-900 mb-3">No Notes Yet</h3>
                        <p className="text-gray-700 text-lg max-w-md mx-auto">
                            Your therapist will share notes about your progress here. Check back after your sessions.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {notes.map((note, index) => {
                            const noteType = noteTypes[note.type as keyof typeof noteTypes] || noteTypes.General;
                            const IconComponent = noteType.icon;

                            return (
                                <div
                                    key={note.id}
                                    className="group relative overflow-hidden rounded-2xl bg-white border-2 border-gray-200 hover:border-gray-300 p-6 shadow-lg hover:shadow-2xl transition-all duration-300"
                                    style={{
                                        animationDelay: `${index * 100}ms`,
                                    }}
                                >
                                    {/* Gradient accent line */}
                                    <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${noteType.color}`}></div>

                                    <div className="relative flex items-start gap-4">
                                        {/* Icon */}
                                        <div className="flex-shrink-0 relative">
                                            <div className={`absolute inset-0 bg-gradient-to-br ${noteType.color} rounded-2xl blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-300`}></div>
                                            <div className={`relative w-14 h-14 bg-gradient-to-br ${noteType.color} rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300`}>
                                                <IconComponent className="w-7 h-7 text-white" strokeWidth={2.5} />
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-4 mb-3">
                                                <div>
                                                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                                                        {note.title}
                                                    </h3>
                                                    <div className="flex items-center gap-3 text-sm text-gray-600">
                                                        <div className="flex items-center gap-1">
                                                            <Calendar className="w-4 h-4" />
                                                            <span>
                                                                {new Date(note.created_at).toLocaleDateString("en-US", {
                                                                    year: "numeric",
                                                                    month: "long",
                                                                    day: "numeric"
                                                                })}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <span className={`px-4 py-1.5 bg-gradient-to-r ${noteType.color} text-white text-xs font-bold rounded-full shadow-lg whitespace-nowrap`}>
                                                    {note.type}
                                                </span>
                                            </div>

                                            {/* Note Content */}
                                            <div className="prose max-w-none">
                                                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                                                    {note.content}
                                                </p>
                                            </div>

                                            {/* Footer */}
                                            <div className="mt-4 pt-4 border-t border-gray-100">
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="text-gray-500 font-medium">Shared by your therapist</span>
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                                                        <span className="text-gray-600">Visible to you</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Encouragement Card - Sticky */}
            {notes && notes.length > 0 && (
                <div className="sticky top-4 z-10">
                    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-teal-50 via-emerald-50 to-cyan-50 border-2 border-teal-200 p-8 shadow-xl">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-500 via-emerald-500 to-cyan-500"></div>

                        <div className="relative flex items-center gap-4">
                            <Sparkles className="w-8 h-8 text-teal-600 flex-shrink-0" />
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Keep Growing!</h3>
                                <p className="text-gray-700">
                                    You've made great progress. Every note represents a step forward in your journey.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
