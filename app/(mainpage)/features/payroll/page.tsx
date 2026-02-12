"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function PayrollPage() {
  return (
    <div className="bg-white">
      {/* HERO SECTION */}
      <section className="my-24 w-full">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 items-center gap-12">
          
          {/* IMAGE */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex justify-center md:justify-end"
          >
            <div className="w-[460px]">
              <Image
                src="/payroll/p1.gif"   // change to real screenshot
                alt="Payroll dashboard"
                width={900}
                height={600}
                className="w-full h-auto object-contain"
              />
            </div>
          </motion.div>

          {/* TEXT */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl text-left"
          >
            <h1 className="text-2xl font-extrabold mb-4 text-[#00687a] uppercase">
              Smart Payroll Management
            </h1>

            <h2 className="text-lg font-semibold mb-4 text-[#00687a]">
              From Time Logs to Payment Fully Automated
            </h2>

            <p className="text-[#00687a] text-md leading-relaxed">
              Arbetsdesk transforms approved work hours into accurate salaries automatically.
              Review employee payroll, update status in real time, and generate professional
              payslips with just one click. No spreadsheets, no manual calculations, and no errors.
            </p>
          </motion.div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="w-full px-4">
        <div className="max-w-3xl mx-auto grid gap-8 mb-28">
          
          {/* Feature 1 */}
          <div className="bg-white text-[#00687a] p-8 rounded-2xl shadow-lg">
            <h2 className="text-xl font-extrabold mb-4 uppercase">
              Automatic Salary Calculation
            </h2>
            <p className="text-sm leading-relaxed text-justify">
              Payroll is generated directly from approved time logs. Working hours,
              overtime, and absences are calculated automatically, ensuring accurate
              salaries without manual work.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white text-[#00687a] p-8 rounded-2xl shadow-lg">
            <h2 className="text-xl font-extrabold mb-4 uppercase">
              Live Status Updates
            </h2>
            <p className="text-sm leading-relaxed text-justify">
              Control payroll with real-time status management. Update salaries instantly
              between Draft, Pending, Approved, Paid, or Rejected. Changes are saved
              immediately and reflected across the system.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white text-[#00687a] p-8 rounded-2xl shadow-lg">
            <h2 className="text-xl font-extrabold mb-4 uppercase">
              Manager Approval Workflow
            </h2>
            <p className="text-sm leading-relaxed text-justify">
              Managers can review and approve payroll before payment. The structured workflow
              reduces errors and ensures full control before salaries are finalized.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-white text-[#00687a] p-8 rounded-2xl shadow-lg">
            <h2 className="text-xl font-extrabold mb-4 uppercase">
              Instant Payslips & Email Delivery
            </h2>
            <p className="text-sm leading-relaxed text-justify">
              Generate professional payslips with one click and send them directly to employees
              via email. No paperwork, no manual distribution.
            </p>
          </div>
        </div>
      </section>

      {/* WORKFLOW IMAGE SECTION (optional visual like TimeLog) */}
      <section className="mt-16 mb-24 w-full">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 items-center">
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex justify-center md:justify-end"
          >
            <div className="w-[420px]">
              <Image
                src="/payroll/p1.png"   // screenshot of status dropdown table
                alt="Payroll status management"
                width={800}
                height={600}
                className="w-full h-auto object-contain shadow-xl"
              />
            </div>
          </motion.div>

          <div className="max-w-xl">
            <h1 className="text-xl font-extrabold mb-3 text-[#00687a] uppercase">
              Full Payroll Control
            </h1>
            <h2 className="text-lg font-semibold mb-3 text-gray-800">
              Review, Approve and Mark as Paid
            </h2>
            <p className="text-gray-700 text-sm leading-relaxed">
              Easily manage the entire payroll process in one place. Review employee
              salaries, update status with color-coded indicators, and track payment
              progress from draft to completed.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative bg-[#02505e] text-center">
        <svg
          className="absolute -top-px left-0 w-full h-32"
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
            Ready to Streamline Payroll?
          </h2>
          <p className="text-teal-400 mb-8 max-w-xl mx-auto">
            Automate calculations, approvals, and payments with Arbetsdesk —
            simple, accurate, and reliable payroll management.
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
