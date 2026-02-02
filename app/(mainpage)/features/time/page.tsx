"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function HoursPage() {
  return (
    <div className="">
      {/* HERO SECTION */}
      <section className="my-24 w-full">
        <div className="max-w-7xl mx-auto h-full px-4 grid grid-cols-1 md:grid-cols-2 items-center gap-12">
          {/* RIGHT SIDE – IMAGE */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex justify-center md:justify-end"
          >
            <div className="w-[460px]">
              <Image
                src="/time/time6.png"
                alt="Employee time reporting dashboard"
                width={900}
                height={600}
                className="w-full h-auto object-contain"
              />
            </div>
          </motion.div>

          {/* LEFT SIDE – TEXT */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl text-left"
          >
            <h1 className="text-3xl font-extrabold mb-4 text-[#00687a] uppercase">
              Employee Time Reporting
            </h1>

            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Track, Approve, and Manage Hours Effortlessly
            </h2>

            <p className="text-gray-700 text-lg leading-relaxed">
              Arbetsdesk provides a complete overview of employee hours, capturing all time
              entries automatically through the time clock. Schedule deviations are flagged
              instantly, allowing you to approve hours, record absences, or make adjustments
              in just a few clicks. Time reports can be sent via email, printed, or filtered
              by date range, ensuring accurate records and streamlined payroll processing.
            </p>
          </motion.div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="relative bg-[#02505e] text-center">
        <svg
          className="absolute -top-px left-0 w-full h-32 sm:h-24 md:h-24"
          viewBox="0 0 1440 100"
          preserveAspectRatio="none"
        >
          <path
            fill="#ffffff"
            d="M0,60 C240,100 480,20 720,30 960,40 1200,80 1440,30 L1440,0 L0,0 Z"
          />
        </svg>

        <div className="relative z-10 py-24 px-4">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-100 mb-4 uppercase">
            Ready to Simplify Time Tracking?
          </h2>
          <p className="text-teal-500 mb-8 max-w-xl mx-auto">
            Automate time reporting, approvals, and recordkeeping to save time and reduce errors.
          </p>

          <a
            href="/book-demo"
            className="inline-block bg-[#00687a] text-gray-100 px-8 py-3 rounded-full font-semibold hover:bg-[#037d93] transition shadow-lg"
          >
            Book a Free Demo
          </a>
        </div>
      </section>
    </div>
  );
}
