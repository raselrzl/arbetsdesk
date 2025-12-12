import EmployeeNavbar from "../employeecomponents/EmployeeNavbar";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="">
      <EmployeeNavbar />
      {children}
    </div>
  );
}
