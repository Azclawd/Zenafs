"use client";

import { motion } from "framer-motion";

export function OurPromise() {
    return (
        <section className="py-32 bg-zen-50">
            <div className="container mx-auto px-4 md:px-6">
                <div className="max-w-4xl mx-auto text-center space-y-8">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-serif font-medium text-zen-900"
                    >
                        Our Promise to You
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-xl md:text-2xl text-zen-700 leading-relaxed font-light"
                    >
                        We believe that everyone deserves a safe space to heal and grow. Our commitment is to provide compassionate, evidence-based care that empowers you to reclaim your life and find lasting inner peace.
                    </motion.p>
                </div>
            </div>
        </section>
    );
}
