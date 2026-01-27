"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

const expertise = [
    "Cognitive Behavioral Therapy (CBT)",
    "Mindfulness-Based Stress Reduction",
    "Trauma-Informed Care",
    "Neuro-Linguistic Programming (NLP)",
    "Family Systems Therapy",
    "Solution-Focused Brief Therapy",
    "Anxiety & Depression Management",
    "Relationship Counseling",
];

export function OurExpertise() {
    return (
        <section className="py-32 bg-white">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="space-y-6"
                    >
                        <h2 className="text-4xl md:text-5xl font-serif font-medium text-zen-900">
                            Our Expertise
                        </h2>
                        <p className="text-lg text-zen-600 leading-relaxed">
                            Our team of licensed professionals brings a diverse range of specialized skills to help you navigate life's challenges. We tailor our approach to your unique needs.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {expertise.map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.05 }}
                                className="flex items-center gap-3"
                            >
                                <CheckCircle2 className="w-6 h-6 text-zen-500 flex-shrink-0" />
                                <span className="text-lg text-zen-800 font-medium">{item}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
