import Image from "next/image";
import Link from "next/link";

export default function Integrations() {
  return (
    <main className="bg-white">
      {/* HERO SECTION */}
      <section className="max-w-7xl mx-auto px-4 py-20 grid lg:grid-cols-2 gap-10 items-center">
        {/* Left */}
        <div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#00687a] mb-6 leading-tight">
            Powerful Integrations <br />
            <span className="text-teal-500">One Connected Platform</span>
          </h1>
          <p className="text-gray-700 text-lg max-w-xl mb-8">
            Arbets-desk connects seamlessly with your existing tools to automate
            payroll, scheduling, time tracking, and business analytics — all in
            one place.
          </p>

          <Link
            href="/book-demo"
            className="inline-block bg-[#00687a] hover:bg-teal-800 text-white px-8 py-3 rounded-full font-semibold shadow transition"
          >
            Request a Demo
          </Link>
        </div>

        {/* Right Image */}
        <div className="relative w-full h-80 sm:h-[420px]">
          <Image
            src="/industries/1.png"
            alt="Integrations illustration"
            fill
            className="object-contain"
            priority
          />
        </div>
      </section>

      {/* INTEGRATION TYPES */}
      <section className="bg-teal-50 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-[#00687a] mb-12">
            Works With Your Favorite Tools
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Payroll Systems",
                desc: "Automatically sync worked hours, salaries, overtime, and tips with your payroll provider.",
              },
              {
                title: "Accounting Software",
                desc: "Export sales, labor costs, and profit reports directly to accounting tools.",
              },
              {
                title: "POS Systems",
                desc: "Connect sales data with employee shifts to get real-time labor cost insights.",
              },
              {
                title: "HR & Contracts",
                desc: "Manage employee contracts, documents, and compliance in one secure place.",
              },
              {
                title: "Mobile Apps",
                desc: "Employees can check schedules, salaries, and shifts directly from their phones.",
              },
              {
                title: "Analytics Tools",
                desc: "Advanced reports on productivity, costs, profit, and performance.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition"
              >
                <h3 className="text-xl font-semibold text-[#00687a] mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY IT MATTERS */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-3xl font-bold text-[#00687a] mb-6">
              Why Integrations Matter
            </h2>
            <ul className="space-y-4 text-gray-700">
              <li>✅ Reduce manual work and human errors</li>
              <li>✅ Save time with automatic data syncing</li>
              <li>✅ Get accurate salary, shift, and cost calculations</li>
              <li>✅ Make smarter business decisions with real-time data</li>
            </ul>
          </div>

          <div className="bg-[#00687a] rounded-2xl p-8 text-white shadow-xl">
            <h3 className="text-2xl font-bold mb-4">
              Built for Growing Businesses
            </h3>
            <p className="opacity-90">
              Whether you run a hotel, restaurant, café, retail store, or
              accounting firm — Arbets-desk adapts to your workflow and scales
              with your business.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-teal-900 py-16 text-center">
        <h2 className="text-3xl font-extrabold text-white mb-4">
          Ready to Connect Everything?
        </h2>
        <p className="text-teal-100 mb-8">
          Start managing employees, shifts, salaries, and analytics from one
          powerful platform.
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
