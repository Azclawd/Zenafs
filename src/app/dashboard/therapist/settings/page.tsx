"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
    User,
    Mail,
    Calendar,
    CreditCard,
    Bell,
    Shield,
    LogOut,
    Save,
    CheckCircle,
    AlertCircle,
    Settings,
    Clock,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import AvailabilityCalendar from "@/components/therapist/AvailabilityCalendar";

interface TabProps {
    active: string;
    onTabChange: (tab: string) => void;
}

const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "availability", label: "Availability", icon: Calendar },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Shield },
];

export default function TherapistSettings() {
    const [activeTab, setActiveTab] = useState("profile");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [profile, setProfile] = useState<any>(null);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
    const router = useRouter();
    const supabase = createClient();

    // Profile form state
    const [fullName, setFullName] = useState("");
    const [bio, setBio] = useState("");
    const [specialties, setSpecialties] = useState("");
    const [hourlyRate, setHourlyRate] = useState("");

    useEffect(() => {
        loadProfile();
    }, []);

    async function loadProfile() {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            router.push("/login");
            return;
        }

        const { data } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single();

        if (data) {
            setProfile(data);
            setFullName(data.full_name || "");
            setBio(data.bio || "");
            setSpecialties(data.specialties || "");
            setHourlyRate(data.hourly_rate?.toString() || "");
        }

        setLoading(false);
    }

    async function handleSaveProfile(e: React.FormEvent) {
        e.preventDefault();
        setSaving(true);
        setMessage(null);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Not authenticated");

            const { error } = await supabase
                .from("profiles")
                .update({
                    full_name: fullName,
                    bio: bio,
                    specialties: specialties,
                    hourly_rate: hourlyRate ? parseFloat(hourlyRate) : null,
                })
                .eq("id", user.id);

            if (error) throw error;

            setMessage({ type: "success", text: "Profile updated successfully!" });
            setTimeout(() => setMessage(null), 3000);
        } catch (error: any) {
            setMessage({ type: "error", text: error.message || "Failed to update profile" });
        } finally {
            setSaving(false);
        }
    }

    async function handleSaveAvailability(availability: any) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Not authenticated");

        const { error } = await supabase
            .from("profiles")
            .update({ availability: availability })
            .eq("id", user.id);

        if (error) throw error;
    }

    async function handleSignOut() {
        await supabase.auth.signOut();
        router.push("/login");
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full"
                />
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-20">
            {/* Header */}
            <div className="space-y-2">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent">
                    Settings
                </h1>
                <p className="text-gray-600">Manage your profile, availability, and preferences</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm whitespace-nowrap transition-all ${
                                activeTab === tab.id
                                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                                    : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
                            }`}
                        >
                            <Icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* Tab Content */}
            <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                {/* Profile Tab */}
                {activeTab === "profile" && (
                    <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-xl overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-6 py-5">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                                    <User className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white">Profile Information</h2>
                                    <p className="text-blue-100 text-sm">Update your public profile</p>
                                </div>
                            </div>
                        </div>

                        <form onSubmit={handleSaveProfile} className="p-6 space-y-6">
                            {message && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex items-center gap-3 p-4 rounded-xl ${
                                        message.type === "success"
                                            ? "bg-green-50 text-green-800 border border-green-200"
                                            : "bg-red-50 text-red-800 border border-red-200"
                                    }`}
                                >
                                    {message.type === "success" ? (
                                        <CheckCircle className="w-5 h-5 flex-shrink-0" />
                                    ) : (
                                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                    )}
                                    {message.text}
                                </motion.div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Email</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <Input
                                            type="email"
                                            value={profile?.email || ""}
                                            disabled
                                            className="pl-10 bg-gray-50"
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500">Email cannot be changed</p>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Full Name</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <Input
                                            type="text"
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            placeholder="Dr. Jane Smith"
                                            className="pl-10"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-sm font-medium text-gray-700">Bio</label>
                                    <textarea
                                        value={bio}
                                        onChange={(e) => setBio(e.target.value)}
                                        placeholder="Tell clients about yourself, your approach, and experience..."
                                        rows={4}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Specialties</label>
                                    <Input
                                        type="text"
                                        value={specialties}
                                        onChange={(e) => setSpecialties(e.target.value)}
                                        placeholder="Anxiety, Depression, Relationships..."
                                    />
                                    <p className="text-xs text-gray-500">Separate with commas</p>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Hourly Rate (£)</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">£</span>
                                        <Input
                                            type="number"
                                            value={hourlyRate}
                                            onChange={(e) => setHourlyRate(e.target.value)}
                                            placeholder="80"
                                            className="pl-8"
                                            min="0"
                                            step="5"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end pt-4 border-t">
                                <Button type="submit" disabled={saving} className="bg-blue-600 hover:bg-blue-700 text-white">
                                    {saving ? (
                                        <span className="flex items-center gap-2">
                                            <motion.div
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                                            />
                                            Saving...
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-2">
                                            <Save className="w-4 h-4" />
                                            Save Changes
                                        </span>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Availability Tab */}
                {activeTab === "availability" && (
                    <AvailabilityCalendar
                        availability={profile?.availability}
                        onSave={handleSaveAvailability}
                        timezone="Europe/London"
                    />
                )}

                {/* Notifications Tab */}
                {activeTab === "notifications" && (
                    <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-xl p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                <Bell className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Notification Preferences</h2>
                                <p className="text-gray-600 text-sm">Choose how you want to be notified</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {[
                                { label: "New appointment requests", description: "When a client requests to book", default: true },
                                { label: "Appointment reminders", description: "24 hours and 1 hour before sessions", default: true },
                                { label: "New messages", description: "When clients send you messages", default: true },
                                { label: "Payment received", description: "When you receive payment for sessions", default: true },
                                { label: "Weekly summary", description: "Weekly overview of your practice", default: false },
                            ].map((item, index) => (
                                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                    <div>
                                        <p className="font-medium text-gray-900">{item.label}</p>
                                        <p className="text-sm text-gray-500">{item.description}</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" defaultChecked={item.default} className="sr-only peer" />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Security Tab */}
                {activeTab === "security" && (
                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-xl p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                    <Shield className="w-6 h-6 text-blue-600" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">Security Settings</h2>
                                    <p className="text-gray-600 text-sm">Manage your account security</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <button className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
                                    <div className="text-left">
                                        <p className="font-medium text-gray-900">Change Password</p>
                                        <p className="text-sm text-gray-500">Update your password</p>
                                    </div>
                                    <Shield className="w-5 h-5 text-gray-400" />
                                </button>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl border-2 border-red-200 shadow-xl p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                                    <LogOut className="w-6 h-6 text-red-600" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">Sign Out</h2>
                                    <p className="text-gray-600 text-sm">Sign out of your account</p>
                                </div>
                            </div>

                            <Button
                                onClick={handleSignOut}
                                className="w-full bg-red-600 hover:bg-red-700 text-white"
                            >
                                <LogOut className="w-4 h-4 mr-2" />
                                Sign Out
                            </Button>
                        </div>
                    </div>
                )}
            </motion.div>
        </div>
    );
}
