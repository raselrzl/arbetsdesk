"use client";

import { useEffect, useState } from "react";
import { User } from "lucide-react";
import { getCompanyEmployees } from "@/app/actions";

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
    <div className="p-6 mt-20 max-w-7xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Employee Management</h1>

      <div className="bg-white rounded-lg shadow p-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Phone</th>
              <th className="p-3 text-left">Role</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp.id} className="border-t hover:bg-gray-50">
                <td className="p-3 flex items-center gap-2">
                  <User className="w-4 h-4 text-teal-600" />
                  {emp.name}
                </td>
                <td className="p-3">{emp.email ?? "-"}</td>
                <td className="p-3">{emp.phone ?? "-"}</td>
                <td className="p-3">{emp.role}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusClass(emp.status)}`}>
                    {emp.status}
                  </span>
                </td>
                <td className="p-3 flex gap-2">
                  <button className="px-3 py-1 bg-teal-600 text-white rounded">View</button>
                  <button className="px-3 py-1 bg-yellow-400 text-white rounded">Edit</button>
                  <button className="px-3 py-1 bg-red-600 text-white rounded">Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
