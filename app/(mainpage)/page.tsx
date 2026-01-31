"use client";

import Link from "next/link";
import Image from "next/image";
import { FeaturesSection } from "../components/FearuresSection";
import BookDemoButton from "../components/BookDemoButton";
import { TailoredSolutionsSection } from "../components/TailoredSolutionsSection";
import { TrustBenefitsSection } from "../components/TrustBenefitsSection";

export default function HomePage() {
  return (
    <main className="bg-linear-to-b from-slate-50 to-white">
      {/* ================= HERO ================= */}
      <section className="max-w-7xl mx-auto px-6 py-16 grid lg:grid-cols-2 gap-1 md:gap-10 items-center">
        {/* Left */}
        <div>
          {/*  <span className="inline-flex items-center shadow shadow-teal-200 uppercase rounded-full bg-teal-100 px-4 py-1 text-sm font-semibold text-teal-700 mb-5">
            Workforce Management Platform
          </span> */}

          <h1 className="text-3xl mt-20 font-extrabold text-teal-900 leading-snug mb-6 uppercase text-center">
            Manage your workforce <br />
            <span className="text-teal-600">smarter and faster</span>
          </h1>

          <p className="text-gray-600 text-base sm:text-lg max-w-xl mb-8 text-center">
            Arbets-desk helps companies track time, manage schedules, payroll,
            and employees all from one powerful, easy-to-use platform.
          </p>

          <div className="flex flex-wrap gap-4 items-center justify-center">
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
        <div className="relative flex justify-center mt-20 pb-6">
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
      <TrustBenefitsSection />

      {/* ================= FEATURES ================= */}
      <FeaturesSection />

      {/* ================= VIDEO ================= */}
      {/*   <section className="py-10">
        <div className="max-w-7xl mx-auto px-2">
          <div className="overflow-hidden bg-white">
            <video
              src="/restu1.mp4"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              controls
              className="w-full h-[500px]"
            />
          </div>
        </div>
      </section> */}

      {/* ================= COMPANY EXPENSES MARKETING ================= */}
      <section
  className="max-w-4xl mx-auto px-4 bg-cover bg-center bg-no-repeat py-10 rounded-2xl"
  style={{ backgroundImage: "url('/img.png')" }}
>
  <div className="flex justify-center relative">
    <div className="relative w-full">
      {/* Card */}
      <div className="relative p-8 bg-white rounded-2xl shadow-2xl border border-teal-200 space-y-6">
        <div className="relative overflow-hidden bg-white rounded-xl">
          
          {/* TEXT OVERLAY */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-widest text-white drop-shadow-lg">
              ARBERDESK
            </h2>
          </div>

          {/* Video */}
          <video
            src="/restu1.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            controls
            className="w-full h-[500px] object-cover"
          />
        </div>
      </div>
    </div>
  </div>
</section>

      <TailoredSolutionsSection />
      <BookDemoButton />
    </main>
  );
}
