"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

export default function FeaturesPage() {
  const features = [
    {
      title: "Time Log",
      href: "/features/timelog",
      icon: "/icons/1.png",
    },
    {
      title: "Efficient Scheduling",
      href: "/features/schedule",
      icon: "/icons/7.png",
    },
    {
      title: "Payment Management",
      href: "/features/payroll",
      icon: "/icons/9.png",
    },
    {
      title: "Analytics",
      href: "/features/analytics",
      icon: "/icons/3.png",
    },
    {
      title: "Tip Distribution",
      href: "/features/tips",
      icon: "/icons/8.png",
    },
    {
      title: "Contracts & Certificates",
      href: "/features/jobcontracts",
      icon: "/icons/6.png",
    },
    {
      title: "Cummunication",
      href: "/features/communication",
      icon: "/icons/2.png",
    },

    {
      title: "Employee",
      href: "/features/employee",
      icon: "/icons/10.png",
    },

    {
      title: "Time Report",
      href: "/features/time",
      icon: "/icons/11.png",
    },
  ];

  return (
    <>
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          {/* Heading */}
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.7 }}
            className="text-3xl font-extrabold text-[#00687a] mb-4 uppercase"
          >
            Arbetsdesk Features
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="text-lg text-teal-700 mt-2 mb-10"
          >
            Discover the tools that power smart workforce management.
          </motion.p>

          {/* Feature Cards */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.2 }}
            transition={{ staggerChildren: 0.1 }}
          >
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                className="bg-[#00687a] border border-teal-950 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-1 transition"
              >
                <Link
                  href={feature.href}
                  className="flex items-center justify-between p-6 text-left group"
                >
                  <div className="flex items-center gap-4">
                    {/* Image Icon */}
                    {/* Image Icon */}
                    <div className="w-10 h-10 bg-white rounded-md flex items-center justify-center overflow-hidden">
                      <img
                        src={feature.icon}
                        alt={feature.title}
                        className="w-8 h-8 object-contain scale-110"
                      />
                    </div>

                    <h3 className="text-lg font-semibold text-white group-hover:underline">
                      {feature.title}
                    </h3>
                  </div>

                  {/* Chevron */}
                  <ChevronRight className="w-5 h-5 text-white opacity-70 group-hover:translate-x-1 transition" />
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      {/* Call to Action */}

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative bg-white px-6 py-16 text-center shadow-xl rounded-2xl"
      >
        {/* Heading */}
        <h3 className="text-3xl sm:text-4xl uppercase font-extrabold text-[#00687a] mb-6">
          Ready to simplify your workforce management?
        </h3>

        {/* CTA Button */}
        <Link
          href="/book-demo"
          className="inline-flex items-center gap-2 my-6 bg-[#00687a] hover:bg-teal-700 text-white font-semibold px-8 py-4 rounded-full transition shadow-md"
        >
          Book a demo now
          <ChevronRight className="w-5 h-5" />
        </Link>

        {/* Description */}
        <p className="text-gray-700 max-w-2xl mx-auto mb-8 text-lg">
          Arbetsdesk helps you save time, reduce errors, and gain full control
          over scheduling, time tracking, payroll, and communication — all in
          one platform. Book a demo and see how it works for your business.
        </p>

        {/* Footer Note */}
        <p className="text-gray-500 text-sm mt-4 border-t pt-4">
          No commitment • Free walkthrough • Tailored to your company
        </p>
      </motion.div>
    </>
  );
}
