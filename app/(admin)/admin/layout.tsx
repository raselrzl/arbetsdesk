import Navbar from "@/app/components/Navbar";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="bg-teal-50">
      <div className="mb-14 shadow">
        <Navbar />
      </div>
      <div>{children}</div>
    </div>
  );
}
