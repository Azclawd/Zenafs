"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AlertCircle, CheckCircle2, Lock, Eye, EyeOff } from "lucide-react";

export default function ResetPasswordPage() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [checking, setChecking] = useState(true);
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        // Check if we have a valid session from the reset link
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                // No session - user might have come here directly
                setError("Invalid or expired reset link. Please request a new one.");
            }
            setChecking(false);
        };
        checkSession();
    }, [supabase.auth]);

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // Validate passwords match
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            setLoading(false);
            return;
        }

        // Validate password strength
        if (password.length < 8) {
            setError("Password must be at least 8 characters");
            setLoading(false);
            return;
        }

        try {
            const { error } = await supabase.auth.updateUser({
                password: password,
            });

            if (error) {
                setError(error.message);
            } else {
                setSuccess(true);
                // Sign out and redirect to login after a delay
                setTimeout(async () => {
                    await supabase.auth.signOut();
                    router.push("/login");
                }, 3000);
            }
        } catch (err) {
            setError("An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    };

    if (checking) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-zen-50 px-4">
                <Card className="w-full max-w-md border-none shadow-xl bg-white">
                    <CardContent className="pt-8 pb-8 text-center">
                        <div className="animate-spin mx-auto w-8 h-8 border-2 border-zen-900 border-t-transparent rounded-full"></div>
                        <p className="mt-4 text-zen-600">Verifying reset link...</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-zen-50 px-4">
                <Card className="w-full max-w-md border-none shadow-xl bg-white">
                    <CardContent className="pt-8 pb-8 text-center space-y-6">
                        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                            <CheckCircle2 className="h-8 w-8 text-green-600" />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-2xl font-serif font-medium text-zen-900">Password Updated!</h2>
                            <p className="text-zen-600">
                                Your password has been successfully reset.
                            </p>
                        </div>
                        <p className="text-sm text-zen-500">
                            Redirecting you to sign in...
                        </p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-zen-50 px-4">
            <Card className="w-full max-w-md border-none shadow-xl bg-white">
                <CardHeader className="text-center space-y-2">
                    <div className="mx-auto w-14 h-14 bg-zen-100 rounded-full flex items-center justify-center mb-2">
                        <Lock className="h-7 w-7 text-zen-600" />
                    </div>
                    <CardTitle className="text-3xl font-serif font-medium text-zen-900">New Password</CardTitle>
                    <p className="text-zen-600">Enter your new password below</p>
                </CardHeader>
                <CardContent className="space-y-6">
                    {error && (
                        <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2">
                            <AlertCircle className="h-4 w-4 flex-shrink-0" />
                            <span>{error}</span>
                            {error.includes("expired") && (
                                <Link href="/forgot-password" className="ml-auto text-red-700 font-medium hover:underline">
                                    Request new link
                                </Link>
                            )}
                        </div>
                    )}
                    {!error?.includes("expired") && (
                        <form onSubmit={handleResetPassword} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zen-700">New Password</label>
                                <div className="relative">
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        minLength={8}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zen-400 hover:text-zen-600"
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                                <p className="text-xs text-zen-500">Must be at least 8 characters</p>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zen-700">Confirm Password</label>
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <Button 
                                type="submit" 
                                className="w-full bg-zen-900 hover:bg-zen-800 text-white" 
                                disabled={loading}
                            >
                                {loading ? "Updating..." : "Update Password"}
                            </Button>
                        </form>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
