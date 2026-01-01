"use client";

import Link from "next/link";
import Image from "next/image";
import { FeaturesSection } from "../components/FearuresSection";

export default function HomePage() {
  return (
    <main className="bg-linear-to-b from-slate-50 to-white">
      {/* ================= HERO ================= */}
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-16 grid lg:grid-cols-2 gap-14 items-center">
        {/* Left */}
        <div>
          <span className="inline-flex items-center rounded-full bg-teal-100 px-4 py-1 text-sm font-semibold text-teal-700 mb-5">
            Workforce Management Platform
          </span>

          <h1 className="text-4xl md:text-5xl xl:text-6xl font-extrabold text-teal-900 leading-tight mb-6">
            Manage your workforce
            <br />
            <span className="text-teal-600">smarter & faster</span>
          </h1>

          <p className="text-gray-600 text-lg max-w-xl mb-8">
            Arbets-desk helps companies track time, manage schedules, payroll,
            and employees — all from one powerful, easy-to-use platform.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              href="/book-demo"
              className="bg-teal-900 hover:bg-teal-700 text-white px-7 py-3 rounded-3xl font-semibold transition shadow-md"
            >
              Get Started Free
            </Link>

            <Link
              href="/features"
              className="border border-teal-300 hover:border-teal-100 px-7 py-3 rounded-3xl font-semibold text-gray-700 hover:text-teal-600 transition"
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
            className="object-contain drop-shadow-xl"
          />
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <FeaturesSection />

      {/* ================= VIDEO ================= */}
      <section className="py-20 bg-teal-50 border-t">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-2xl md:text-4xl font-extrabold text-teal-900 mb-8">
            See how Arbets-desk works in practice
          </h2>

          <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm bg-white">
            <video
              src="/vedio.mp4"
              controls
              playsInline
              preload="metadata"
              className="w-full h-auto"
            />
          </div>
        </div>
      </section>
    </main>
  );
}
