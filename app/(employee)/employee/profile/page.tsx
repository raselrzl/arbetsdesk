import { getEmployeeProfile, updateName, updateEmail, updatePhone, updatePin } from "../employeeactions";
import EditableField from "./EditableField";

export default async function ProfilePage() {
  const employee = await getEmployeeProfile();

  return (
    <div className="max-w-4xl mx-auto mt-24 p-6 bg-white rounded-md shadow">
      <h1 className="text-2xl font-bold mb-6">My Profile</h1>

      {/* EMPLOYEE INFO */}
      <Section title="Personal Information">
        <EditableField label="Name" value={employee.name} onSave={updateName} />
        <EditableField label="Email" value={employee.email} onSave={updateEmail} />
        <EditableField label="Phone" value={employee.phone} onSave={updatePhone} />
        <EditableField label="Personal Number" value={employee.personalNumber} disabled />
      </Section>

      {/* CONTRACT INFO */}
      <Section title="Contract">
        <Item label="Contract Type" value={employee.contractType} />
        {employee.contractType === "HOURLY" && (
          <Item label="Hourly Rate" value={`${employee.hourlyRate} / hour`} />
        )}
        {employee.contractType === "MONTHLY" && (
          <Item label="Monthly Salary" value={`${employee.monthlySalary} / month`} />
        )}
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

      {/* FOOTER */}
      <p className="text-xs text-gray-500 mt-6">Employee ID: {employee.id}</p>
    </div>
  );
}

/* ---------------- COMPONENTS ---------------- */

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <h2 className="text-sm font-semibold text-gray-600 mb-3">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
    </div>
  );
}

function Item({ label, value }: { label: string; value?: string | number | null }) {
  return (
    <div className="border rounded-md p-3">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="font-medium">{value ?? "-"}</p>
    </div>
  );
}
