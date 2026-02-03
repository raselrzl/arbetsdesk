"use client";

import React from "react";
import { BadgeCheck, ShieldAlert, TrendingUp } from "lucide-react";

export const TailoredSolutionsSection: React.FC = () => {
  return (
    <section id="solutions" className="relative w-full text-white py-6 my-20">
      <div className="max-w-7xl mx-auto px-4">
        {/* Role Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* ADMIN */}
          <div className="relative rounded-xl overflow-hidden bg-[#00687a] transition">
            <div className="p-6">
              <h3 className="text-xl font-bold uppercase mb-3">Admin</h3>
              <p className="text-gray-100 mb-5 leading-relaxed">
                Full system control to manage companies, monitor data, and
                ensure the platform operates correctly.
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  "Manage Companies",
                  "System Overview",
                  "Access Control",
                  "Platform Monitoring",
                ].map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 text-xs border border-gray-100 rounded-full text-teal-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* COMPANY */}
          <div className="relative rounded-xl overflow-hidden bg-[#00687a] transition">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-3 uppercase">Company</h3>
              <p className="text-gray-100 mb-5 leading-relaxed">
                Manage employees, working hours, salaries, expenses, sales, and
                financial calculations in one system.
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  "Register Employees",
                  "Time Tracking",
                  "Salary Calculation",
                  "Expenses",
                  "Sales",
                  "Profit & Loss",
                  "VAT & Tax",
                ].map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 text-xs border border-gray-100 rounded-full text-teal-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* EMPLOYEE */}
          <div className="relative rounded-xl overflow-hidden bg-[#00687a] transition">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-3 uppercase">Employee</h3>
              <p className="text-gray-100 mb-5 leading-relaxed">
                Simple login-based system where working time is recorded
                automatically for accurate salary calculation.
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  "Login / Logout",
                  "Automatic Time Tracking",
                  "Work Hours",
                  "Salary Slip",
                  "Schedule",
                  "Notifications",
                ].map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 text-xs border border-gray-100 rounded-full text-teal-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Feature Row */}
        <div className="mt-16 pt-10 border-t border-teal-300 grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="flex gap-4 items-start">
            <div className="p-2 rounded-lg border border-teal-300 text-[#00687a]">
              <BadgeCheck size={22} />
            </div>
            <div>
              <h4 className="text-lg font-bold mb-1 text-teal-600">
                Accurate Calculations
              </h4>
              <p className="text-[#00687a] leading-relaxed">
                Working hours, salaries, VAT, and profit & loss are calculated
                automatically.
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="p-2 rounded-lg border border-teal-300 text-[#00687a]">
              <ShieldAlert size={22} />
            </div>
            <div>
              <h4 className="text-lg font-bold mb-1 text-teal-600">
                Secure & Role-Based
              </h4>
              <p className="text-[#00687a] leading-relaxed">
                Separate access for admin, company, and employees ensures data
                security and control.
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="p-2 rounded-lg border border-teal-300 text-[#00687a]">
              <TrendingUp size={22} />
            </div>
            <div>
              <h4 className="text-lg font-bold mb-1 text-teal-600">
                Build
              </h4>
              <p className="text-[#00687a] leading-relaxed">
                Designed for easy work structure, accounting, VAT, and
                company operations.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
