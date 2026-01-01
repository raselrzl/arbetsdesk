"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

const features = [
  {
    title: "Time Log",
    desc: "Track work hours accurately in real time.",
    img: "/icons/1.png",
    href: "/features/timelog",
  },
  {
    title: "Scheduling",
    desc: "Plan shifts and avoid conflicts easily.",
    img: "/icons/7.png",
    href: "/features/schedule",
  },
  {
    title: "Payment Management",
    desc: "Automated salary calculations and payouts.",
    img: "/icons/9.png",
    href: "/features/payroll",
  },
  {
    title: "Analytics",
    desc: "Understand performance with smart insights.",
    img: "/icons/3.png",
    href: "/features/analytics",
  },
  {
    title: "Employee Management",
    desc: "Manage employees from one dashboard.",
    img: "/icons/10.png",
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
          {features.map((feature, idx) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: idx * 0.05 }}
              className="bg-teal-900 rounded-2xl p-6 flex flex-col justify-between hover:-translate-y-2 hover:shadow-2xl transition-transform duration-300"
            >
              <div className="flex flex-col items-center">
                {/* Image */}
                <div className="w-16 h-16 mb-4 relative">
                  <Image
                    src={feature.img}
                    alt={feature.title}
                    fill
                    className="object-contain"
                  />
                </div>

                <h3 className="text-lg md:text-xl font-semibold text-white mb-2 text-center">
                  {feature.title}
                </h3>

                <p className="text-sm md:text-base text-teal-100 text-center">
                  {feature.desc}
                </p>
              </div>

              <Link
                href={feature.href}
                className="mt-5 inline-block text-sm md:text-base font-semibold text-teal-300 hover:text-white text-center transition"
              >
                Learn more →
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
