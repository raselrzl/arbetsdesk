"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function AccountingPage() {
  return (
    <div>
      {/* HERO SECTION */}
      <section className="mt-24 mb-64 w-full">
        <div className="max-w-7xl mx-auto h-full px-4 grid grid-cols-1 md:grid-cols-2 items-center gap-12">

          {/* IMAGE + TEXT */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative flex justify-center md:justify-end"
          >
            {/* IMAGE */}
            <div className="w-full md:w-[620px] relative">
              <Image
                src="/accounting.jpeg" // Replace with your image
                alt="Accounting Dashboard"
                width={900}
                height={600}
                className="w-full h-auto object-contain rounded-2xl shadow-xl"
              />

              {/* MOBILE TEXT – bottom 10% overlap */}
              <div className="md:hidden absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-[90%] w-[90%] bg-white/90 backdrop-blur-md p-5 rounded-2xl shadow-lg text-center z-10">
                <h1 className="text-2xl font-extrabold mb-2 text-[#00687a] uppercase">
                  Accounting Management
                </h1>

                <h2 className="text-base font-semibold mb-2 text-gray-800">
                  Simplify Firm Operations
                </h2>

                <p className="text-gray-700 text-sm leading-relaxed">
                  Track billable hours, manage payroll, and generate reports automatically. 
                  Arbetsdesk reduces manual work so your accounting team can focus on clients.
                </p>
              </div>
            </div>

            {/* DESKTOP FLOATING TEXT */}
            <div className="hidden md:block absolute -bottom-40 right-[-300px] max-w-md bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-lg">
              <h1 className="text-3xl font-extrabold mb-3 text-[#00687a] uppercase">
                Accounting Management
              </h1>

              <h2 className="text-lg font-semibold mb-3 text-gray-800">
                Simplify Firm Operations
              </h2>

              <p className="text-gray-700 text-base leading-relaxed">
                Track billable hours, handle payroll, and generate accurate reports with ease. 
                Arbetsdesk automates time tracking and calculations so your firm can operate efficiently.
              </p>
            </div>
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
            Ready to Streamline Your Accounting Firm?
          </h2>
          <p className="text-teal-400 mb-8 max-w-xl mx-auto">
            See how Arbetsdesk helps accounting firms save time, reduce errors, and manage teams efficiently.
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
