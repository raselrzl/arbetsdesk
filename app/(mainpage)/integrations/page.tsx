"use client";

import Image from "next/image";
import Link from "next/link";

export default function Integrations() {
  return (
    <main className="bg-white">
      {/* HERO SECTION */}
      <section className="mt-24 mb-10 w-full">
        <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">

          {/* LEFT – TEXT */}
          <div className="text-left">
            <h1 className="text-3xl uppercase font-extrabold text-[#00687a] mb-4 leading-snug">
              Powerful Integrations
            </h1>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              One Connected Platform
            </h2>
            <p className="text-gray-700 text-lg mb-6 leading-relaxed">
              Arbets-desk connects seamlessly with your existing tools to automate payroll, scheduling, time tracking, and business analytics — all in one place.
            </p>

            <Link
              href="/book-demo"
              className="inline-block bg-[#00687a] hover:bg-teal-800 text-white px-8 py-3 rounded-full font-semibold shadow transition"
            >
              Request a Demo
            </Link>
          </div>

          {/* RIGHT – IMAGE */}
          <div className="relative w-full h-60">
            <Image
              src="/time/time2.gif"
              alt="Integrations illustration"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
      </section>

      {/* INTEGRATION TYPES */}
      <section className=" py-10">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl uppercase font-bold text-center text-[#00687a] mb-12">
            Works With Your Favorite Tools
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Payroll Systems",
                desc: "Automatically sync worked hours, salaries, overtime, and tips with your payroll provider.",
              },
              {
                title: "Accounting Software",
                desc: "Export sales, labor costs, and profit reports directly to accounting tools.",
              },
              {
                title: "POS Systems",
                desc: "Connect sales data with employee shifts to get real-time labor cost insights.",
              },
              {
                title: "HR & Contracts",
                desc: "Manage employee contracts, documents, and compliance in one secure place.",
              },
              {
                title: "Mobile Apps",
                desc: "Employees can check schedules, salaries, and shifts directly from their phones.",
              },
              {
                title: "Analytics Tools",
                desc: "Advanced reports on productivity, costs, profit, and performance.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition"
              >
                <h3 className="text-xl font-bold text-[#00687a] mb-3">{item.title}</h3>
                <p className="text-gray-700 text-base">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY IT MATTERS */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#00687a] mb-6">
              Why Integrations Matter
            </h2>
            <ul className="space-y-4 text-gray-700 text-lg">
              <li>✅ Reduce manual work and human errors</li>
              <li>✅ Save time with automatic data syncing</li>
              <li>✅ Get accurate salary, shift, and cost calculations</li>
              <li>✅ Make smarter business decisions with real-time data</li>
            </ul>
          </div>

          <div className="bg-[#00687a] rounded-2xl p-8 text-white shadow-xl">
            <h3 className="text-2xl font-bold mb-4">Built for Growing Businesses</h3>
            <p className="text-lg opacity-90">
              Whether you run a hotel, restaurant, café, retail store, or accounting firm — Arbets-desk adapts to your workflow and scales with your business.
            </p>
          </div>
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
            Ready to Connect Your Tools?
          </h2>
          <p className="text-teal-400 mb-8 max-w-xl mx-auto text-lg">
            See how Arbetsdesk integrations streamline your workflows and save time for your team.
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
