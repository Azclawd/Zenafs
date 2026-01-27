import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { redirect } from "next/navigation";
import { User } from "lucide-react";

export default async function SettingsPage() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // Fetch profile
    const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

    return (
        <div className="space-y-8 max-w-2xl">
            <div>
                <h1 className="text-3xl font-serif font-medium text-zen-900">Settings</h1>
                <p className="text-zen-600 mt-2">Manage your account and preferences</p>
            </div>

            {/* Profile Information */}
            <Card className="border-none shadow-sm">
                <CardHeader>
                    <CardTitle className="text-lg font-medium">Profile Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="h-20 w-20 rounded-full bg-zen-100 flex items-center justify-center">
                            {profile?.avatar_url ? (
                                <img
                                    src={profile.avatar_url}
                                    alt="Profile"
                                    className="h-full w-full rounded-full object-cover"
                                />
                            ) : (
                                <User className="h-10 w-10 text-zen-600" />
                            )}
                        </div>
                        <div>
                            <Button variant="outline" size="sm" disabled>
                                Change Photo
                            </Button>
                            <p className="text-xs text-zen-500 mt-1">JPG, PNG or GIF. Max 2MB</p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zen-700">Full Name</label>
                        <Input defaultValue={profile?.full_name || ""} disabled />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zen-700">Email</label>
                        <Input defaultValue={profile?.email || user.email || ""} disabled />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zen-700">Role</label>
                        <div className="px-3 py-2 bg-zen-50 rounded-lg text-sm text-zen-700 capitalize">
                            {profile?.role || "User"}
                        </div>
                    </div>

                    <Button className="bg-zen-900 text-white hover:bg-zen-800" disabled>
                        Save Changes
                    </Button>
                </CardContent>
            </Card>

            {/* Security */}
            <Card className="border-none shadow-sm">
                <CardHeader>
                    <CardTitle className="text-lg font-medium">Security</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zen-700">Current Password</label>
                        <Input type="password" placeholder="Enter current password" disabled />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zen-700">New Password</label>
                        <Input type="password" placeholder="Enter new password" disabled />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zen-700">Confirm New Password</label>
                        <Input type="password" placeholder="Confirm new password" disabled />
                    </div>

                    <Button variant="outline" disabled>
                        Update Password
                    </Button>
                </CardContent>
            </Card>

            {/* Subscription Info (if applicable) */}
            {profile?.subscription_status && (
                <Card className="border-none shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-lg font-medium">Subscription</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-zen-900">Current Plan</p>
                                <p className="text-sm text-zen-600 capitalize mt-1">
                                    {profile.subscription_status}
                                </p>
                            </div>
                            <Button variant="outline" disabled>
                                Manage Subscription
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Danger Zone */}
            <Card className="border-none shadow-sm border-red-100">
                <CardHeader>
                    <CardTitle className="text-lg font-medium text-red-600">Danger Zone</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium text-zen-900">Delete Account</p>
                            <p className="text-sm text-zen-600 mt-1">
                                Permanently delete your account and all data
                            </p>
                        </div>
                        <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50" disabled>
                            Delete Account
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
