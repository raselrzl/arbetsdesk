"use client";

import { Menu, LogOut, Building2, Users, CreditCard } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { logoutCompanyAction } from "@/app/actions";

type CompanySession = {
  name: string;
  email: string;
  organizationNo: string;
  paymentStatus: "PAID" | "PENDING" | "OVERDUE";
  adminName: string;
  employeesCount: number;
};

interface CompanyUserMenuProps {
  company: CompanySession | null;
}

export default function CompanyUserMenu({ company }: CompanyUserMenuProps) {
  return (
    <Sheet>
      <SheetTrigger className="">
        <Menu className="w-7 h-7 text-white" />
      </SheetTrigger>

      <SheetContent side="right" className="w-70 md:w-80 px-4">
        <SheetHeader>
          <SheetTitle>Company Details</SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-5 text-sm">
          {company ? (
            <>
              <div className="flex gap-3">
                <Building2 className="w-5 h-5 text-gray-500 mt-1" />
                <div>
                  <p className="font-semibold text-base">{company.name}</p>
                  <p className="text-gray-600">{company.email}</p>
                  <p className="text-gray-500">
                    Org No: {company.organizationNo}
                  </p>
                </div>
              </div>

              {/*    <div>
                <p className="font-medium">Admin</p>
                <p>{company.adminName}</p>
              </div> */}

              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                <span
                  className={`font-semibold ${
                    company.paymentStatus === "PAID"
                      ? "text-green-600"
                      : company.paymentStatus === "OVERDUE"
                      ? "text-red-600"
                      : "text-yellow-600"
                  }`}
                >
                  Apps Payment: {company.paymentStatus}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>{company.employeesCount} employees</span>
              </div>

              <form action={logoutCompanyAction} className="pt-4">
                <button
                  type="submit"
                  className="w-40 flex items-center justify-center gap-2 rounded-xs bg-red-600 py-2 text-white hover:bg-red-700 transition cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </form>
            </>
          ) : (
            <p className="text-gray-500">Company not logged in.</p>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
