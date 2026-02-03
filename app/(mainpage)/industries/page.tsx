"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export default function IndustriesPage() {
  return (
    <main className="bg-white">
      <section className="my-24 w-full pb-20">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 items-center gap-12">
          

          {/* RIGHT – VIDEO + FLOATING TEXT */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative flex justify-center md:justify-end"
          >
            {/* VIDEO */}
            <div className="w-full md:w-[620px] relative">
              <video
                src="/vedio1.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-auto object-contain rounded-2xl shadow-xl"
              />

              {/* MOBILE TEXT – bottom 10% overlap */}
              <div className="md:hidden absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-[90%] w-[90%] bg-white/90 backdrop-blur-md p-5 rounded-2xl shadow-lg text-center z-10">
                <h1 className="text-2xl font-extrabold mb-2 text-[#00687a] uppercase">
                  Built for Every Industry
                </h1>
                <h2 className="text-base font-semibold mb-2 text-gray-800">
                  One Platform. Endless Possibilities.
                </h2>
                <p className="text-gray-700 text-sm leading-relaxed">
                  Arbetsdesk adapts to businesses across industries. From
                  scheduling and time tracking to payroll and analytics, our
                  platform gives you full control over operations.
                </p>
              </div>
            </div>

            {/* DESKTOP FLOATING TEXT */}
            <div className="hidden md:block absolute -bottom-40 right-[-300px] max-w-md bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-lg">
              <h1 className="text-3xl font-extrabold mb-3 text-[#00687a] uppercase">
                Built for Every Industry
              </h1>
              <h2 className="text-lg font-semibold mb-3 text-gray-800">
                One Platform. Endless Possibilities.
              </h2>
              <p className="text-gray-700 text-base leading-relaxed">
                Arbetsdesk adapts to businesses across industries. From
                scheduling and time tracking to payroll and analytics, our
                platform gives you full control over operations.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* INDUSTRY CARDS */}
      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: "Hotels",
              desc: "Manage shifts, night work, overtime, and payroll across departments with complete visibility.",
              link: "/industries/hotel",
            },
            {
              title: "Restaurants",
              desc: "Track employee hours, tips, sales performance, and labor costs in real time.",
              link: "/industries/restaurant",
            },
            {
              title: "Fast Food & Cafés",
              desc: "Built for fast-paced environments with flexible schedules and rapid payroll cycles.",
              link: "/industries/fastfood-cafe",
            },
            {
              title: "Retail Stores",
              desc: "Plan staffing based on traffic, manage part-time teams, and balance sales against labor costs.",
              link: "/industries/retail",
            },
            {
              title: "Accounting Firms",
              desc: "Monitor billable hours, employee productivity, and generate precise financial reports.",
              link: "/industries/accounting",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition flex flex-col"
            >
              <h3 className="text-xl font-bold text-[#00687a] mb-3">
                {item.title}
              </h3>
              <p className="text-gray-600 grow">{item.desc}</p>

              <Link
                href={item.link}
                className="mt-6 text-teal-600 font-semibold hover:underline"
              >
                Learn more →
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* WHY IT WORKS */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-3xl font-bold text-[#00687a] mb-6">
              One System That Fits Every Business
            </h2>
            <ul className="space-y-4 text-gray-700">
              <li>✔ Smart employee scheduling & shift planning</li>
              <li>✔ Automated payroll and payslip generation</li>
              <li>✔ Accurate time tracking & attendance control</li>
              <li>✔ Sales, cost, and profit insights</li>
              <li>✔ Secure employee and admin access</li>
            </ul>
          </div>

          <div className="bg-[#00687a] text-white rounded-2xl p-8 shadow-xl">
            <h3 className="text-2xl font-bold mb-4">
              Designed to Grow With You
            </h3>
            <p className="opacity-90">
              Whether you manage a small team or a multi-location operation,
              Arbetsdesk scales with your business—keeping everything automated,
              accurate, and easy to manage.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative bg-[#02505e] text-center">
        <div className="relative z-10 py-20 px-4">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-100 mb-4 uppercase">
            Find Your Industry Solution
          </h2>
          <p className="text-teal-400 mb-8 max-w-xl mx-auto">
            Discover how Arbetsdesk can simplify daily operations across your
            industry.
          </p>

          <Link
            href="/book-demo"
            className="inline-block bg-[#00687a] text-gray-100 px-8 py-3 rounded-full font-semibold hover:bg-[#037d93] transition shadow-lg"
          >
            Book a Free Demo
          </Link>
        </div>
      </section>
    </main>
  );
}
