"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function TipsPage() {
  const steps = [
    {
      title: "Daily Tip Registration",
      description:
        "Managers enter the total tips collected each day. Arbetsdesk securely stores the data and prepares it for fair distribution.",
      image: "/tips/tip3.png",
    },
    {
      title: "Automatic Distribution by Working Hours",
      description:
        "Tips are calculated automatically based on logged working hours. No manual math, no bias, no disputes.",
      image: "/tips/tip1.png",
    },
    {
      title: "Monthly Employee Tip Summary",
      description:
        "Each employee receives a clear monthly overview showing exactly how much they earned from tips.",
      image: "/tips/tip4.png",
    },
    {
      title: "Approve, Pay or Reject Tips",
      description:
        "Managers can approve, pay, or reject tips per employee. Every action is logged with full traceability.",
    },
    {
      title: "Locked & Auditable Records",
      description:
        "Once finalized, tip records are locked and preserved. Perfect for payroll verification, audits, and compliance.",
    },
  ];

  return (
    <main className="bg-white">
      {/* ================= HERO ================= */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-sm font-semibold uppercase tracking-wide text-teal-500">
              Tips Management
            </h2>

            <h1 className="mt-3 text-4xl font-extrabold text-[#00687a] uppercase">
              Fair Tips, Zero Effort
            </h1>

            <p className="mt-6 text-teal-800 text-lg leading-relaxed">
              Arbetsdesk automates tip distribution using real working hours.
              Everything is transparent, auditable, and designed to protect
              both managers and employees.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="flex justify-center"
          >
            <Image
              src="/tips/t1.jpg"
              alt="Tips dashboard"
              width={900}
              height={600}
              className="w-[460px] object-contain"
            />
          </motion.div>
        </div>
      </section>

      {/* ================= TIMELINE ================= */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4">
          <div className="relative border-l-2 border-teal-200 pl-10 space-y-24">
            {steps.map((step, index) => {
              const isTextOnly = index >= 3;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="relative"
                >
                  {/* DOT */}
                  <span className="absolute -left-[13px] top-1 w-6 h-6 rounded-full bg-[#00687a] border-4 border-white shadow" />

                  <span className="text-xs font-bold uppercase text-teal-500 ml-4">
                    Features {index + 1}
                  </span>

                  <h3 className="mt-2 text-2xl font-extrabold text-[#00687a]">
                    {step.title}
                  </h3>

                  <p className="mt-3 text-teal-800 leading-relaxed">
                    {step.description}
                  </p>

                  {/* IMAGE (ONLY STEP 1–3) */}
                  {!isTextOnly && (
                    <div className="mt-6">
                      <Image
                        src={step.image!}
                        alt={step.title}
                        width={900}
                        height={600}
                        className="rounded-xl shadow-md w-[320px]"
                      />
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= TRUST BLOCK ================= */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h3 className="text-3xl font-extrabold text-[#00687a]">
            Built for Trust  Compliance
          </h3>

          <p className="mt-4 text-teal-800 text-lg leading-relaxed">
            Every tip decision is logged. Every distribution is locked.
            Arbetsdesk ensures full transparency between management,
            employees, and payroll.
          </p>
        </div>
      </section>

      {/* ================= CTA ================= */}
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
          <h2 className="text-4xl font-extrabold text-white uppercase">
            Ready to Automate Tips?
          </h2>

          <p className="mt-4 text-teal-300 max-w-xl mx-auto">
            Fair payouts, zero disputes, full transparency all in one system.
          </p>

          <a
            href="/book-demo"
            className="inline-block mt-8 bg-[#00687a] text-white px-10 py-4 rounded-full font-semibold hover:bg-[#037d93] transition shadow-lg"
          >
            Book a Free Demo
          </a>
        </div>
      </section>
    </main>
  );
}
