import { getEmployeeProfile, updateName, updateEmail, updatePhone, updatePin } from "../employeeactions";
import EditableField from "./EditableField";

export default async function ProfilePage() {
  const employee = await getEmployeeProfile();

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

      {/* CONTRACT INFO */}
      <Section title="Contract">
        <Item label="Contract Type" value={employee.contractType} />
        {employee.contractType === "HOURLY" && <Item label="Hourly Rate" value={`${employee.hourlyRate} / hour`} />}
        {employee.contractType === "MONTHLY" && <Item label="Monthly Salary" value={`${employee.monthlySalary} / month`} />}
      </Section>

      {/* COMPANY INFO */}
      <Section title="Company">
        <Item label="Company Name" value={employee.company.name} />
        <Item label="Company Email" value={employee.company.email} />
      </Section>

      {/* SECURITY */}
      <Section title="Security">
        <EditableField label="Login PIN" value={employee.pinCode} masked onSave={updatePin} />
      </Section>

      <p className="text-xs text-gray-500 mt-6">Employee ID: {employee.id}</p>
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

function Item({ label, value }: { label: string; value?: string | number | null }) {
  return (
    <div className="border border-teal-100 rounded-xs px-2 py-0.5">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="font-medium">{value ?? "-"}</p>
    </div>
  );
}
