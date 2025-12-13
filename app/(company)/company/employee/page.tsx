"use client";

import { useState, useEffect } from "react";
import { User, Clock, MoreHorizontal } from "lucide-react";

type Employee = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: "Working" | "Off" | "On Break";
};

export default function CompanyEmployeePage() {
  const [employees, setEmployees] = useState<Employee[]>([]);

  // Simulate fetching employees from DB
  useEffect(() => {
    const mockEmployees: Employee[] = [
      { id: "1", name: "Anna Karlsson", email: "anna@example.com", phone: "070-123456", role: "Nurse", status: "Working" },
      { id: "2", name: "Erik Svensson", email: "erik@example.com", phone: "070-654321", role: "Doctor", status: "Off" },
      { id: "3", name: "Johan Nilsson", email: "johan@example.com", phone: "070-112233", role: "Receptionist", status: "Working" },
      { id: "4", name: "Maria Andersson", email: "maria@example.com", phone: "070-445566", role: "Lab Technician", status: "On Break" },
      { id: "5", name: "Sara Johansson", email: "sara@example.com", phone: "070-778899", role: "Pharmacist", status: "Working" },
    ];
    setEmployees(mockEmployees);
  }, []);

  const getStatusClass = (status: Employee["status"]) => {
    switch (status) {
      case "Working":
        return "bg-green-100 text-green-700";
      case "Off":
        return "bg-gray-100 text-gray-700";
      case "On Break":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "";
    }
  };

  return (
    <div className="p-6 mt-20 max-w-7xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Employee Management</h1>
      <p className="text-gray-600">List of all employees and their current status.</p>

      <div className="bg-white rounded-lg shadow p-4 overflow-x-auto">
        <table className="w-full text-sm border-collapse">
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
            {employees.map(emp => (
              <tr key={emp.id} className="border-t hover:bg-gray-50">
                <td className="p-3 flex items-center gap-2">
                  <User className="w-4 h-4 text-teal-600" /> {emp.name}
                </td>
                <td className="p-3">{emp.email}</td>
                <td className="p-3">{emp.phone}</td>
                <td className="p-3">{emp.role}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusClass(emp.status)}`}>
                    {emp.status}
                  </span>
                </td>
                <td className="p-3 flex items-center gap-2">
                  <button className="px-3 py-1 rounded bg-teal-600 text-white hover:bg-teal-700">View</button>
                  <button className="px-3 py-1 rounded bg-yellow-400 text-white hover:bg-yellow-500">Edit</button>
                  <button className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700">Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
