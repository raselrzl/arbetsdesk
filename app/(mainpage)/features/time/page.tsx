"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function HoursPage() {
  return (
    <main className="bg-white">
      {/* HERO SECTION */}
      <section className="max-w-7xl mx-auto px-4 py-24 flex flex-col md:flex-row items-center gap-12">
        {/* TEXT */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex-1 text-left"
        >
          <h1 className="text-3xl font-extrabold mb-6 text-[#00687a] uppercase">
            Employee Time Reporting
          </h1>

          <h2 className="text-xl font-semibold mb-6 text-[#00687a]">
            Automatic, Accurate, and Payroll-Ready
          </h2>

          <p className="text-[#00687a] text-sm md:text-lg max-w-3xl leading-relaxed text-justify">
            Arbetsdesk automatically generates time reports based on real
            time-log data. Every login, logout, break, and schedule deviation
            is recorded without manual input. Managers get full visibility
            into worked hours, approvals, absences, and overtime — all in one
            place.
          </p>
        </motion.div>

        {/* IMAGE */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex-1 flex justify-center md:justify-end"
        >
          <div className="w-[360px] md:w-[460px] bg-white rounded-xl relative">
            <Image
              src="/time/time9.png"
              alt="Employee time reporting dashboard"
              width={900}
              height={600}
              className="object-contain"
            />
          </div>
        </motion.div>
      </section>

      {/* FEATURES GRID */}
      <section className="w-full px-4">
        <div className="max-w-3xl mx-auto grid gap-8 md:grid-cols-1 mb-30">
          {/* AUTOMATIC REPORTS */}
          <div className="bg-white text-[#00687a] p-8 rounded-2xl shadow-lg">
            <h2 className="text-2xl font-extrabold mb-4 uppercase">
              Automatic Time Reports
            </h2>
            <p className="text-sm leading-relaxed text-justify">
              All time reports are generated automatically from the time
              clock. No manual entries, no forgotten hours. Reports reflect
              actual working time, including late starts, early finishes,
              overtime, and absences.
            </p>
          </div>

          {/* APPROVAL & CONTROL */}
          <div className="bg-white text-[#00687a] p-8 rounded-2xl shadow-lg">
            <h2 className="text-2xl font-extrabold mb-4 uppercase">
              Review & Approval Flow
            </h2>
            <p className="text-sm leading-relaxed text-justify">
              Managers can review, approve, or adjust employee hours before
              payroll processing. Schedule deviations are clearly highlighted,
              making approvals fast, transparent, and error-free.
            </p>
          </div>

          {/* DOWNLOAD & EMAIL */}
          <div className="bg-white text-[#00687a] p-8 rounded-2xl shadow-lg">
            <h2 className="text-2xl font-extrabold mb-4 uppercase">
              Download & Email Reports
            </h2>
            <p className="text-sm leading-relaxed text-justify">
              Time reports can be downloaded or sent directly via email.
              Export reports for employees, managers, or accounting in a
              clean, structured format ready for payroll and documentation.
            </p>
          </div>

          {/* FILTERING */}
          <div className="bg-white text-[#00687a] p-8 rounded-2xl shadow-lg">
            <h2 className="text-2xl font-extrabold mb-4 uppercase">
              Flexible Filters
            </h2>
            <p className="text-sm leading-relaxed text-justify">
              Filter time reports by employee, date range, day, month, or
              year. Instantly see total worked hours, daily breakdowns, or
              monthly summaries for full control and insight.
            </p>
          </div>

          {/* PAYROLL READY */}
          <div className="bg-white text-[#00687a] p-8 rounded-2xl shadow-lg">
            <h2 className="text-2xl font-extrabold mb-4 uppercase">
              Payroll Ready Data
            </h2>
            <p className="text-sm leading-relaxed text-justify">
              Approved time reports are structured and accurate, making
              payroll processing simple and reliable. Reduce errors, save
              administrative time, and ensure employees are paid correctly.
            </p>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="relative bg-[#02505e] text-center mt-20">
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
            Simplify Time Reporting
          </h2>
          <p className="text-teal-500 mb-8 max-w-xl mx-auto">
            Automate time tracking, approvals, and reporting — all powered by
            real time-log data.
          </p>

          <a
            href="/book-demo"
            className="inline-block bg-[#00687a] text-gray-100 px-8 py-3 rounded-full font-semibold hover:bg-[#037d93] transition shadow-lg"
          >
            Book a Free Demo
          </a>
        </div>
      </section>
    </main>
  );
}
