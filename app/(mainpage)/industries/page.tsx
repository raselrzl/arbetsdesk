import Image from "next/image";
import Link from "next/link";

export default function IndustriesPage() {
  return (
    <main className="bg-white">
      {/* HERO */}
      <section className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-[#00687a] mb-6">
          Built for Every Industry
        </h1>
        <p className="text-gray-700 text-lg max-w-3xl mx-auto">
          Arbets-desk adapts to your business needs — from employee scheduling
          and payroll to cost analysis and performance insights.
        </p>
      </section>

      {/* INDUSTRY CARDS */}
      <section className="bg-teal-50 py-20">
        <div className="max-w-7xl mx-auto px-4 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: "Hotels",
              desc: "Manage shifts, night work, overtime, and payroll across departments with full visibility.",
              link: "/industries/hotel",
            },
            {
              title: "Restaurants",
              desc: "Track employee hours, tips, sales, and labor costs in real time.",
              link: "/industries/restaurant",
            },
            {
              title: "Fast Food & Cafés",
              desc: "Perfect for high-turnover teams, flexible shifts, and fast payroll processing.",
              link: "/industries/fastfood-cafe",
            },
            {
              title: "Retail Stores",
              desc: "Plan shifts based on traffic, manage part-time staff, and analyze sales vs labor.",
              link: "/industries/retail",
            },
            {
              title: "Accounting Firms",
              desc: "Track billable hours, employee productivity, and generate accurate reports.",
              link: "/industries/accounting",
            },
            {
              title: "Custom Businesses",
              desc: "Fully flexible system that adapts to your workflow, policies, and team structure.",
              link: "/contact",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition flex flex-col"
            >
              <h3 className="text-xl font-bold text-[#00687a] mb-3">
                {item.title}
              </h3>
              <p className="text-gray-600 flex-grow">{item.desc}</p>

              <Link
                href={item.link}
                className="mt-6 text-teal-600 font-semibold hover:underline"
              >
                Learn more →
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* WHY IT WORKS */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-3xl font-bold text-[#00687a] mb-6">
              One Platform, Many Industries
            </h2>
            <ul className="space-y-4 text-gray-700">
              <li>✔ Employee scheduling & shift management</li>
              <li>✔ Salary calculation & payslip generation</li>
              <li>✔ Time tracking & attendance monitoring</li>
              <li>✔ Sales, cost & profit analysis</li>
              <li>✔ Employee & admin access control</li>
            </ul>
          </div>

          <div className="bg-[#00687a] text-white rounded-2xl p-8 shadow-xl">
            <h3 className="text-2xl font-bold mb-4">
              Designed for Growth
            </h3>
            <p className="opacity-90">
              Whether you manage 5 employees or 500, Arbets-desk scales with your
              business and keeps everything automatic, accurate, and simple.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-teal-900 py-16 text-center">
        <h2 className="text-3xl font-extrabold text-white mb-4">
          Find Your Industry Solution
        </h2>
        <p className="text-teal-100 mb-8">
          See how Arbets-desk can simplify your daily operations.
        </p>
        <Link
          href="/book-demo"
          className="bg-white text-teal-900 px-8 py-3 rounded-full font-semibold hover:bg-teal-100 transition"
        >
          Book a Free Demo
        </Link>
      </section>
    </main>
  );
}
