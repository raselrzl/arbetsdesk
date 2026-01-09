"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Loader2 } from "lucide-react";
import { logoutUserAction } from "../actions";

export default function UserMenu({
  user,
}: {
  user: { personalNumber: string } | null;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  if (!user) {
    return (
      <button
        onClick={() =>
          startTransition(() => {
            router.push("/login");
          })
        }
        disabled={isPending}
        className="flex items-center justify-center gap-2 w-20 h-8 hover:text-white bg-teal-900 text-white font-bold px-4 py-1 rounded-3xl disabled:opacity-60"
      >
        {isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          "Login"
        )}
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="font-medium text-gray-700">
        {user.personalNumber}
      </span>
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
