import Navbar from "@/app/components/Navbar";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className=""
      >
        <div className="mb-20">
          <Navbar />
        </div>
        <div>{children}</div>
      </body>
    </html>
  );
}
