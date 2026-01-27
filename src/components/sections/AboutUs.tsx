"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export function AboutUs() {
    return (
        <section id="about" className="py-32 bg-white overflow-hidden">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="relative"
                    >
                        <div className="relative h-[600px] rounded-3xl overflow-hidden shadow-2xl">
                            <img
                                src="/images/about-positive-abstract.jpg"
                                alt="Abstract representation of positive growth and mental health"
                                className="object-cover w-full h-full hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                        </div>
                        {/* Decorative element */}
                        <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-zen-100 rounded-full -z-10 blur-3xl opacity-50" />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="space-y-8"
                    >
                        <h2 className="text-4xl md:text-5xl font-serif font-medium text-zen-900 leading-tight">
                            Our Approach
                        </h2>

                        <div className="space-y-6 text-lg text-zen-600 leading-relaxed">
                            <p>
                                My approach blends <span className="font-semibold text-zen-800">NLP, CBT-informed practice, and Occupational Therapy</span> to support real, whole-body change.
                            </p>
                            <p>
                                Using <span className="font-semibold text-zen-800">NLP</span>, we explore and gently rewire unhelpful thought patterns, internal stories, and the automatic reactions that shape how you see, hear, and experience the world.
                            </p>
                            <p>
                                My <span className="font-semibold text-zen-800">CBT-informed tools</span> help you notice patterns, challenge anxious spirals, and build new ways of thinking that feel lighter and more empowering.
                            </p>
                            <p>
                                Through an <span className="font-semibold text-zen-800">Occupational Therapy lens</span>, we look at your daily habits, sensory needs, routines, and the practical side of wellbeing — helping you create a life that feels calmer, more regulated, and more aligned with who you want to be.
                            </p>
                            <p className="italic text-zen-800 font-medium border-l-4 border-zen-300 pl-4">
                                "Together, these approaches help you shift both the mind and the body — so change isn’t just something you understand, but something you can actually feel."
                            </p>
                        </div>

                        <Button className="bg-zen-900 text-white hover:bg-zen-800 rounded-full px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all">
                            Learn More About Us
                        </Button>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
