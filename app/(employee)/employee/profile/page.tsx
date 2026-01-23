"use client";

import { useEffect, useState } from "react";
import {
  getEmployeeProfile,
  updateName,
  updateEmail,
  updatePhone,
  updatePin,
  getEmployeeCompanies,
} from "../employeeactions";
import EditableField from "./EditableField";

type Company = {
  companyId: string;
  companyName: string;
};

export default function ProfilePage() {
  const [employee, setEmployee] = useState<any>(null);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);

  /* ---------------- FETCH EMPLOYEE ---------------- */
  useEffect(() => {
    async function fetchEmployee() {
      try {
        const data = await getEmployeeProfile();
        setEmployee(data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchEmployee();
  }, []);

  /* ---------------- FETCH COMPANIES ---------------- */
  useEffect(() => {
    async function fetchCompanies() {
      try {
        const data = await getEmployeeCompanies();
        setCompanies(data);
        if (data.length) setSelectedCompanyId(data[0].companyId);
      } catch (err) {
        console.error(err);
      }
    }
    fetchCompanies();
  }, []);

  if (!employee) return <p>Loading profile…</p>;

  /* ---------------- SELECTED COMPANY ---------------- */
  const selectedCompany = companies.find((c) => c.companyId === selectedCompanyId);

  return (
    <div className="max-w-7xl mx-auto my-24 p-6 bg-teal-500 text-white rounded-md shadow">
      <h1 className="text-2xl font-bold mb-6 uppercase">My Profile</h1>

      {/* PERSONAL INFORMATION */}
      <Section title="Personal Information">
        <EditableField label="Name" value={employee.name} onSave={updateName} />
        <EditableField label="Email" value={employee.email} onSave={updateEmail} />
        <EditableField label="Phone" value={employee.phone} onSave={updatePhone} />
        <EditableField label="ID" value={employee.personalNumber} disabled />
      </Section>

     {/* SECURITY */}
      <Section title="Security">
        <EditableField label="Login PIN" value={employee.pinCode} masked onSave={updatePin} />
      </Section>

      <p className="text-xs text-gray-200 mt-6">Employee ID: {employee.id}</p>
    </div>
  );
}

/* ---------------- COMPONENTS ---------------- */
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <h2 className="text-md font-bold uppercase text-teal-900 mb-2">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
    </div>
  );
}

