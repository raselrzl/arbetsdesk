"use client";

import Link from "next/link";

export default function AdminPage({ user }: { user: any }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="w-full max-w-md bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700 space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-sm text-gray-300 mt-1">
            Logged in as <span className="text-white font-medium">{user.name}</span>
          </p>
          <p className="text-xs text-gray-400">{user.email}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-4">
          <Link
            href="/admin/createuser"
            className="block text-center px-4 py-3 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600 transition"
          >
            Create User
          </Link>

          <Link
            href="/admin/createcompany"
            className="block text-center px-4 py-3 rounded-lg bg-green-500 text-white font-medium hover:bg-green-600 transition"
          >
            Create Company
          </Link>
        </div>
      </div>
    </div>
  );
}
