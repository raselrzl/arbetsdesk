"use client";

import { useEffect, useState } from "react";
import { User, MoreHorizontal } from "lucide-react";
import { getCompanyEmployees } from "@/app/actions";
import Link from "next/link";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

type Employee = {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  role: string;
  status: "Working" | "Off" | "On Break";
};

export default function CompanyEmployeePage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadEmployees() {
      try {
        const data = await getCompanyEmployees();
        setEmployees(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadEmployees();
  }, []);

  const getStatusClass = (status: Employee["status"]) => {
    switch (status) {
      case "Working":
        return "bg-green-100 text-green-700";
      case "Off":
        return "bg-gray-100 text-gray-700";
      case "On Break":
        return "bg-yellow-100 text-yellow-700";
    }
  };

  if (loading) {
    return <div className="p-6 mt-20">Loading employees...</div>;
  }

  return (
    <div className="p-6 mt-20 max-w-7xl mx-auto space-y-6 overflow-x-hidden">
      <h1 className="text-3xl font-bold text-teal-200">
        Employee Management
      </h1>

      <div className="flex justify-start md:justify-end">
        <Link
          href="/company/createemployee"
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium
                     text-teal-700 bg-teal-50 border border-teal-200
                     rounded-xs hover:bg-teal-100 transition"
        >
          + Add Employee
        </Link>
      </div>

      <div className="bg-white rounded-xs border border-teal-100 shadow shadow-teal-100">
        <div className="overflow-x-auto">
          <table className="min-w-max w-full text-sm">
            <thead className="bg-teal-50">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Phone</th>
                <th className="p-3 text-left">Role</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {employees.map((emp) => (
                <tr
                  key={emp.id}
                  className="border-t border-teal-100 hover:bg-teal-50"
                >
                  <td className="p-3 flex items-center gap-2">
                    <User className="w-4 h-4 text-teal-600" />
                    {emp.name}
                  </td>
                  <td className="p-3">{emp.email ?? "-"}</td>
                  <td className="p-3">{emp.phone ?? "-"}</td>
                  <td className="p-3">{emp.role}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded-xs text-xs ${getStatusClass(
                        emp.status
                      )}`}
                    >
                      {emp.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="p-3 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          className="p-2 rounded-xs hover:bg-teal-100"
                          aria-label="Open actions"
                        >
                          <MoreHorizontal className="w-4 h-4 text-teal-600" />
                        </button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent
                        align="end"
                        className="rounded-xs border-teal-100"
                      >
                        <DropdownMenuItem
                          onClick={() => {
                            console.log("View", emp.id);
                          }}
                        >
                          View Details
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={() => {
                            console.log("Edit", emp.id);
                          }}
                        >
                          Edit Employee
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          className="text-red-600 focus:text-red-600"
                          onClick={() => {
                            console.log("Delete", emp.id);
                          }}
                        >
                          Delete Employee
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
