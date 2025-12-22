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

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
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

    <section className="max-w-6xl mx-auto px-6 py-24 space-y-24">
  {features.map(({ title, desc, icon: Icon, image, href }, idx) => (
    <div
      key={title}
      className={`flex flex-col md:flex-row items-center gap-8 ${
        idx % 2 !== 0 ? "md:flex-row-reverse" : ""
      }`}
    >
      {/* LEFT: Icon + Text */}
      <div className="flex-1 flex items-start gap-6">
        <div className="shrink-0 w-24 h-24 bg-teal-100 rounded-full flex items-center justify-center text-teal-600">
          <Icon className="w-12 h-12" />
        </div>

        <div className="max-w-md">
          <h3 className="text-2xl font-semibold text-gray-900 mb-3">
            {title}
          </h3>
          <p className="text-gray-600 mb-3">{desc}</p>

          <Link
            href={href}
            className="inline-flex items-center gap-2 text-teal-600 font-medium hover:underline"
          >
            <CheckCircle2 className="w-4 h-4" />
            Learn more
          </Link>
        </div>
      </div>

      {/* RIGHT: Image (bigger & closer) */}
      <div className="flex-[1.2] w-full">
        <div className="relative w-full h-80 md:h-[380px] rounded-xl overflow-hidden">
          <Image
            src={image}
            alt={`${title} preview`}
            fill
            className="object-contain"
          />
        </div>
      </div>
    </div>
  ))}
</section>


      {/* ================= ROLES ================= */}
      <section className="bg-teal-50 py-24">
        <div className="max-w-6xl mx-auto px-6 space-y-24">
          {roles.map((role, idx) => (
            <div
              key={role.title}
              className={`flex flex-col md:flex-row items-center gap-12 ${
                idx % 2 !== 0 ? "md:flex-row-reverse" : ""
              }`}
            >
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl font-semibold text-teal-700 mb-3">
                  {role.title}
                </h3>
                <p className="text-gray-600">{role.text}</p>
              </div>
              <div className="flex-1">
                <div className="w-full h-48 bg-teal-100 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="py-10 text-center text-gray-600">
        <p>
          © {new Date().getFullYear()} Arbets-desk — Workforce management made
          simple.
        </p>
      </footer>
    </main>
  );
}
