"use client";

import Link from "next/link";

export default function AdminPage({ user }: { user: any }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xs shadow-lg border border-teal-200 space-y-6">
        {/* Header */}
        <div className="text-center text-teal-800">
          <h1 className="text-2xl font-bold uppercase">Admin Dashboard</h1>
          <p className="text-sm text-teal-300 mt-1">
            Logged in as <span className=" font-medium">{user.name}</span>
          </p>
          <p className="text-xs text-gray-400">{user.email}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-4">
          <Link
            href="/admin/createuser"
            className="block text-center px-4 py-3 rounded-xs bg-teal-500 text-white font-medium hover:bg-teal-600 transition"
          >
            Create User
          </Link>

          <Link
            href="/admin/createcompany"
            className="block text-center px-4 py-3 rounded-xs bg-green-500 text-white font-medium hover:bg-green-600 transition"
          >
            Create Company
          </Link>
        </div>
      </div>
    </div>
  );
}
