// app/components/CompanyUserMenu.tsx
"use client";

import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function CompanyUserMenu({
  company,
}: {
  company: { name: string } | null;
}) {
  return (
    <Sheet>
      {/* MENU BUTTON */}
      <SheetTrigger className="p-2 mr-2">
        <Menu className="w-7 h-7 text-white" />
      </SheetTrigger>

      <SheetContent side="right" className="w-72">
        <SheetHeader>
          <SheetTitle>Company Information</SheetTitle>
        </SheetHeader>

        <div className="mt-4 space-y-4">
          {/* COMPANY INFO */}
          {company ? (
            <div className="space-y-1 text-sm">
              <p>
                <span className="font-semibold">Company:</span> {company.name}
              </p>

              <p className="text-green-700 font-medium">Logged in</p>
            </div>
          ) : (
            <p className="text-sm text-gray-500">
              Company not logged in.
            </p>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
