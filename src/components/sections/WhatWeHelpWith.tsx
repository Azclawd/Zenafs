"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/Card";
import { Brain, Heart, Sparkles, Coffee, CloudRain } from "lucide-react";

const conditions = [
    {
        title: "Anxiety Management",
        description: "Learn how to quiet the noise inside your mind and soften the tension in your body. I’ll guide you to notice the early signs, tune into the sound of your breath, and feel your whole system gently unwind. Together, we create a toolbox of grounding rituals so you can move through the world feeling clearer, lighter, and more steady.",
        icon: Brain
    },
    {
        title: "Attachment & Relationship Patterns",
        description: "Explore the emotional patterns that shape how you see, hear, and feel connection. Whether you experience anxious or avoidant attachment, we’ll uncover the signals your body sends in relationships and learn how to create a sense of safety that you can actually feel in your chest, your breath, and your boundaries.",
        icon: Heart
    },
    {
        title: "Feminine Energy & Self-Connection",
        description: "Reconnect with the softer, intuitive part of you — the part that listens to your body, follows its rhythm, and moves through life with more flow than force. We’ll explore what feels like to rest deeply, soften tension, listen inward, and create space for emotional expression.",
        icon: Sparkles
    },
    {
        title: "Self-Care & Self-Compassion",
        description: "Learn to build a self-care routine that you can feel working in your body — steadying your breath, relaxing your shoulders, and creating moments of quiet comfort. Together, we design rituals that help you feel nourished, balanced, and supported, using sensory tools that help you reconnect with yourself.",
        icon: Coffee
    },
    {
        title: "Low Mood & Emotional Overwhelm",
        description: "If you’ve been feeling heavy, numb, or stuck, we’ll explore what’s underneath the emotions and build small, manageable steps that help you feel a spark of energy returning. Through somatic grounding, gentle activation, and sensory-based strategies, you’ll start to notice moments of clarity, lightness, and emotional movement again.",
        icon: CloudRain
    },
];

export function WhatWeHelpWith() {
    return (
        <section className="py-32 bg-zen-50">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-20">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-serif font-medium text-zen-900 mb-6"
                    >
                        What We Help With
                    </motion.h2>
                    <p className="text-zen-600 text-lg max-w-2xl mx-auto">
                        Our evidence-based approaches are designed to treat a wide range of mental health conditions.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
                    {conditions.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card className="h-full border-none shadow-sm hover:shadow-xl transition-all duration-500 bg-white rounded-3xl group cursor-pointer overflow-hidden">
                                <CardContent className="p-8 space-y-6">
                                    <div className="h-12 w-12 rounded-2xl bg-zen-100 flex items-center justify-center group-hover:bg-zen-900 transition-colors duration-500">
                                        <item.icon className="h-6 w-6 text-zen-600 group-hover:text-white transition-colors duration-500" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-serif font-medium text-zen-900 group-hover:text-zen-700 transition-colors mb-4">
                                            {item.title}
                                        </h3>
                                        <p className="text-zen-600 leading-relaxed group-hover:text-zen-800 transition-colors text-sm">
                                            {item.description}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
