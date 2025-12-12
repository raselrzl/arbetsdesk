"use client";
import Link from "next/link";
import { logoutUserAction } from "../actions";

export default function UserMenu({ user }: { user: { personalNumber: string } | null }) {
  if (!user) {
    return (
      <Link
        href="/login"
        className="hover:text-white bg-gray-600 text-white font-bold px-4 py-1 rounded-2xl"
      >
        Login
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="font-medium text-gray-700">{user.personalNumber}</span>
      <form action={logoutUserAction}>
        <button
          type="submit"
          className="hover:text-white bg-red-600 text-white font-bold px-4 py-1 rounded-2xl"
        >
          Logout
        </button>
      </form>
    </div>
  );
}
