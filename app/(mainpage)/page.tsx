"use client";

import Link from "next/link";
import Image from "next/image";
import { FeaturesSection } from "../components/FearuresSection";
import BookDemoButton from "../components/BookDemoButton";
import { TailoredSolutionsSection } from "../components/TailoredSolutionsSection";
import { TrustBenefitsSection } from "../components/TrustBenefitsSection";

export default function HomePage() {
  return (
    <main className=" bg-white ">
      <section className="max-w-7xl mx-auto sm:pt-10 2xl:py-20 grid lg:grid-cols-2 gap-1 md:gap-10 items-center">
        {/* Left */}
        <div
          className="
     py-10 px-4
    bg-[url('/img5.png')] bg-cover bg-center bg-no-repeat
    sm:bg-none
  "
        >
          <h1 className="text-3xl mt-10 sm:mt-20 font-extrabold text-[#00687a] leading-snug mb-6 uppercase text-right sm:text-center">
            Manage your workforce <br />
            <span className="text-teal-600">
              smarter and <br className="block sm:hidden" />
              faster
            </span>
          </h1>

          <p className="text-teal-900 text-base sm:text-lg max-w-xl font-semibold mb-8 text-right mt-5 sm:text-center mx-auto">
            Arbets-desk helps companies track time, manage schedules, payroll,
            and employees all from one powerful, easy-to-use platform.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <Link
              href="/book-demo"
              className="bg-[#00687a] hover:bg-teal-800 text-white px-6 w-48 py-2 sm:py-3 text-center rounded-full font-semibold shadow-md transition"
            >
              Get Started Free
            </Link>

            <Link
              href="/features"
              className="border border-teal-300 hover:border-teal-100 px-6 py-2 text-center sm:py-3 w-48  rounded-full font-semibold text-gray-700 hover:text-teal-600 transition"
            >
              View Features
            </Link>
          </div>
        </div>

        {/* Right */}
        <div className="relative flex justify-center mt-20 pb-6 px-3">
          <div className="flex justify-center relative">
            <div className="relative w-full max-w-md">
              <div className="absolute -bottom-10 -right-10 w-48 h-48 opacity-40 pointer-events-none">
                <img
                  src="/analytics.gif"
                  alt="Analytics animation"
                  className="w-full h-full object-contain"
                />
              </div>
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
                    <span className="text-sm text-[#00687a] text-center">
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
                    <span className="text-sm text-[#00687a] text-center">
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
                    <span className="text-sm text-[#00687a] text-center">
                      Reports & Insights
                    </span>
                  </div>
                </div>

                <p className="text-center text-teal-500">
                  Simplify expense tracking, categorize spending easily, and get
                  instant insights for smarter business decisions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <TrustBenefitsSection />

      <FeaturesSection />

      <section
        className="w-full mx-auto bg-cover bg-center bg-no-repeat py-10"
        style={{ backgroundImage: "url('/img2.png')" }}
      >
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex justify-center relative">
            <div className="relative w-full">
              {/* Card */}
              <div className="relative  bg-[#00687a] rounded-2xl shadow-2xl shadow-[#00687a] space-y-6">
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
        </div>
      </section>

      <TailoredSolutionsSection />
      <BookDemoButton />
    </main>
  );
}
