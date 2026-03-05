"use client";

import { motion } from "framer-motion";
import React from "react";

interface FeatureCardProps {
    title: string;
    description: string;
    icon: React.ReactNode;
    delay: number;
}

export function FeatureCard({ title, description, icon, delay }: FeatureCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay }}
            whileHover={{ y: -10 }}
            className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-lg transition-colors hover:bg-white/10"
        >
            <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-primary/20 blur-2xl transition-all group-hover:bg-primary/40" />

            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                {icon}
            </div>

            <h3 className="mb-2 text-xl font-bold text-white max-w-[80%]">{title}</h3>
            <p className="text-muted-foreground">{description}</p>
        </motion.div>
    );
}
