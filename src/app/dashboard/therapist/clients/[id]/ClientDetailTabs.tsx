"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

type TabType = "overview" | "notes" | "chat";

interface ClientDetailTabsProps {
    clientId: string;
    therapistId: string;
    appointments: any[];
    notes: any[];
    isActiveClient: boolean;
}

export default function ClientDetailTabs({
    clientId,
    therapistId,
    appointments,
    notes: initialNotes,
    isActiveClient,
}: ClientDetailTabsProps) {
    const [activeTab, setActiveTab] = useState<TabType>("overview");
    const [notes, setNotes] = useState(initialNotes);
    const [newNote, setNewNote] = useState({
        title: "",
        content: "",
        type: "General" as "SOAP" | "DAP" | "General",
        visibility: "private" as "private" | "shared",
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const router = useRouter();

    async function handleCreateNote(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            const supabase = createClient();

            const { data, error } = await supabase
                .from("notes")
                .insert({
                    therapist_id: therapistId,
                    client_id: clientId,
                    title: newNote.title,
                    content: newNote.content,
                    type: newNote.type,
                    visibility: newNote.visibility,
                })
                .select()
                .single();

            if (error) throw error;

            setNotes([data, ...notes]);
            setNewNote({
                title: "",
                content: "",
                type: "General",
                visibility: "private",
            });
            setMessage("Note created successfully!");
            setTimeout(() => setMessage(""), 3000);
        } catch (error: any) {
            console.error("Error creating note:", error);
            setMessage(error.message || "Failed to create note");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            {/* Tabs */}
            <div className="border-b border-gray-200 mb-6">
                <div className="flex gap-8">
                    <button
                        onClick={() => setActiveTab("overview")}
                        className={`pb-4 px-1 border-b-2 font-medium transition ${
                            activeTab === "overview"
                                ? "border-teal-600 text-teal-600"
                                : "border-transparent text-gray-500 hover:text-gray-700"
                        }`}
                    >
                        Overview
                    </button>
                    <button
                        onClick={() => setActiveTab("notes")}
                        className={`pb-4 px-1 border-b-2 font-medium transition ${
                            activeTab === "notes"
                                ? "border-teal-600 text-teal-600"
                                : "border-transparent text-gray-500 hover:text-gray-700"
                        }`}
                    >
                        Notes ({notes.length})
                    </button>
                    <button
                        onClick={() => setActiveTab("chat")}
                        className={`pb-4 px-1 border-b-2 font-medium transition ${
                            activeTab === "chat"
                                ? "border-teal-600 text-teal-600"
                                : "border-transparent text-gray-500 hover:text-gray-700"
                        }`}
                    >
                        Chat
                    </button>
                </div>
            </div>

            {/* Overview Tab */}
            {activeTab === "overview" && (
                <div className="space-y-6">
                    {/* Appointments */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-lg font-semibold mb-4">Appointments ({appointments.length})</h3>
                        {appointments.length > 0 ? (
                            <div className="space-y-3">
                                {appointments.map((apt) => (
                                    <div key={apt.id} className="border border-gray-200 rounded-lg p-4">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="font-medium text-gray-900">
                                                    {new Date(apt.start_time).toLocaleDateString("en-US", {
                                                        weekday: "long",
                                                        year: "numeric",
                                                        month: "long",
                                                        day: "numeric"
                                                    })}
                                                </p>
                                                <p className="text-sm text-gray-600 mt-1">
                                                    {new Date(apt.start_time).toLocaleTimeString("en-US", {
                                                        hour: "2-digit",
                                                        minute: "2-digit"
                                                    })} - {new Date(apt.end_time).toLocaleTimeString("en-US", {
                                                        hour: "2-digit",
                                                        minute: "2-digit"
                                                    })}
                                                </p>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                apt.status === "confirmed" ? "bg-green-100 text-green-800" :
                                                apt.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                                                apt.status === "completed" ? "bg-blue-100 text-blue-800" :
                                                "bg-gray-100 text-gray-800"
                                            }`}>
                                                {apt.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-gray-500">No appointments yet</p>
                                <p className="text-sm text-gray-400 mt-2">
                                    Client needs to book a session with you first
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white rounded-lg shadow p-6">
                            <p className="text-sm text-gray-600">Total Sessions</p>
                            <p className="text-3xl font-bold text-gray-900 mt-1">{appointments.length}</p>
                        </div>
                        <div className="bg-white rounded-lg shadow p-6">
                            <p className="text-sm text-gray-600">Notes Created</p>
                            <p className="text-3xl font-bold text-gray-900 mt-1">{notes.length}</p>
                        </div>
                        <div className="bg-white rounded-lg shadow p-6">
                            <p className="text-sm text-gray-600">Status</p>
                            <p className="text-lg font-semibold text-gray-900 mt-1">
                                {isActiveClient ? "Active" : "Available"}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Notes Tab */}
            {activeTab === "notes" && (
                <div className="space-y-6">
                    {/* Create Note Form */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-lg font-semibold mb-4">Create New Note</h3>
                        <form onSubmit={handleCreateNote} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Title
                                </label>
                                <input
                                    type="text"
                                    value={newNote.title}
                                    onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                                    placeholder="Session summary, observation, etc."
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Type
                                    </label>
                                    <select
                                        value={newNote.type}
                                        onChange={(e) => setNewNote({ ...newNote, type: e.target.value as any })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                    >
                                        <option value="General">General</option>
                                        <option value="SOAP">SOAP</option>
                                        <option value="DAP">DAP</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Visibility
                                    </label>
                                    <select
                                        value={newNote.visibility}
                                        onChange={(e) => setNewNote({ ...newNote, visibility: e.target.value as any })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                    >
                                        <option value="private">Private (Only You)</option>
                                        <option value="shared">Shared (Client Can See)</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Content
                                </label>
                                <textarea
                                    value={newNote.content}
                                    onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                                    placeholder="Write your note here..."
                                    rows={6}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                />
                            </div>

                            {message && (
                                <div className={`p-4 rounded-lg ${
                                    message.includes("success")
                                        ? "bg-green-50 text-green-800"
                                        : "bg-red-50 text-red-800"
                                }`}>
                                    {message}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-teal-600 text-white py-3 rounded-lg font-medium hover:bg-teal-700 transition disabled:bg-gray-400"
                            >
                                {loading ? "Creating..." : "Create Note"}
                            </button>
                        </form>
                    </div>

                    {/* Existing Notes */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-lg font-semibold mb-4">Previous Notes</h3>
                        {notes.length > 0 ? (
                            <div className="space-y-4">
                                {notes.map((note) => (
                                    <div key={note.id} className="border border-gray-200 rounded-lg p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="font-semibold text-gray-900">{note.title}</h4>
                                            <div className="flex gap-2">
                                                <span className="px-2 py-1 bg-teal-100 text-teal-800 rounded text-xs font-medium">
                                                    {note.type}
                                                </span>
                                                <span className={`px-2 py-1 rounded text-xs font-medium ${
                                                    note.visibility === "shared"
                                                        ? "bg-blue-100 text-blue-800"
                                                        : "bg-gray-100 text-gray-800"
                                                }`}>
                                                    {note.visibility}
                                                </span>
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-600 mb-2">
                                            {new Date(note.created_at).toLocaleDateString("en-US", {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric"
                                            })}
                                        </p>
                                        <p className="text-gray-700 whitespace-pre-wrap">{note.content}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-gray-500">No notes yet</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Chat Tab */}
            {activeTab === "chat" && (
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="text-center py-8">
                        <p className="text-gray-500 mb-4">Chat feature coming soon</p>
                        <p className="text-sm text-gray-400">
                            This will allow real-time messaging with your client
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
