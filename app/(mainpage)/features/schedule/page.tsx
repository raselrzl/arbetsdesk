"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function SchedulePage() {
  const features = [
    {
      title: "One Click Schedule Creation",
      description:
        "Create schedules for your entire team in just one click. Save hours every week!",
      image: "/schedule/scheduling.png",
      alt: "Create schedule easily",
    },
    {
      title: "Easy Schedule Editing",
      description:
        "Update existing schedules instantly without hassle. Editing has never been this fast!",
      image: "/schedule/edit1.png",
      alt: "Edit schedule in one click",
    },
    {
      title: "Real-Time Schedule Swaps",
      description:
        "Swap shifts between employees in real time. Everyone stays in sync effortlessly!",
      image: "/schedule/swap.png",
      alt: "Swap shifts instantly",
    },
    {
  title: "Schedule With Confidence",
  description:
    "Every schedule shows its real cost as you build it. Stay in control of labor expenses from the first shift to the last.",
  image: "/schedule/s6.png",
  alt: "Confident scheduling with cost control",
},

  ];

  return (
    <main className="bg-white">
      {/* HERO SECTION */}
      <section className="max-w-7xl mx-auto px-4 py-24 flex flex-col md:flex-row items-center gap-12">
        {/* TEXT */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex-1 text-left"
        >
          <h1 className="text-3xl font-extrabold mb-4 text-[#00687a] uppercase">
            Efficient Scheduling
          </h1>
          <h2 className="text-xl font-semibold mb-4 text-[#00687a]">
            Planning the schedule easily
          </h2>
          <p className="text-[#00687a] text-sm md:text-lg leading-relaxed text-justify">
            Arbetsdesk makes employee scheduling fast and flexible. Create, update, swap,
            or delete schedules in just a few clicks. Plan weekly or monthly schedules
            for your entire staff all in one place.
          </p>
        </motion.div>

        {/* IMAGE */}
        <motion.div
          initial={{ opacity: 0, x: 40, scale: 0.95 }}
          whileInView={{ opacity: 1, x: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex-1 flex justify-center md:justify-end relative"
        >
          <div className="w-full max-w-[460px] rounded-xl shadow-lg overflow-hidden relative">
            <Image
              src="/schedule/s7.png"
              alt="Staff scheduling dashboard"
              width={900}
              height={600}
              className="w-full h-auto object-contain"
            />
          </div>
        </motion.div>
      </section>

      {/* FEATURES SECTION */}
      <section className="w-full px-4">
        <div className="max-w-7xl mx-auto grid gap-24">
          {features.map((feature, index) => {
            const isEven = index % 2 !== 0;

            return (
              <div
                key={index}
                className={`grid grid-cols-1 md:grid-cols-2 items-center gap-12 relative`}
              >
                {/* IMAGE */}
                <motion.div
                  initial={{ opacity: 0, x: isEven ? -40 : 40, scale: 0.95 }}
                  whileInView={{ opacity: 1, x: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="flex justify-center md:justify-end relative mb-24"
                >
                  <div className="w-full max-w-[460px] relative">
                    <Image
                      src={feature.image}
                      alt={feature.alt}
                      width={900}
                      height={600}
                      className="w-full h-auto object-contain rounded-lg shadow-lg"
                    />
                    {/* MOBILE OVERLAY */}
                    <div className="md:hidden absolute -bottom-24 left-1/2 -translate-x-1/2 w-[90%] bg-white/90 backdrop-blur-md p-5 rounded-2xl shadow-lg text-center z-10">
                      <h3 className="text-xl font-extrabold mb-2 text-[#00687a]">
                        {feature.title}
                      </h3>
                      <p className="text-[#00687a] text-sm leading-relaxed text-justify">
                        {feature.description}
                      </p>
                    </div>
                  </div>

                  {/* DESKTOP OVERLAY */}
                  <div
                    className={`hidden md:block absolute top-10 ${
                       "right-[-380px]"
                    } max-w-xl bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-lg`}
                  >
                    <h3 className="text-2xl font-extrabold mb-3 text-[#00687a]">
                      {feature.title}
                    </h3>
                    <p className="text-[#00687a] text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="relative bg-[#02505e] text-center">
        <svg
          className="absolute -top-px left-0 w-full h-32 sm:h-24 md:h-24"
          viewBox="0 0 1440 100"
          preserveAspectRatio="none"
        >
          <path
            fill="#ffffff"
            d="M0,60 C240,100 480,20 720,30 960,40 1200,80 1440,30 L1440,0 L0,0 Z"
          />
        </svg>

        <div className="relative z-10 py-24 px-4">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-100 mb-4 uppercase">
            Ready to Get Started?
          </h2>
          <p className="text-teal-500 mb-8 max-w-xl mx-auto">
            Contact us today and see how Arbets-desk can transform your business.
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
