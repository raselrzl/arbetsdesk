"use client";

import { useEffect, useState } from "react";
import { getAllSalarySlipsForEmployee, getSalarySlipByMonth } from "../../salaryActions";

interface Props {
  employeeId: string;
}

export default function EmployeeSalarySlips({ employeeId }: Props) {
  const [slips, setSlips] = useState<any[]>([]);
  const [selectedSlip, setSelectedSlip] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getAllSalarySlipsForEmployee(employeeId)
      .then((data) => {
        setSlips(data);
        if (data.length > 0) {
          setSelectedSlip(data[0]); // default to latest
        }
      })
      .finally(() => setLoading(false));
  }, [employeeId]);

  const handleSelectSlip = async (year: number, month: number) => {
    setLoading(true);
    const slip = await getSalarySlipByMonth(employeeId, year, month);
    setSelectedSlip(slip);
    setLoading(false);
  };

  if (loading) return <div className="p-6 text-center">Loading salary slips...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* ---------- List of all slips ---------- */}
      <section>
        <h2 className="text-lg font-bold mb-2">All Salary Slips</h2>
        {slips.length === 0 ? (
          <p className="text-gray-500">No salary slips found for this employee.</p>
        ) : (
          <ul className="flex flex-wrap gap-2">
            {slips.map((slip) => (
              <li key={slip.id}>
                <button
                  className={`px-3 py-1 rounded border ${
                    selectedSlip?.id === slip.id ? "bg-teal-600 text-white" : "bg-gray-100"
                  }`}
                  onClick={() => handleSelectSlip(slip.year, slip.month)}
                >
                  {slip.year}-{slip.month.toString().padStart(2, "0")}
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* ---------- Selected slip details ---------- */}
      {selectedSlip && (
        <section className="mt-6 p-4 border rounded shadow">
          <h3 className="font-bold text-lg mb-2">
            Salary Slip: {selectedSlip.year}-{selectedSlip.month.toString().padStart(2, "0")}
          </h3>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p>
                <strong>Name:</strong> {selectedSlip.employee.person.name}
              </p>
              <p>
                <strong>Personal Number:</strong>{" "}
                {selectedSlip.employee.person.personalNumber}
              </p>
              <p>
                <strong>Email:</strong> {selectedSlip.employee.person.email || "-"}
              </p>
            </div>
            <div>
              <p>
                <strong>Company:</strong> {selectedSlip.company.name}
              </p>
              <p>
                <strong>Status:</strong> {selectedSlip.status}
              </p>
              <p>
                <strong>Created At:</strong>{" "}
                {new Date(selectedSlip.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <table className="w-full text-sm border-collapse border">
            <thead>
              <tr className="bg-teal-200">
                <th className="border p-2 text-left">Type</th>
                <th className="border p-2 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border p-2">{selectedSlip.employee.contractType}</td>
                <td className="border p-2 text-right">{selectedSlip.totalPay.toFixed(2)}</td>
              </tr>
              <tr>
                <td className="border p-2">Tax</td>
                <td className="border p-2 text-right">{selectedSlip.tax.toFixed(2)}</td>
              </tr>
              <tr>
                <td className="border p-2 font-bold">Net Salary</td>
                <td className="border p-2 text-right font-bold">
                  {(selectedSlip.totalPay - selectedSlip.tax).toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        </section>
      )}
    </div>
  );
}
