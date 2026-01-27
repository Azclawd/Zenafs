"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AlertCircle } from "lucide-react";

export default function SignupPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fullName, setFullName] = useState("");
    const [role, setRole] = useState<"client" | "therapist">("client");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                    role: role,
                },
            },
        });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            // For email confirmation flows, you might show a message here instead
            router.push("/dashboard");
            router.refresh();
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-zen-50 px-4 py-12">
            <Card className="w-full max-w-md border-none shadow-xl bg-white">
                <CardHeader className="text-center space-y-2">
                    <CardTitle className="text-3xl font-serif font-medium text-zen-900">Create Account</CardTitle>
                    <p className="text-zen-600">Join Zenafs today</p>
                </CardHeader>
                <CardContent className="space-y-6">
                    {error && (
                        <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2">
                            <AlertCircle className="h-4 w-4" />
                            {error}
                        </div>
                    )}
                    <form onSubmit={handleSignup} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zen-700">Full Name</label>
                            <Input
                                placeholder="Jane Doe"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                required
                            />
                        </div>
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
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zen-700">Password</label>
                            <Input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zen-700">I am a...</label>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={() => setRole("client")}
                                    className={`p-3 rounded-xl border text-sm font-medium transition-all ${role === "client"
                                            ? "bg-zen-900 text-white border-zen-900"
                                            : "bg-white text-zen-600 border-zen-200 hover:border-zen-400"
                                        }`}
                                >
                                    Client
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setRole("therapist")}
                                    className={`p-3 rounded-xl border text-sm font-medium transition-all ${role === "therapist"
                                            ? "bg-zen-900 text-white border-zen-900"
                                            : "bg-white text-zen-600 border-zen-200 hover:border-zen-400"
                                        }`}
                                >
                                    Therapist
                                </button>
                            </div>
                        </div>

                        <Button type="submit" className="w-full bg-zen-900 hover:bg-zen-800 text-white" disabled={loading}>
                            {loading ? "Creating Account..." : "Sign Up"}
                        </Button>
                    </form>
                    <div className="text-center text-sm text-zen-600">
                        Already have an account?{" "}
                        <Link href="/login" className="text-zen-900 font-medium hover:underline">
                            Sign in
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
