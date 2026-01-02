"use client";

import Link from "next/link";
import Image from "next/image";
import { FeaturesSection } from "../components/FearuresSection";

export default function HomePage() {
  return (
    <main className="bg-linear-to-b from-slate-50 to-white">
      {/* ================= HERO ================= */}
      <section className="max-w-7xl mx-auto px-6 pt-10 pb-6 grid lg:grid-cols-2 gap-1 md:gap-10 items-center">
        {/* Left */}
        <div>
          <span className="inline-flex items-center rounded-full bg-teal-100 px-4 py-1 text-sm font-semibold text-teal-700 mb-5">
            Workforce Management Platform
          </span>

          <h1 className="text-3xl sm:text-4xl uppercase md:text-5xl lg:text-6xl font-extrabold text-teal-900 leading-snug mb-6">
            Manage your workforce <br />
            <span className="text-teal-600">smarter & faster</span>
          </h1>

          <p className="text-gray-600 text-base sm:text-lg max-w-xl mb-8">
            Arbets-desk helps companies track time, manage schedules, payroll,
            and employees — all from one powerful, easy-to-use platform.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              href="/book-demo"
              className="bg-teal-900 hover:bg-teal-700 text-white px-6 py-3 rounded-full font-semibold shadow-md transition"
            >
              Get Started Free
            </Link>

            <Link
              href="/features"
              className="border border-teal-300 hover:border-teal-100 px-6 py-3 rounded-full font-semibold text-gray-700 hover:text-teal-600 transition"
            >
              View Features
            </Link>
          </div>
        </div>

        {/* Right */}
        <div className="relative flex justify-center">
          <Image
            src="/h11.png"
            alt="Arbets-desk dashboard preview"
            width={560}
            height={380}
            priority
            className="object-contain drop-shadow-xl max-w-full h-auto"
          />
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <FeaturesSection />

      {/* ================= VIDEO ================= */}
      <section className="py-10 bg-teal-50 border-t border-teal-100">
        <div className="max-w-6xl mx-auto px-6">
          <h2   className="mb-12 text-center text-2xl md:text-4xl font-extrabold uppercase text-teal-900"
        >
            See how Arbets-desk works in practice
          </h2>

          <div className="rounded-xl overflow-hidden border border-teal-200 shadow-md bg-white">
            <video
              src="/vedio.mp4"
              controls
              playsInline
              preload="metadata"
              className="w-full h-auto rounded-xl"
            />
          </div>
        </div>
      </section>

      {/* ================= COMPANY EXPENSES MARKETING ================= */}
      <section className="py-24 bg-white border-t mb-20 border-teal-100">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Text */}
          <div className="space-y-6">
            <h2 className="text-2xl md:text-4xl font-extrabold text-teal-900 leading-tight uppercase">
              Track & manage <br />
              <span className="text-teal-600">
                company expenses effortlessly
              </span>
            </h2>

            <p className="text-gray-600 text-lg max-w-lg">
              Keep all your business expenses organized in one place. Quickly
              monitor spending by category, stay on top of budgets, and gain
              insights to make smarter financial decisions.
            </p>

            <Link
              href="/features/costoptimization"
              className="border border-teal-300 hover:border-teal-100 px-7 py-3 rounded-3xl font-semibold text-gray-700 hover:text-teal-600 transition"
            >
              Learn More
            </Link>
          </div>

          <div className="flex justify-center relative">
            <div className="relative w-full max-w-md">
              {/* Background Circles */}
              <div className="absolute -top-10 -left-10 w-48 h-48 bg-teal-100 rounded-full opacity-40"></div>
              <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-teal-300 rounded-full opacity-30"></div>

              {/* Card */}
              <div className="relative p-8 bg-white rounded-2xl shadow-2xl border border-teal-200 space-y-6">
                <div className="flex justify-around">
                  {/* Card Item */}
                  <div className="flex flex-col items-center gap-2 hover:scale-110 transition-transform duration-300">
                    <div className="w-12 h-12 relative">
                      <Image
                        src="/icons/16.png"
                        alt="Daily Expenses"
                        fill
                        className="object-contain"
                      />
                    </div>
                    <span className="text-sm text-gray-600 text-center">
                      Daily Expenses
                    </span>
                  </div>

                  <div className="flex flex-col items-center gap-2 hover:scale-110 transition-transform duration-300">
                    <div className="w-12 h-12 relative">
                      <Image
                        src="/icons/14.png"
                        alt="Budget Overview"
                        fill
                        className="object-contain"
                      />
                    </div>
                    <span className="text-sm text-gray-600 text-center">
                      Budget Overview
                    </span>
                  </div>

                  <div className="flex flex-col items-center gap-2 hover:scale-110 transition-transform duration-300">
                    <div className="w-12 h-12 relative">
                      <Image
                        src="/icons/15.png"
                        alt="Reports & Insights"
                        fill
                        className="object-contain"
                      />
                    </div>
                    <span className="text-sm text-gray-600 text-center">
                      Reports & Insights
                    </span>
                  </div>
                </div>

                <p className="text-center text-gray-500">
                  Simplify expense tracking, categorize spending easily, and get
                  instant insights for smarter business decisions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
