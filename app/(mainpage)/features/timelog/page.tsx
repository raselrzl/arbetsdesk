"use client";

import Image from "next/image";

export default function HomePage() {
  return (
    <main className="bg-white">
      {/* HERO SECTION */}
      <section className="max-w-7xl mx-auto px-4 py-24 md:py-32 flex flex-col-reverse md:flex-row items-center gap-12">
        {/* TEXT CONTENT */}
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-3xl font-extrabold mb-6 text-[#00687a] uppercase">
            Digital Time Clock
          </h1>
          <h2 className="text-xl font-semibold mb-6 text-gray-800">
            Designed for both employees and managers
          </h2>
          <p className="text-gray-700 text-lg md:text-xl leading-relaxed">
            Our smart time tracking system makes managing staff schedules
            effortless. No clock-ins or outs are missed, and managers can easily
            review and approve schedule adjustments with instant notifications.
            Everything is fully digital for accurate, reliable, and streamlined
            workforce management.
          </p>
        </div>

        {/* IMAGE BOX WITH TWO IMAGES AND BOTTOM IMAGE */}
        <div className="flex-1 flex justify-center md:justify-end">
          <div className="w-[360px] md:w-[450px] bg-white rounded-xl relative">
            {/* First Image (Main) */}
            <Image
              src="/timelog/timelog1.gif"
              alt="Time Clock Step 1"
              width={550}
              height={350}
              className="object-contain w-full h-auto"
            />

            {/*    <div className="absolute -top-8 right-4 w-[180px] md:w-[220px] shadow-md rounded-lg overflow-hidden">
      <Image
        src="/timelog/timelog1.gif"
        alt="Time Clock Step 2"
        width={220}
        height={180}
        className="object-contain w-full h-auto"
      />
    </div>

  
    <div className="absolute -bottom-8 left-1/2 w-[200px] md:w-[240px] shadow-md rounded-lg overflow-hidden transform -translate-x-1/2">
      <Image
        src="/timelog/timelog1.png"
        alt="Time Clock Bottom Image"
        width={240}
        height={180}
        className="object-contain w-full h-auto"
      />
    </div> */}
          </div>
        </div>
      </section>
      {/* CTA */}
      <section className="relative bg-[#02505e] text-center">
        {/* CURVE */}
        <svg
          className="absolute -top-px left-0 w-full h-32 sm:h-24 md:h-24"
          viewBox="0 0 1440 100"
          preserveAspectRatio="none"
        >
          <path
            fill="#ffffff" // visible curve above the section
            d="M0,60 C240,100 480,20 720,30 960,40 1200,80 1440,30 L1440,0 L0,0 Z"
          />
        </svg>

        {/* CONTENT */}
        <div className="relative z-10 py-24 px-4">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-100 mb-4 uppercase">
            Ready to Get Started?
          </h2>
          <p className="text-teal-500 mb-8 max-w-xl mx-auto">
            Contact us today and see how Arbets-desk can transform your
            business.
          </p>

          <a
            href="/book-demo"
            className="inline-block bg-[#00687a] text-gray-100 px-8 py-3 rounded-full font-semibold hover:bg-[#037d93] transition shadow-lg"
          >
            Book a Free Demo
          </a>
        </div>
      </section>
    </main>
  );
}
