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
    title: "Time Log",
    desc: "Track work hours accurately in real time.",
    icon: Clock,
    href: "/features/timelog",
  },
  {
    title: "Scheduling",
    desc: "Plan shifts and avoid conflicts easily.",
    icon: Calendar,
    href: "/features/schedule",
  },
  {
    title: "Payment Management",
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
    title: "Employee Management",
    desc: "Manage employees from one dashboard.",
    icon: Users,
    href: "/features/employee",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-24 bg-slate-50 border-t">
      <div className="max-w-7xl mx-auto px-6">
        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: -16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-2xl md:text-4xl font-extrabold text-teal-900 mb-12"
        >
          Everything you need to manage your workforce
        </motion.h2>

        {/* Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ staggerChildren: 0.1 }}
        >
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: idx * 0.05 }}
                className="bg-teal-900 rounded-2xl p-6 flex flex-col justify-between hover:-translate-y-1 hover:shadow-xl transition"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-teal-700 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-white" />
                  </div>

                  <h3 className="text-lg font-semibold text-white mb-2">
                    {feature.title}
                  </h3>

                  <p className="text-sm text-teal-100">
                    {feature.desc}
                  </p>
                </div>

                <Link
                  href={feature.href}
                  className="mt-5 inline-block text-sm font-semibold text-teal-300 hover:text-white transition"
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
