"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function TipsPage() {
  const steps = [
    {
      title: "Daily Tip Registration",
      description:
        "Managers simply enter the total tips collected for each day. Arbetsdesk securely stores this data and prepares it for automatic distribution.",
      image: "/tips/tip3.png",
      alt: "Daily tips input",
    },
    {
      title: "Automatic Distribution by Working Hours",
      description:
        "Tips are calculated and distributed fairly based on employees’ logged working hours. No manual calculations, no bias, and no disputes.",
      image: "/tips/tip1.png",
      alt: "Tips distributed by hours worked",
    },
    {
      title: "Monthly Employee Tip Summary",
      description:
        "At the end of the month, Arbetsdesk generates a clear breakdown of how much each employee earned from tips.",
      image: "/tips/tip4.png",
      alt: "Monthly employee tips overview",
    },
    {
      title: "Approve, Pay or Reject Tips",
      description:
        "Managers can review each employee’s tips individually and mark them as paid or rejected. Every decision is logged with timestamps for accountability.",
    },
    {
      title: "Locked, Auditable Records",
      description:
        "Once finalized, tip distributions are locked and stored securely. Ideal for payroll checks, audits, and long-term transparency.",
    },
  ];

  return (
    <main className="bg-white">
      {/* ================= HERO SECTION ================= */}
      <section className="my-28 w-full">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 items-center gap-14">
          {/* IMAGE */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="flex justify-center md:justify-end"
          >
            <div className="w-[460px]">
              <Image
                src="/tips/t1.jpg"
                alt="Tips distribution dashboard"
                width={900}
                height={600}
                className="w-full h-auto object-contain"
              />
            </div>
          </motion.div>

          {/* TEXT */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <h2 className="text-xl font-semibold text-teal-500">
              Fair. Transparent. Automated.
            </h2>

            <h1 className="text-3xl font-extrabold mb-4 text-[#00687a] uppercase">
              Intelligent Tips Management
            </h1>

            <p className="text-teal-800 text-md leading-relaxed text-justify">
              Arbetsdesk automates tip distribution based on real working hours.
              No spreadsheets, no arguments, and no hidden calculations just
              clear, fair, and accountable tip handling for your business.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ================= STEPS SECTION ================= */}
      <section className="w-full">
        <div className="max-w-7xl mx-auto px-4 grid gap-28">
          {steps.map((step, index) => {
            const isEven = index % 2 !== 0;
            const isTextOnly = index >= 3; // Step 4 & 5

            /* ---------- TEXT ONLY (STEP 4 & 5) ---------- */
            if (isTextOnly) {
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="max-w-4xl mx-auto text-center"
                >
                  <span className="text-sm font-bold uppercase text-teal-500">
                    Step {index + 1}
                  </span>

                  <h3 className="text-xl font-extrabold text-[#00687a] mt-2 mb-4">
                    {step.title}
                  </h3>

                  <p className="text-teal-800 text-md leading-relaxed text-justify">
                    {step.description}
                  </p>
                </motion.div>
              );
            }

            /* ---------- IMAGE + TEXT (STEP 1–3) ---------- */
            return (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-2 items-center gap-14"
              >
                {/* IMAGE */}
                <motion.div
                  initial={{ opacity: 0, x: isEven ? -40 : 40, scale: 0.95 }}
                  whileInView={{ opacity: 1, x: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                  className={`flex justify-center ${
                    isEven ? "md:order-2" : ""
                  }`}
                >
                  <Image
                    src={step.image!}
                    alt={step.alt!}
                    width={900}
                    height={600}
                    className="rounded-xl shadow-lg w-full max-w-[480px] h-auto object-contain"
                  />
                </motion.div>

                {/* TEXT */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="max-w-xl"
                >
                  <span className="text-sm font-bold uppercase text-teal-500">
                    Features {index + 1}
                  </span>

                  <h3 className="text-xl font-extrabold text-[#00687a] mb-4">
                    {step.title}
                  </h3>

                  <p className="text-teal-800 text-sm leading-relaxed text-justify">
                    {step.description}
                  </p>
                </motion.div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ================= CTA SECTION ================= */}
      <section className="relative bg-[#02505e] text-center mt-32">
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
            Ready to Simplify Tips Distribution?
          </h2>

          <p className="text-teal-400 mb-8 max-w-xl mx-auto">
            Automate tips allocation, ensure fairness, and maintain full
            transparency all in one platform.
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
