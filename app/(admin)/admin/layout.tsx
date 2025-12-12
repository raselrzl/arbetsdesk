import Navbar from "@/app/components/Navbar";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <div className="mb-20">
        <Navbar />
      </div>
      <div>{children}</div>
    </div>
  );
}
