import CompanyNavbar from "./companycomponents/CompanyNavbar";

export default function CompanyLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
     <div className="bg-teal-50">
       <CompanyNavbar />
       {children}
     </div>
   );
 }
