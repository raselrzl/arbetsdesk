"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center px-4 py-10">
      {/* Hero Section */}
      <section className="text-center max-w-3xl mb-12">
        <h1 className="text-5xl font-extrabold text-teal-700 mb-4">
          Welcome to Arbets-desk
        </h1>
        <p className="text-gray-700 text-lg">
          Arbets-desk is your centralized platform to manage employees,
          schedules, and company operations efficiently. Whether you are a user,
          an employee, or a company admin, your workflow is simplified and
          secure.
        </p>
      </section>

      {/* Role Information */}
      <section className="grid gap-6 md:grid-cols-3 w-full max-w-6xl mb-12">
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <h2 className="text-2xl font-semibold text-teal-700 mb-2">User</h2>
          <p className="text-gray-600 mb-4">
            Access your personal profile, track schedules, and keep your
            information updated.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 text-center">
          <h2 className="text-2xl font-semibold text-teal-700 mb-2">
            Employee
          </h2>
          <p className="text-gray-600 mb-4">
            Check your shifts, log working hours, and access your company’s
            resources.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 text-center">
          <h2 className="text-2xl font-semibold text-teal-700 mb-2">Company</h2>
          <p className="text-gray-600 mb-4">
            Manage employees, schedules, invoices, and company operations in one
            central place.
          </p>
        </div>
      </section>

      {/* Info Footer */}
      <section className="max-w-3xl text-center text-gray-600">
        <p>
          Arbets-desk centralizes employee and company data, making it easier to
          manage profiles, schedules, invoices, and more — all securely from one
          platform.
        </p>
      </section>
    </div>
  );
}
