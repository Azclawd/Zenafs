"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import servicesData from "@/data/services.json";
import { ArrowRight } from "lucide-react";

export function Services() {
    return (
        <section id="services" className="py-32 bg-zen-50">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-20">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-serif font-medium text-zen-900 mb-6"
                    >
                        Services Tailored to You
                    </motion.h2>
                    <p className="text-zen-600 text-lg max-w-2xl mx-auto">
                        Choose the path that fits your needs. Flexible options for every stage of life.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    {servicesData.map((service, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card className="h-full border-none shadow-sm hover:shadow-xl transition-all duration-300 bg-white group">
                                <CardHeader>
                                    <CardTitle className="text-2xl font-serif font-medium text-zen-900 group-hover:text-zen-700 transition-colors">
                                        {service.title}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <p className="text-zen-600 leading-relaxed">
                                        {service.description}
                                    </p>
                                    <div className="flex items-center justify-between pt-4 border-t border-zen-100">
                                        <div>
                                            <p className="text-lg font-bold text-zen-900">{service.price}</p>
                                            <p className="text-sm text-zen-500">{service.duration}</p>
                                        </div>
                                        <Link href="/signup?role=client">
                                            <Button variant="outline" className="rounded-full px-6 border-zen-200 hover:border-zen-900 hover:bg-zen-900 hover:text-white transition-all">
                                                Book Now
                                            </Button>
                                        </Link>
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
