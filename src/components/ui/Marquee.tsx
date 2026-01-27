"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface MarqueeProps {
    children: ReactNode;
    speed?: "slow" | "normal" | "fast";
    direction?: "left" | "right";
    pauseOnHover?: boolean;
    className?: string;
}

export function Marquee({
    children,
    speed = "normal",
    direction = "left",
    pauseOnHover = true,
    className
}: MarqueeProps) {
    const speedClass = {
        slow: "animate-marquee-slow",
        normal: "animate-marquee",
        fast: "animate-marquee-fast"
    }[speed];

    const directionClass = direction === "right" ? "flex-row-reverse" : "";

    return (
        <div className={cn("relative overflow-hidden", className)}>
            <div
                className={cn(
                    "flex gap-8",
                    speedClass,
                    directionClass,
                    pauseOnHover && "hover:[animation-play-state:paused]"
                )}
            >
                {/* First set of children */}
                <div className="flex gap-8 shrink-0">
                    {children}
                </div>
                {/* Duplicate for seamless loop */}
                <div className="flex gap-8 shrink-0" aria-hidden="true">
                    {children}
                </div>
            </div>
        </div>
    );
}
