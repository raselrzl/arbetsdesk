"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function AnalyticsPage() {
  return (
    <main className="bg-white">
      {/* HERO SECTION */}
      <section className="max-w-7xl mx-auto px-4 py-24 flex flex-col items-center gap-12">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex-2 text-left"
        >
          <h1 className="text-3xl font-extrabold mb-6 text-[#00687a] uppercase">
            Business Analytics
          </h1>
          <h2 className="text-xl font-semibold mb-6 text-[#00687a]">
            Understand Your Business in Real Time
          </h2>
          <p className="text-[#00687a] text-sm md:text-lg max-w-3xl leading-relaxed text-justify">
            Arbetsdesk analytics gives you full visibility into your business.
            Track employee working hours, labor costs, VAT, purchases, and
            operational expenses across daily, monthly, and yearly periods.
            Everything is connected, automated, and easy to understand so you
            can plan smarter and grow faster.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex-2 flex justify-center md:justify-end"
        >
          <div className="w-[360px] md:w-[450px] bg-white rounded-xl relative">
            {/* Placeholder image – replace later */}
            <Image
              src="/analysis/a1.gif"
              alt="Analytics overview"
              width={550}
              height={350}
              className="object-contain"
            />
          </div>
        </motion.div>
      </section>

      {/* FEATURE CARDS */}
      <section className="w-full px-4">
        <div className="max-w-3xl mx-auto grid gap-8 md:grid-cols-1 mb-30">
          <div className="bg-white text-[#00687a] p-8 rounded-2xl shadow-lg">
            <h2 className="text-2xl font-extrabold mb-4 uppercase">
              Employee & Working Hour Analysis
            </h2>
            <p className="text-sm leading-relaxed text-justify">
              Analyze employee working hours and labor costs in detail. View
              daily, monthly, or yearly summaries per employee, department,
              or cost center. Compare scheduled hours versus actual worked
              hours and instantly see how staffing decisions affect your
              total costs.
            </p>
          </div>

          <div className="bg-white text-[#00687a] p-8 rounded-2xl shadow-lg">
            <h2 className="text-2xl font-extrabold mb-4 uppercase">
              VAT & Financial Overview
            </h2>
            <p className="text-sm leading-relaxed text-justify">
              Track VAT on sales and purchases automatically. See VAT collected,
              VAT paid, and net VAT balances over time. Perfect for both daily
              monitoring and long-term financial planning, making accounting
              and reporting easier and more reliable.
            </p>
          </div>

          <div className="bg-white text-[#00687a] p-8 rounded-2xl shadow-lg">
            <h2 className="text-2xl font-extrabold mb-4 uppercase">
              Cost Structure & Expenses
            </h2>
            <p className="text-sm leading-relaxed text-justify">
              Get a complete breakdown of your business costs including raw
              material costs, supplier invoices, employee costs, payroll,
              fixed costs like rent, and variable operational expenses.
              Understand exactly where your money goes.
            </p>
          </div>
        </div>
      </section>

      {/* ANALYTICS VISUAL SECTION 1 */}
      <section className="mt-20 mb-20 w-full">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 items-center">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative flex justify-center md:justify-end"
          >
            <div className="w-auto h-[350px] relative">
              <img
                src="/analysis/an1.png"
                alt="Cost analysis"
                className="w-auto h-[350px] object-contain shadow-xl shadow-teal-900"
              />

              {/* Mobile overlay */}
              <div className="md:hidden absolute bottom-20 left-1/2 -translate-x-1/2 translate-y-[90%] w-[90%] bg-white/90 backdrop-blur-md p-5 rounded-2xl shadow-lg text-center z-10">
                <h1 className="text-xl font-extrabold mb-2 text-[#00687a] uppercase">
                  Cost Analysis
                </h1>
                <h2 className="text-base font-semibold mb-2 text-[#00687a]">
                  Know Every Cost in Your Business
                </h2>
                <p className="text-[#00687a] text-sm leading-relaxed text-justify">
                  Analyze raw materials, employee costs, fixed costs, and
                  operational expenses in one place. Compare periods and
                  identify cost drivers instantly.
                </p>
              </div>
            </div>

            {/* Desktop overlay */}
            <div className="hidden md:block absolute top-20 right-[-380px] max-w-xl bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-lg">
              <h1 className="text-3xl font-extrabold mb-3 text-[#00687a] uppercase">
                Cost Analysis
              </h1>
              <h2 className="text-lg font-semibold mb-3 text-[#00687a]">
                Know Every Cost in Your Business
              </h2>
              <p className="text-[#00687a] text-sm leading-relaxed text-justify">
                Track and analyze all costs including materials, payroll,
                fixed expenses, and operational costs. Make data-driven
                decisions to improve profitability and control spending.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ANALYTICS VISUAL SECTION 2 */}
      <section className="mb-30 w-full pb-20">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 items-center">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative flex justify-center md:justify-end"
          >
            <div className="w-auto h-[350px] relative">
              <img
                src="/analysis/pur.png"
                alt="Item analysis"
                className="w-auto h-[350px] object-contain"
              />

              <div className="md:hidden absolute bottom-20 left-1/2 -translate-x-1/2 translate-y-[90%] w-[90%] bg-white/90 backdrop-blur-md p-5 rounded-2xl shadow-lg text-center z-10">
                <h1 className="text-xl font-extrabold mb-2 text-[#00687a] uppercase">
                  Item Analysis
                </h1>
                <h2 className="text-base font-semibold mb-2 text-[#00687a]">
                  Analyze Every Purchase
                </h2>
                <p className="text-[#00687a] text-sm leading-relaxed text-justify">
                  Track each item you buy, including quantity, price, VAT,
                  supplier, and trends over time to optimize purchasing
                  decisions.
                </p>
              </div>
            </div>

            <div className="hidden md:block absolute top-20 right-[-380px] max-w-xl bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-lg">
              <h1 className="text-3xl font-extrabold mb-3 text-[#00687a] uppercase">
                Item & Purchase Analysis
              </h1>
              <h2 className="text-base font-semibold mb-2 text-[#00687a]">
                Every Item. Every Cost. Fully Analyzed.
              </h2>
              <p className="text-[#00687a] text-sm leading-relaxed text-justify">
                Understand exactly what you buy and how it impacts your profit.
                Compare suppliers, track price changes, and reduce unnecessary
                spending with detailed item-level analytics.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
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
            Make Smarter Business Decisions
          </h2>
          <p className="text-teal-500 mb-8 max-w-xl mx-auto">
            Use real data to plan better, control costs, and grow your business
            with confidence.
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
