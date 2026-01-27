"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const steps = [
    {
        number: "01",
        title: "Connect",
        description: "Create your profile and tell us about your goals and needs. We'll listen to your story.",
    },
    {
        number: "02",
        title: "Match",
        description: "We pair you with a therapist perfectly suited to your journey, ensuring a strong therapeutic alliance.",
    },
    {
        number: "03",
        title: "Grow",
        description: "Begin your sessions and track your progress with our tools. Experience meaningful change.",
    },
    {
        number: "04",
        title: "Thrive",
        description: "Achieve balance and maintain your well-being long-term. Live your best life.",
    },
];

export function ProcessFlow() {
    return (
        <section id="process" className="py-32 bg-white overflow-hidden">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-24">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-6xl font-serif font-medium text-zen-900 mb-6"
                    >
                        Our Process
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-zen-600 text-lg max-w-2xl mx-auto"
                    >
                        A simple, guided path to finding your best self.
                    </motion.p>
                </div>

                <div className="relative max-w-5xl mx-auto">
                    {/* Continuous Vertical Line */}
                    <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-zen-200 -translate-x-1/2" />

                    <div className="space-y-32">
                        {steps.map((step, index) => (
                            <motion.div
                                key={step.number}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                                className={cn(
                                    "relative flex flex-col md:flex-row items-center gap-12 md:gap-24",
                                    index % 2 === 0 ? "md:flex-row-reverse" : ""
                                )}
                            >
                                {/* Content Side */}
                                <div className="flex-1 text-left md:text-right w-full pl-12 md:pl-0">
                                    <div className={cn(
                                        "space-y-4",
                                        index % 2 === 0 ? "md:text-left" : "md:text-right"
                                    )}>
                                        <span className="text-8xl font-serif text-zen-100/50 font-bold block absolute -top-10 left-0 md:left-auto md:relative z-0 select-none">
                                            {step.number}
                                        </span>
                                        <div className="relative z-10">
                                            <h3 className="text-3xl font-serif font-medium text-zen-900 mb-4">
                                                {step.title}
                                            </h3>
                                            <p className="text-zen-600 text-lg leading-relaxed max-w-md ml-auto mr-auto md:mx-0">
                                                {step.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Center Node */}
                                <div className="absolute left-4 md:left-1/2 -translate-x-1/2 flex items-center justify-center z-10">
                                    <div className="w-4 h-4 rounded-full bg-zen-900 ring-4 ring-white" />
                                </div>

                                {/* Empty Side for Balance */}
                                <div className="flex-1 hidden md:block" />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
