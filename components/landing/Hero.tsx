"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, LayoutDashboard } from "lucide-react";

export function Hero() {
    return (
        <section className="relative z-10 flex min-h-screen flex-col justify-center px-4 pt-20 text-center sm:px-6 lg:px-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="mx-auto max-w-4xl"
            >
                <h1 className="bg-gradient-to-r from-white via-white/90 to-white/70 bg-clip-text text-5xl font-extrabold tracking-tight text-transparent sm:text-6xl md:text-7xl lg:text-8xl">
                    Full Control Over Your <br />
                    <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                        Financial Future
                    </span>
                </h1>
                <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl md:mt-10 md:text-2xl">
                    Experience the next generation of expense management.
                    Beautifully designed, intuitively structured, and built for you.
                </p>

                <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
                    <Link href="/register">
                        <Button size="lg" className="h-12 w-full min-w-[200px] rounded-full text-base font-semibold shadow-lg transition-transform hover:scale-105 active:scale-95 sm:w-auto">
                            Get Started Free
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </Link>
                    <Link href="/login">
                        <Button size="lg" variant="outline" className="h-12 w-full min-w-[200px] rounded-full border-white/20 bg-white/5 text-base font-semibold backdrop-blur-sm transition-transform hover:scale-105 hover:bg-white/10 active:scale-95 sm:w-auto">
                            Live Demo
                        </Button>
                    </Link>
                </div>
            </motion.div>
        </section>
    );
}
