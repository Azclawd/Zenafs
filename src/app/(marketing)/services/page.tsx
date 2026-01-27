"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { CheckCircle2, ArrowRight, ShieldCheck, Lock, TrendingUp, Users } from "lucide-react";
import Link from "next/link";
import { ProcessFlow } from "@/components/sections/ProcessFlow";

export default function ServicesPage() {
    return (
        <main className="pt-32 pb-24 bg-white">
            {/* Header Section */}
            <section className="container mx-auto px-4 md:px-6 mb-24">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-4xl"
                >
                    <h1 className="text-5xl md:text-7xl font-serif font-medium text-zen-900 mb-8 leading-tight">
                        We unlock your potential with <span className="italic text-zen-600">compassionate care</span> and clinical excellence.
                    </h1>
                </motion.div>
            </section>

            {/* Our Promise (Landspire Style) */}
            <section className="bg-zen-50 py-24">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                        <div className="lg:col-span-4">
                            <h2 className="text-3xl font-serif font-medium text-zen-900 mb-4">Our Promise</h2>
                            <p className="text-zen-600 text-lg">
                                We understand that seeking help is a significant decision. That's why we've structured our approach to ensure you feel secure every step of the way.
                            </p>
                        </div>
                        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                            {[
                                { icon: ShieldCheck, title: "Safe & Confidential", desc: "Your privacy is our top priority. All sessions are strictly confidential." },
                                { icon: Users, title: "You Retain Control", desc: "You are the expert on your life. We work in partnership with you." },
                                { icon: TrendingUp, title: "Evidence-Based", desc: "Our methods are grounded in scientific research to ensure effectiveness." },
                                { icon: Lock, title: "Transparent Care", desc: "No hidden fees, no confusing jargon. Just clear communication." }
                            ].map((item, i) => (
                                <div key={i} className="bg-white p-8 rounded-2xl shadow-sm">
                                    <item.icon className="w-8 h-8 text-zen-600 mb-4" />
                                    <h3 className="text-xl font-bold text-zen-900 mb-2">{item.title}</h3>
                                    <p className="text-zen-600">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Process Flow */}
            <ProcessFlow />

            {/* Our Expertise (Landspire Style) */}
            <section className="py-24">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-4xl font-serif font-medium text-zen-900 mb-8">Why Partner With Us?</h2>
                            <div className="space-y-6">
                                {[
                                    { title: "Clinical Excellence", desc: "Licensed professionals with years of specialized experience." },
                                    { title: "Personalized Strategy", desc: "Tailored treatment plans that adapt to your unique needs." },
                                    { title: "Holistic Approach", desc: "Addressing mind, body, and spirit for lasting wellness." },
                                    { title: "Ongoing Support", desc: "Resources and tools to support you between sessions." }
                                ].map((item, i) => (
                                    <div key={i} className="border-b border-zen-100 pb-6 last:border-0">
                                        <h3 className="text-xl font-bold text-zen-900 mb-2">{item.title}</h3>
                                        <p className="text-zen-600">{item.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="relative h-[600px] bg-zen-100 rounded-2xl overflow-hidden hidden lg:block shadow-xl">
                            <img
                                src="/images/services-nature.jpg"
                                alt="Our therapeutic environment"
                                className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <div className="mt-32 bg-zen-50 rounded-3xl p-12 md:p-24 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <img src="/images/services-texture.jpg" alt="Background pattern" className="w-full h-full object-cover grayscale" />
                </div>
                <div className="relative z-10 max-w-3xl mx-auto text-center space-y-8">
                    <h2 className="text-4xl md:text-5xl font-serif text-zen-900">
                        Ready to find your balance?
                    </h2>
                    <p className="text-xl text-zen-600 leading-relaxed">
                        Our team of expert therapists is here to guide you through your journey to mental wellness.
                    </p>
                    <Button size="lg" className="bg-zen-900 text-white hover:bg-zen-800 text-lg px-10 py-6 rounded-full">
                        Book a Consultation
                    </Button>
                </div>
            </div>
        </main>
    );
}
