import Image from "next/image";
import Link from "next/link";

export default function Analytics() {
  return (
    <main className="bg-white">
      {/* HERO */}
      <section className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-[#00687a] mb-6">
          Smart Business Analytics
        </h1>
        <p className="text-gray-700 text-lg max-w-3xl mx-auto">
          Turn employee data, working hours, and sales into clear insights that
          help you reduce costs, improve productivity, and grow faster.
        </p>
      </section>

      {/* KEY METRICS */}
      <section className="bg-teal-50 py-20">
        <div className="max-w-7xl mx-auto px-4 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              title: "Labor Cost",
              desc: "Track salary, overtime, and shift costs in real time.",
            },
            {
              title: "Sales & Revenue",
              desc: "Compare sales performance with staffing levels.",
            },
            {
              title: "Profit & Loss",
              desc: "Understand exactly where your money goes.",
            },
            {
              title: "Employee Performance",
              desc: "Measure productivity based on hours and output.",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition"
            >
              <h3 className="text-xl font-bold text-[#00687a] mb-2">
                {item.title}
              </h3>
              <p className="text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT HELPS */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-3xl font-bold text-[#00687a] mb-6">
              Make Better Decisions, Faster
            </h2>
            <ul className="space-y-4 text-gray-700">
              <li>✔ Identify high and low performing shifts</li>
              <li>✔ Reduce unnecessary labor costs</li>
              <li>✔ Plan schedules based on real data</li>
              <li>✔ Monitor attendance and overtime trends</li>
              <li>✔ Export reports for accounting and payroll</li>
            </ul>
          </div>

          <div className="bg-[#00687a] rounded-2xl p-8 text-white shadow-xl">
            <h3 className="text-2xl font-bold mb-4">
              Real-Time & Automatic
            </h3>
            <p className="opacity-90">
              All analytics are generated automatically from time logs, shifts,
              payroll, and sales — no manual work required.
            </p>
          </div>
        </div>
      </section>

      {/* VISUAL PREVIEW */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-[#00687a] mb-8">
            Clear Reports & Dashboards
          </h2>

          <div className="relative w-full h-[350px] sm:h-[450px] mx-auto max-w-4xl rounded-2xl overflow-hidden shadow-lg bg-white">
            <Image
              src="/analytics.gif"
              alt="Analytics dashboard preview"
              fill
              className="object-contain"
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-teal-900 py-16 text-center">
        <h2 className="text-3xl font-extrabold text-white mb-4">
          See Your Business Clearly
        </h2>
        <p className="text-teal-100 mb-8">
          Stop guessing. Start making data-driven decisions with Arbets-desk
          Analytics.
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
