"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Mail, Phone, MapPin, ArrowRight } from "lucide-react";
import { ContactFAQ } from "@/components/sections/ContactFAQ";

export default function ContactPage() {
    return (
        <main className="pt-32 pb-24 bg-white min-h-screen">
            <section className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">

                    {/* Left Column: Info */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="space-y-12"
                    >
                        <div>
                            <h1 className="text-5xl md:text-6xl font-serif font-medium text-zen-900 mb-6">
                                Get in Touch
                            </h1>
                            <p className="text-xl text-zen-600 leading-relaxed">
                                Have a question or want to discuss how we can help? We'd love to hear from you. Contact us today for a confidential consultation.
                            </p>
                        </div>

                        <div className="space-y-8">
                            {[
                                { icon: Mail, title: "Email Us", content: "hello@zenafs.com" },
                                { icon: Phone, title: "Call Us", content: "+44 (0) 20 1234 5678" },
                                { icon: MapPin, title: "Visit Us", content: "123 Wellness Way, London, UK" }
                            ].map((item, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: 0.2 + (index * 0.1) }}
                                    className="flex items-start gap-4 group"
                                >
                                    <div className="p-3 bg-zen-50 rounded-full group-hover:bg-zen-100 transition-colors duration-300">
                                        <item.icon className="w-6 h-6 text-zen-900" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-zen-900 mb-1">{item.title}</h3>
                                        <p className="text-zen-600">{item.content}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Right Column: Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="bg-zen-50 p-8 md:p-12 rounded-3xl shadow-sm hover:shadow-md transition-shadow duration-300"
                    >
                        <h3 className="text-2xl font-serif font-medium text-zen-900 mb-8">Send us a message</h3>
                        <form className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-zen-900">First Name</label>
                                    <Input placeholder="Jane" className="bg-white border-none h-12 focus:ring-1 focus:ring-zen-200" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-zen-900">Last Name</label>
                                    <Input placeholder="Doe" className="bg-white border-none h-12 focus:ring-1 focus:ring-zen-200" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zen-900">Email</label>
                                <Input type="email" placeholder="jane@example.com" className="bg-white border-none h-12 focus:ring-1 focus:ring-zen-200" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zen-900">Message</label>
                                <textarea
                                    className="w-full min-h-[150px] p-4 rounded-md bg-white border-none resize-none focus:outline-none focus:ring-1 focus:ring-zen-200"
                                    placeholder="How can we help you?"
                                />
                            </div>

                            <Button className="w-full h-12 bg-zen-900 hover:bg-zen-800 text-white rounded-full text-lg shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]">
                                Send Message <ArrowRight className="ml-2 w-4 h-4" />
                            </Button>
                        </form>
                    </motion.div>

                </div>
            </section>

            {/* FAQ Section */}
            <ContactFAQ />
        </main>
    );
}
