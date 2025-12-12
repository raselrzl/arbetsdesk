// app/components/UserInfoMenu.tsx
"use client";

import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export default function UserMenu({
  user,
  companies,
}: {
  user: { personalNumber: string; role: string } | null;
  companies: string[];
}) {
  return (
    <Sheet>
      {/* MENU BUTTON */}
      <SheetTrigger className="p-2 mr-2">
        <Menu className="w-7 h-7 text-white" />
      </SheetTrigger>

      <SheetContent side="left" className="w-72">
        <SheetHeader>
          <SheetTitle>User Information</SheetTitle>
        </SheetHeader>

        <div className="mt-4 space-y-4">

          {/* USER INFO */}
          {user ? (
            <div className="space-y-1 text-sm">
              <p><span className="font-semibold">Personal Number:</span> {user.personalNumber}</p>
              <p><span className="font-semibold">Role:</span> {user.role}</p>
            </div>
          ) : (
            <p className="text-sm text-gray-500">User not logged in.</p>
          )}

          {/* COMPANY DROPDOWN MOBILE ONLY */}
          <div className="md:hidden pt-4 border-t">
            <label className="text-sm font-semibold block mb-1">Company</label>
            <select className="w-full border rounded-md px-2 py-2 bg-white">
              {companies.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
