"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Clock,
  Calendar,
  Wallet,
  BarChart3,
  Users,
} from "lucide-react";

const features = [
  {
    title: "Time Clock",
    desc: "Track work hours accurately in real time.",
    icon: Clock,
    href: "/features/time-clock",
  },
  {
    title: "Scheduling",
    desc: "Plan shifts and avoid conflicts easily.",
    icon: Calendar,
    href: "/features/schedule",
  },
  {
    title: "Payroll",
    desc: "Automated salary calculations and payouts.",
    icon: Wallet,
    href: "/features/payroll",
  },
  {
    title: "Analytics",
    desc: "Understand performance with smart insights.",
    icon: BarChart3,
    href: "/features/analytics",
  },
  {
    title: "Staff Management",
    desc: "Manage employees from one dashboard.",
    icon: Users,
    href: "/features/staff",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-24 bg-[#f9fafb] border-t">
      <div className="max-w-7xl mx-auto px-6 text-start">
        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-5xl font-extrabold text-teal-900"
        >
          Powerful Features
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-lg text-gray-600 mt-3 mb-14"
        >
          Everything you need to manage your workforce efficiently
        </motion.p>

        {/* Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          transition={{ staggerChildren: 0.1 }}
        >
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                className="bg-teal-900 border border-teal-950 rounded-xl p-6 text-left hover:shadow-xl transition"
              >
                <div className="w-12 h-12 mb-4 rounded-lg bg-teal-700 flex items-center justify-center text-white">
                  <Icon className="w-6 h-6" />
                </div>

                <h3 className="text-lg font-semibold text-white mb-2">
                  {feature.title}
                </h3>

                <p className="text-sm text-teal-100 mb-4">
                  {feature.desc}
                </p>

                <Link
                  href={feature.href}
                  className="text-sm font-medium text-teal-300 hover:text-white transition"
                >
                  Learn more →
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
