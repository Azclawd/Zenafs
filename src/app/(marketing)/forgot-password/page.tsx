"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import Link from "next/link";
import { AlertCircle, CheckCircle2, ArrowLeft, Mail } from "lucide-react";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const supabase = createClient();

    const handleResetRequest = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password`,
            });

            if (error) {
                setError(error.message);
            } else {
                setSuccess(true);
            }
        } catch (err) {
            setError("An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-zen-50 px-4">
                <Card className="w-full max-w-md border-none shadow-xl bg-white">
                    <CardContent className="pt-8 pb-8 text-center space-y-6">
                        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                            <CheckCircle2 className="h-8 w-8 text-green-600" />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-2xl font-serif font-medium text-zen-900">Check Your Email</h2>
                            <p className="text-zen-600">
                                We've sent a password reset link to <strong>{email}</strong>
                            </p>
                        </div>
                        <p className="text-sm text-zen-500">
                            Didn't receive the email? Check your spam folder or{" "}
                            <button 
                                onClick={() => setSuccess(false)} 
                                className="text-zen-900 font-medium hover:underline"
                            >
                                try again
                            </button>
                        </p>
                        <Link 
                            href="/login" 
                            className="inline-flex items-center gap-2 text-zen-900 font-medium hover:underline"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to Sign In
                        </Link>
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
                        <Mail className="h-7 w-7 text-zen-600" />
                    </div>
                    <CardTitle className="text-3xl font-serif font-medium text-zen-900">Reset Password</CardTitle>
                    <p className="text-zen-600">Enter your email and we'll send you a reset link</p>
                </CardHeader>
                <CardContent className="space-y-6">
                    {error && (
                        <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2">
                            <AlertCircle className="h-4 w-4 flex-shrink-0" />
                            {error}
                        </div>
                    )}
                    <form onSubmit={handleResetRequest} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zen-700">Email</label>
                            <Input
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <Button 
                            type="submit" 
                            className="w-full bg-zen-900 hover:bg-zen-800 text-white" 
                            disabled={loading}
                        >
                            {loading ? "Sending..." : "Send Reset Link"}
                        </Button>
                    </form>
                    <div className="text-center">
                        <Link 
                            href="/login" 
                            className="inline-flex items-center gap-2 text-sm text-zen-600 hover:text-zen-900"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to Sign In
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
