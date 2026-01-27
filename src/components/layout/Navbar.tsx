"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Leaf } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

const navigation = [
    { name: "Home", href: "/" },
    { name: "Services", href: "/#services" },
    { name: "Process", href: "/#process" },
    { name: "Testimonials", href: "/#testimonials" },
];

export function Navbar() {
    const [isOpen, setIsOpen] = React.useState(false);
    const [isScrolled, setIsScrolled] = React.useState(false);
    const pathname = usePathname();
    const { user } = useAuth();

    React.useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header
            className={cn(
                "fixed top-6 left-0 right-0 z-50 transition-all duration-300 flex justify-center px-4",
                isScrolled ? "py-0" : "py-0"
            )}
        >
            <div className={cn(
                "container max-w-5xl mx-auto px-6 py-3 rounded-full transition-all duration-300 shadow-lg backdrop-blur-xl border border-white/10",
                isScrolled ? "bg-black/40" : "bg-black/20"
            )}>
                <nav className="flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-transform group-hover:scale-110">
                            <Leaf className="h-5 w-5" />
                        </div>
                        <span className="text-lg font-serif font-bold tracking-tight text-white">
                            Zenafs
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-1">
                        {[
                            { name: "Home", href: "/" },
                            { name: "Services", href: "/services" },
                            { name: "Contact", href: "/contact" },
                        ].map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="relative px-5 py-2 rounded-full text-sm font-medium text-zen-100 hover:text-white transition-colors group"
                            >
                                <span className="relative z-10">{item.name}</span>
                                <span className="absolute inset-0 rounded-full bg-white/10 scale-0 group-hover:scale-100 transition-transform duration-300 ease-out origin-center" />
                            </Link>
                        ))}
                        {user ? (
                            <Link href="/dashboard" className="ml-2">
                                <Button variant="default" className="rounded-full px-6 bg-zen-900 text-white hover:bg-zen-800 h-10 text-sm font-medium">
                                    Dashboard
                                </Button>
                            </Link>
                        ) : (
                            <Link href="/login" className="ml-2">
                                <Button variant="default" className="rounded-full px-6 bg-white text-zen-900 hover:bg-zen-100 h-10 text-sm font-medium">
                                    Client Login
                                </Button>
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2 text-white hover:bg-white/10 rounded-full transition-colors"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </button>
                </nav>
            </div>

            {/* Mobile Navigation */}
            {isOpen && (
                <div className="md:hidden absolute top-full mt-4 left-4 right-4 bg-zen-900/95 backdrop-blur-xl border border-white/10 rounded-3xl p-6 animate-fade-in shadow-2xl">
                    <div className="flex flex-col gap-2">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="text-lg font-medium text-zen-100 hover:text-white hover:bg-white/10 py-3 px-4 rounded-xl transition-all"
                                onClick={() => setIsOpen(false)}
                            >
                                {item.name}
                            </Link>
                        ))}
                        {user ? (
                            <Link href="/dashboard" onClick={() => setIsOpen(false)} className="mt-2">
                                <Button className="w-full bg-zen-900 text-white hover:bg-zen-800 h-12 text-lg rounded-xl">Dashboard</Button>
                            </Link>
                        ) : (
                            <Link href="/login" onClick={() => setIsOpen(false)} className="mt-2">
                                <Button className="w-full bg-white text-zen-900 hover:bg-zen-100 h-12 text-lg rounded-xl">Client Login</Button>
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
}
