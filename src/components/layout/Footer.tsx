"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Facebook, Instagram, Linkedin, Twitter, ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { subscribeNewsletter } from "@/app/actions/newsletter";

export function Footer() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
    const [message, setMessage] = useState("");

    async function handleSubscribe(formData: FormData) {
        setLoading(true);
        setStatus("idle");
        setMessage("");

        const result = await subscribeNewsletter(formData);

        setLoading(false);
        if (result.error) {
            setStatus("error");
            setMessage(result.error);
        } else {
            setStatus("success");
            setEmail("");
        }
    }

    return (
        <footer className="bg-zen-900 text-white pt-24 pb-12">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand */}
                    <div className="space-y-6">
                        <Link href="/" className="text-2xl font-serif font-bold tracking-tight">
                            Zenafs
                        </Link>
                        <p className="text-zen-300 leading-relaxed">
                            Empowering you to find balance and clarity through compassionate, evidence-based therapy.
                        </p>
                        <div className="flex gap-4">
                            {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                                <a key={i} href="#" className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                                    <Icon className="h-5 w-5" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-bold mb-6">Quick Links</h3>
                        <ul className="space-y-4">
                            {["About Us", "Services", "Therapists", "Contact"].map((item) => (
                                <li key={item}>
                                    <Link
                                        href={
                                            item === "About Us" ? "/about" :
                                                item === "Therapists" ? "/therapists" :
                                                    `/${item.toLowerCase()}`
                                        }
                                        className="text-zen-300 hover:text-white transition-colors"
                                    >
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h3 className="text-lg font-bold mb-6">Services</h3>
                        <ul className="space-y-4">
                            {["Individual Therapy", "Couples Counseling", "Anxiety Management", "Depression Support"].map((item) => (
                                <li key={item}>
                                    <Link href="/services" className="text-zen-300 hover:text-white transition-colors">
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h3 className="text-lg font-bold mb-6">Stay Connected</h3>
                        <p className="text-zen-300 mb-4">
                            Join our newsletter for wellness tips and updates.
                        </p>
                        {status === "success" ? (
                            <div className="flex items-center gap-2 text-green-400 p-4 bg-white/5 rounded-xl">
                                <CheckCircle2 className="h-5 w-5" />
                                <span>Subscribed successfully!</span>
                            </div>
                        ) : (
                            <form action={handleSubscribe} className="space-y-2">
                                <div className="relative">
                                    <Input
                                        type="email"
                                        name="email"
                                        placeholder="Enter your email"
                                        className="bg-white/10 border-none text-white placeholder:text-zen-400 h-12 pr-12 rounded-xl focus-visible:ring-zen-400"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                    <Button
                                        type="submit"
                                        size="icon"
                                        className="absolute right-1 top-1 h-10 w-10 bg-white text-zen-900 hover:bg-zen-100 rounded-lg"
                                        disabled={loading}
                                    >
                                        <ArrowRight className="h-4 w-4" />
                                    </Button>
                                </div>
                                {status === "error" && (
                                    <p className="text-red-400 text-sm">{message}</p>
                                )}
                            </form>
                        )}
                    </div>
                </div>

                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-zen-400 text-sm">
                    <p>© 2024 Zenafs. All rights reserved.</p>
                    <div className="flex gap-8">
                        <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
