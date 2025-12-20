"use client";

import Link from "next/link";
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
  },
  {
    title: "Scheduling",
    desc: "Plan shifts and avoid conflicts easily.",
    icon: Calendar,
    href: "/features/schedule",
  },
  {
    title: "Payroll",
    desc: "Automated salary calculations and payouts.",
    icon: Wallet,
    href: "/features/payroll",
  },
  {
    title: "Analytics",
    desc: "Understand performance with smart insights.",
    icon: BarChart3,
    href: "/features/analytics",
  },
  {
    title: "Staff Management",
    desc: "Manage employees from one dashboard.",
    icon: Users,
    href: "/features/staff",
  },
];

const roles = [
  {
    title: "Users",
    text: "Access profiles, schedules, and personal data securely.",
  },
  {
    title: "Employees",
    text: "Clock in, view shifts, and track working hours.",
  },
  {
    title: "Companies",
    text: "Manage staff, payroll, invoices, and analytics.",
  },
];

export default function HomePage() {
  return (
    <main className="bg-[linear-gradient(to_bottom,#f9fafb,#ffffff)]">
      {/* HERO */}
      <section className="max-w-7xl mx-auto px-6 pt-24 pb-32 flex flex-col lg:flex-row items-center justify-between gap-12">
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
              className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg font-medium transition shadow-teal-100"
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
          <div className="absolute w-72 h-72 bg-teal-100 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute w-56 h-56 bg-teal-300 rounded-full blur-2xl animate-pulse delay-200"></div>
          <div className="absolute w-40 h-40 bg-teal-500 rounded-full blur-xl animate-pulse delay-400"></div>
        </div>
      </section>

      {/* FEATURES LEFT-RIGHT ALTERNATE */}
      <section className="max-w-6xl mx-auto px-6 py-24 space-y-24">
        {features.map(({ title, desc, icon: Icon }, idx) => (
          <div
            key={title}
            className={`flex flex-col md:flex-row items-center gap-12 ${
              idx % 2 !== 0 ? "md:flex-row-reverse" : ""
            }`}
          >
            {/* Icon / visual */}
            <div className="shrink-0 w-32 h-32 bg-teal-100 rounded-full flex items-center justify-center text-teal-600">
              <Icon className="w-16 h-16" />
            </div>

            {/* Text */}
            <div className="max-w-lg text-center md:text-left">
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                {title}
              </h3>
              <p className="text-gray-600 mb-3">{desc}</p>
              <div className="flex items-center gap-2 text-teal-600 font-medium justify-center md:justify-start">
                <CheckCircle2 className="w-4 h-4" />
                Learn more
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* ROLES LEFT-RIGHT */}
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
                <div className="w-full h-48 bg-teal-100 rounded-xl"></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-10 text-center text-gray-600">
        <p>
          © {new Date().getFullYear()} Arbets-desk — Workforce management made
          simple.
        </p>
      </footer>
    </main>
  );
}
