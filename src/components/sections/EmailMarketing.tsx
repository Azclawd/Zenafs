"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Mail } from "lucide-react";

export function EmailMarketing() {
    return (
        <section className="py-32 bg-zen-900 text-white relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-zen-400 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
            </div>

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <div className="max-w-3xl mx-auto text-center space-y-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl md:text-5xl font-serif font-medium mb-6">
                            Join Our Community
                        </h2>
                        <p className="text-zen-200 text-lg md:text-xl font-light">
                            Receive weekly insights, mindfulness tips, and exclusive resources directly to your inbox.
                        </p>
                    </motion.div>

                    <motion.form
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto"
                        onSubmit={(e) => e.preventDefault()}
                    >
                        <div className="relative flex-1">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zen-400" />
                            <Input
                                type="email"
                                placeholder="Enter your email address"
                                className="pl-12 h-12 bg-white/5 border-white/20 text-white placeholder:text-zen-400 focus-visible:ring-white/30 focus-visible:border-white/50 rounded-full transition-all"
                            />
                        </div>
                        <Button size="lg" className="h-12 px-8 bg-white text-zen-900 hover:bg-zen-100 rounded-full font-medium">
                            Subscribe
                        </Button>
                    </motion.form>

                    <p className="text-xs text-zen-400">
                        We respect your privacy. Unsubscribe at any time.
                    </p>
                </div>
            </div>
        </section>
    );
}
