"use client";

import Link from "next/link";
import Image from "next/image";
import {
  CheckCircle2,
  Clock,
  Calendar,
  BarChart3,
  Users,
  Wallet,
} from "lucide-react";
import { FeaturesSection } from "../components/FearuresSection";

const features = [
  {
    title: "Time Clock",
    desc: "Track work hours accurately in real time.",
    icon: Clock,
    href: "/features/time-clock",
    image: "/ht1.png",
  },
  {
    title: "Scheduling",
    desc: "Plan shifts and avoid conflicts easily.",
    icon: Calendar,
    href: "/features/schedule",
    image: "/ht2.png",
  },
  {
    title: "Payroll",
    desc: "Automated salary calculations and payouts.",
    icon: Wallet,
    href: "/features/payroll",
    image: "/h21.png",
  },
  {
    title: "Analytics",
    desc: "Understand performance with smart insights.",
    icon: BarChart3,
    href: "/features/analytics",
    image: "/features/analytics.png",
  },
  {
    title: "Staff Management",
    desc: "Manage employees from one dashboard.",
    icon: Users,
    href: "/features/staff",
    image: "/features/staff.png",
  },
];

const roles = [
  {
    title: "Companies",
    text: "Manage staff, payroll, invoices, and analytics.",
  },
  {
    title: "Employees",
    text: "Clock in, view shifts, and track working hours.",
  },
];

export default function HomePage() {
  return (
    <main className="bg-[linear-gradient(to_bottom,#f9fafb,#ffffff)]">
      {/* ================= HERO ================= */}
      <section className="max-w-7xl mx-auto px-6 pt-14 pb-10 flex flex-col lg:flex-row items-center gap-12">
        <div className="lg:w-1/2">
          <span className="inline-block mb-4 rounded-full bg-teal-100 px-4 py-1 text-sm font-medium text-teal-700">
            Workforce Management Platform
          </span>

          <h1 className="text-4xl md:text-5xl font-extrabold text-teal-900 mb-6">
            Manage your workforce <br />
            <span className="text-teal-600">smarter & faster</span>
          </h1>

          <p className="text-gray-600 text-lg mb-8 max-w-xl">
            Arbets-desk helps companies track time, manage schedules, payroll,
            and staff — all from one powerful platform.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              href="/register"
              className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg font-medium transition"
            >
              Get Started Free
            </Link>
            <Link
              href="/features"
              className="border border-gray-300 hover:border-teal-600 px-6 py-3 rounded-lg font-medium text-gray-700 hover:text-teal-600 transition"
            >
              View Features
            </Link>
          </div>
        </div>

        <div className="lg:w-1/2 relative h-96 flex items-center justify-center">
          <Image
            src="/h11.png"
            alt="Arbets-desk dashboard preview"
            width={500}
            height={350}
            priority
            className="object-contain"
          />
        </div>
      </section>

      <FeaturesSection />

      {/* ---------- VIDEO SECTION ---------- */}
      <section className="max-w-7xl mx-auto mt-6 mb-20 px-6">
        <div className="bg-white shadow-sm rounded-lg p-6 border-l-4 border-teal-500">
         <h1 className="text-4xl md:text-5xl font-extrabold text-teal-900 mb-6">
            See how Arbets-desk works
          </h1>

          <p className="text-gray-600 mb-6 max-w-2xl">
            A quick overview of how companies and employees use Arbets-desk to
            track time, manage schedules, and simplify payroll.
          </p>

          <div className="overflow-hidden rounded-lg border border-gray-200">
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

      {/* ================= FOOTER ================= */}
      <footer className="py-4 text-center text-gray-600">
        <p>
          © {new Date().getFullYear()} Arbets-desk — Workforce management made
          simple.
        </p>
      </footer>
    </main>
  );
}
