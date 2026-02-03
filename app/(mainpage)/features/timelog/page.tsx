"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function HomePage() {
  return (
    <main className="bg-white">
      <section className="max-w-7xl mx-auto px-4 py-24 flex flex-col items-center gap-12">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex-2 text-left"
        >
          <h1 className="text-3xl font-extrabold mb-6 text-[#00687a] uppercase">
            Digital Time Clock
          </h1>
          <h2 className="text-xl font-semibold mb-6 text-[#00687a]">
            Designed for both employees and managers
          </h2>
          <p className="text-[#00687a] text-sm md:text-lg max-w-3xl leading-relaxed text-justify">
            Our smart time tracking system makes managing staff schedules
            effortless. No clock-ins or outs are missed, and managers can easily
            review and approve schedule adjustments with instant notifications.
            Everything is fully digital for accurate, reliable, and streamlined
            workforce management.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex-2 flex justify-center md:justify-end"
        >
          <div className="w-[360px] md:w-[450px] bg-white rounded-xl relative">
            <Image
              src="/timelog/timelog1.gif"
              alt="Time Clock Step 1"
              width={550}
              height={350}
              className="object-contain w-full h-auto"
            />
          </div>
        </motion.div>
      </section>
      <section className="w-full px-4">
        <div className="max-w-3xl mx-auto grid gap-8 md:grid-cols-1 mb-30">
          <div className="bg-white text-[#00687a] p-8 rounded-2xl shadow-lg">
            <h2 className="text-2xl font-extrabold mb-4 uppercase">
              ID OPTIONS FOR ALL STAFF
            </h2>
            <p className="text-sm leading-relaxed text-justify">
              Arbetsdesk allows employees without a Swedish personal
              identification number to fully use the system. With coordination
              numbers or date of birth entries, all staff can log in, follow
              their schedules, and clock in and out digitally ensuring no one is
              excluded from time tracking.
            </p>
          </div>

          <div className="bg-white text-[#00687a] p-8 rounded-2xl shadow-lg">
            <h2 className="text-2xl font-extrabold mb-4 uppercase">
              SUITABLE FOR EVERY WORK ENVIRONMENT
            </h2>
            <p className="text-sm leading-relaxed text-justify">
              Our digital time clock works seamlessly across multiple
              industries, from hospitality and retail to offices. Arbetsdesk
              streamlines time reporting, reduces errors during clock in/out,
              and saves administrative time while ensuring accurate, secure
              tracking.
            </p>
          </div>
          <div className="bg-white text-[#00687a] p-8 rounded-2xl shadow-lg">
            <h2 className="text-2xl font-extrabold mb-4 uppercase">
              SIMPLE SETUP AND EMPLOYEE REGISTRATION
            </h2>
            <p className="text-sm leading-relaxed text-justify">
              Employees can register themselves the first time they use
              Arbetsdesk, or employers can quickly add new staff via the admin
              login. Once registered, employees clock in/out using their
              personal ID and have full access to the app, making shift
              management effortless and organized.
            </p>
          </div>
        </div>
      </section>

      <section className="mt-20 mb-70 w-full ">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 items-center">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative flex justify-center md:justify-end"
          >
            <div className="w-auto h-[350px] relative">
              <img
                src="/timelog/timepad1.png"
                alt=""
                className="w-auto h-[350px] object-contain shadow-xl shadow-teal-900"
              />
              <div className="md:hidden absolute bottom-20 left-1/2 -translate-x-1/2 translate-y-[90%] w-[90%] bg-white/90 backdrop-blur-md p-5 rounded-2xl shadow-lg text-center z-10">
                <h1 className="text-xl font-extrabold mb-2 text-[#00687a] uppercase">
                  Time log
                </h1>
                <h2 className="text-base font-semibold mb-2 text-[#00687a]">
                  Login Once. Time Starts Automatically.
                </h2>
                <p className="text-[#00687a] text-sm leading-relaxed text-justify">
                  Open the application, enter your personal number, and click
                  login. Your work time starts counting instantly no manual
                  steps required.
                </p>
              </div>
            </div>
            <div className="hidden md:block absolute top-20 right-[-380px] max-w-xl bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-lg">
              <h1 className="text-3xl font-extrabold mb-3 text-[#00687a] uppercase">
                Time log
              </h1>
              <h2 className="text-lg font-semibold mb-3 text-[#00687a]">
                Login Once. Time Starts Automatically.
              </h2>
              <p className="text-[#00687a] text-sm leading-relaxed text-justify">
                Open the application, enter your personal number, and click
                login. Time tracking begins instantly no buttons, no manual
                steps, no delays.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="mt-20 mb-30 w-full pb-20">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 items-center">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative flex justify-center md:justify-end"
          >
            <div className="w-auto h-[350px] relative">
              <img
                src="/timelog/timepad1.png"
                alt="Main"
                className="w-auto h-[350px] object-contain shadow-xl shadow-teal-900"
              />
              <div className="absolute top-1/2 left-1/2 md:-left-2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
                <img
                  src="/timelog/tl3.png"
                  alt="Small Icon"
                  className="w-ful h-full rounded-xl shadow-xl shadow-teal-950"
                />
              </div>
              <div className="absolute top-2 left-1/2 md:-left-2 -translate-x-1 -translate-y-1/2 flex items-center justify-center">
                <img
                  src="/timelog/tl3.png"
                  alt="Small Icon"
                  className="w-ful h-full rounded-xl shadow-xl shadow-teal-950"
                />
              </div>
              <div className="md:hidden absolute bottom-20 left-1/2 -translate-x-1/2 translate-y-[90%] w-[90%] bg-white/90 backdrop-blur-md p-5 rounded-2xl shadow-lg text-center z-10">
                <h1 className="text-xl font-extrabold mb-2 text-[#00687a] uppercase">
                  Schedule Login
                </h1>
                <h2 className="text-base font-semibold mb-2 text-[#00687a]">
                  Start Counting from Your Schedule or Login Time
                </h2>
                <p className="text-[#00687a] text-sm leading-relaxed text-justify">
                  If an employee has a scheduled start time, the system will ask
                  if you want to begin counting from the schedule. Confirm to
                  start time tracking from the scheduled time automatically. If
                  there is no schedule, you can still login and time will start
                  counting from your login time secure and accurate.
                </p>
              </div>
            </div>
            <div className="hidden md:block absolute top-20 right-[-380px] max-w-xl bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-lg">
              <h1 className="text-3xl font-extrabold mb-3 text-[#00687a] uppercase">
                Schedule Login
              </h1>
              <h2 className="text-base font-semibold mb-2 text-[#00687a]">
                Start Counting from Your Schedule or Login Time
              </h2>
              <p className="text-[#00687a] text-sm leading-relaxed text-justify">
                If an employee has a scheduled start time, the system will ask
                if you want to begin counting from the schedule. Confirm to
                start time tracking from the scheduled time automatically. If
                there is no schedule, you can still login and time will start
                counting from your login time secure and accurate.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
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
