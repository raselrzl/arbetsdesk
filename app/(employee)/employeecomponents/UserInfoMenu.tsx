// app/components/UserInfoMenu.tsx
"use client";

import { Menu, User as UserIcon, LogOut } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import CompanySelect from "./CompanySelect";
import { Button } from "@/components/ui/button";

type UserInfo = {
  name?: string;
  email?: string | null;
  personalNumber?: string;
  role: string;
};

export default function UserMenu({
  user,
  companies,
}: {
  user: UserInfo | null;
  companies: string[];
}) {
  return (
    <Sheet>
      <SheetTrigger className="p-2 rounded-full hover:bg-teal-500 transition">
        <Menu className="w-7 h-7 text-white" />
      </SheetTrigger>

      <SheetContent side="right" className="w-80 p-6">
        <SheetHeader className="mb-4">
          <SheetTitle className="text-lg font-bold text-teal-800 uppercase">
            My Profile
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-6">
          {user ? (
            <div className="bg-teal-50 p-4 rounded-xs shadow-sm border border-teal-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-teal-200 rounded-full flex items-center justify-center">
                  <UserIcon className="w-6 h-6 text-teal-600" />
                </div>
                <div>
                  <p className="font-semibold text-teal-900">
                    {user.name || "Employee"}
                  </p>
                  <p className="text-sm text-gray-700">Role: {user.role}</p>
                </div>
              </div>

              <div className="mt-3 border-t border-teal-100 pt-3 text-sm text-gray-700 space-y-1">
                {user.personalNumber && (
                  <p>
                    <span className="font-semibold">Personal Number:</span>{" "}
                    {user.personalNumber}
                  </p>
                )}
                {user.email && (
                  <p>
                    <span className="font-semibold">Email:</span> {user.email}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-500">User not logged in.</p>
          )}

          <div className="md:hidden pt-4 border-t">
            <CompanySelect companies={companies} />
          </div>

          {user && (
            <form action="/" method="post">
              <Button
                type="submit"
                variant="outline"
                className="w-full flex items-center justify-center gap-2 rounded-xs bg-red-600"
              >
                <LogOut className="w-4 h-4" /> Logout
              </Button>
            </form>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
