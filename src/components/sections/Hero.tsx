"use client";

import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { useEffect, useRef } from "react";
import { textReveal } from "@/lib/animations";

export function Hero() {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.playbackRate = 1.0;
        }
    }, []);

    return (
        <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-zen-900">
            {/* Video Background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-black/40 z-10" /> {/* Overlay for contrast */}
                <video
                    ref={videoRef}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover opacity-90 blur-sm scale-105"
                >
                    <source
                        src="/videos/hero-video.mp4"
                        type="video/mp4"
                    />
                    Your browser does not support the video tag.
                </video>
            </div>

            {/* Content */}
            <div className="relative z-10 container mx-auto px-4 md:px-6 text-center">

                {/* Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8"
                >
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    <span className="text-sm font-medium text-zen-100 tracking-wide uppercase">Ready to find your balance</span>
                </motion.div>

                {/* Headline */}
                <motion.div
                    initial="initial"
                    animate="animate"
                    className="overflow-hidden mb-8"
                >
                    <motion.h1
                        variants={textReveal}
                        className="text-5xl md:text-7xl lg:text-8xl font-serif font-medium text-white tracking-tight leading-tight"
                    >
                        Where clarity <br className="hidden md:block" /> finds you.
                    </motion.h1>
                </motion.div>

                {/* Subheadline */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="text-lg md:text-xl text-zen-200 max-w-2xl mx-auto mb-12 leading-relaxed font-light"
                >
                    A reflective space built for those who carry too much. Pause here until the mind clears and decisions begin to breathe again.
                </motion.p>

                {/* CTAs */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
                >
                    <Link href="/signup?role=client">
                        <Button size="lg" className="h-14 px-8 rounded-full bg-white text-zen-900 hover:bg-zen-100 text-lg font-medium transition-all hover:scale-105">
                            Start your journey
                        </Button>
                    </Link>
                    <Link href="/#process">
                        <Button size="lg" variant="outline" className="h-14 px-8 rounded-full border-white/20 text-white hover:bg-white/10 backdrop-blur-sm text-lg font-medium">
                            <Play className="mr-2 h-4 w-4 fill-current" />
                            See how it works
                        </Button>
                    </Link>
                </motion.div>

                {/* Social Proof / Stats */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.8 }}
                    className="flex flex-wrap justify-center gap-8 md:gap-16 border-t border-white/10 pt-12 max-w-4xl mx-auto"
                >
                    <div className="text-center">
                        <div className="text-3xl font-serif text-white mb-1">1.2K+</div>
                        <div className="text-sm text-zen-400 uppercase tracking-wider">Clients Helped</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-serif text-white mb-1">98%</div>
                        <div className="text-sm text-zen-400 uppercase tracking-wider">Satisfaction</div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
