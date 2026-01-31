"use client";

import React, { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";

interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
  direction?: "up" | "down" | "left" | "right" | "none";
  distance?: number;
}

/**
 * FadeIn component that animates children on mount
 * Uses IntersectionObserver for viewport-based animation
 */
export function FadeIn({
  children,
  delay = 0,
  duration = 600,
  className,
  direction = "up",
  distance = 20,
}: FadeInProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Once visible, stop observing
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  const getTransform = () => {
    if (!isVisible) {
      switch (direction) {
        case "up":
          return `translateY(${distance}px)`;
        case "down":
          return `translateY(-${distance}px)`;
        case "left":
          return `translateX(${distance}px)`;
        case "right":
          return `translateX(-${distance}px)`;
        default:
          return "none";
      }
    }
    return "none";
  };

  return (
    <div
      ref={ref}
      className={cn("transition-all", className)}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: getTransform(),
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
        transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      {children}
    </div>
  );
}

/**
 * Stagger children fade-in animations
 */
export function StaggerGroup({
  children,
  staggerDelay = 100,
  className,
}: {
  children: React.ReactNode;
  staggerDelay?: number;
  className?: string;
}) {
  return (
    <div className={className}>
      {React.Children.map(children, (child, index) => (
        <FadeIn delay={index * staggerDelay}>{child}</FadeIn>
      ))}
    </div>
  );
}

/**
 * Grid with staggered fade-in
 */
export function FadeInGrid({
  children,
  cols = 4,
  staggerDelay = 100,
  className,
}: {
  children: React.ReactNode;
  cols?: number;
  staggerDelay?: number;
  className?: string;
}) {
  const gridClass = {
    1: "grid-cols-1",
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 xl:grid-cols-4",
  }[cols] || "grid-cols-1 sm:grid-cols-2 xl:grid-cols-4";

  return (
    <div className={cn("grid gap-4", gridClass, className)}>
      {React.Children.map(children, (child, index) => (
        <FadeIn delay={index * staggerDelay}>{child}</FadeIn>
      ))}
    </div>
  );
}
