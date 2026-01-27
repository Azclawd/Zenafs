"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/Card";
import testimonialsData from "@/data/testimonials.json";
import { Quote } from "lucide-react";

export function Testimonials() {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % testimonialsData.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <section id="testimonials" className="py-32 bg-white overflow-hidden">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-20">
                    <h2 className="text-4xl md:text-5xl font-serif font-medium text-zen-900 mb-6">
                        Stories of Transformation
                    </h2>
                    <p className="text-zen-600 text-lg max-w-xl mx-auto">
                        Real experiences from those who have found their path to inner peace.
                    </p>
                </div>

                <div className="relative max-w-5xl mx-auto">
                    <div className="overflow-hidden relative min-h-[400px]">
                        <motion.div
                            key={currentIndex}
                            initial={{ opacity: 0, x: 100 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -100 }}
                            transition={{ duration: 0.5, ease: "easeInOut" }}
                            className="absolute inset-0 flex items-center justify-center p-4"
                        >
                            <Card className="max-w-3xl w-full bg-zen-50 border-none shadow-lg rounded-3xl p-8 md:p-12">
                                <CardContent className="flex flex-col items-center text-center space-y-8">
                                    <Quote className="h-12 w-12 text-zen-300" />
                                    <p className="text-xl md:text-2xl text-zen-800 font-serif italic leading-relaxed">
                                        "{testimonialsData[currentIndex].quote}"
                                    </p>
                                    <div className="space-y-1">
                                        <h4 className="text-lg font-bold text-zen-900">{testimonialsData[currentIndex].name}</h4>
                                        <p className="text-zen-500 font-medium tracking-wide uppercase text-xs">{testimonialsData[currentIndex].role}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex justify-center gap-4 mt-8">
                        <button
                            onClick={() => setCurrentIndex((prev) => (prev - 1 + testimonialsData.length) % testimonialsData.length)}
                            className="p-3 rounded-full bg-white border border-zen-200 hover:bg-zen-50 transition-colors shadow-sm"
                            aria-label="Previous testimonial"
                        >
                            <svg className="w-6 h-6 text-zen-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <button
                            onClick={() => setCurrentIndex((prev) => (prev + 1) % testimonialsData.length)}
                            className="p-3 rounded-full bg-white border border-zen-200 hover:bg-zen-50 transition-colors shadow-sm"
                            aria-label="Next testimonial"
                        >
                            <svg className="w-6 h-6 text-zen-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
