import CompanyNavbar from "./companycomponents/CompanyNavbar";

export default function CompanyLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
     <div className="">
       <CompanyNavbar />
       {children}
     </div>
   );
 }
