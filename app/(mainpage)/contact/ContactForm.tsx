"use client";

import { submitContactForm } from "./contactActions";


export default function ContactForm() {
  return (
    <section className="py-20">
      <div className="max-w-5xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-xl shadow-[#00687a] overflow-hidden grid md:grid-cols-2">

          {/* LEFT SIDE (unchanged) */}
          <div className="relative overflow-hidden p-8 md:p-12 flex items-center">
            <div
              className="absolute inset-0 bg-no-repeat bg-center bg-cover md:bg-none"
              style={{ backgroundImage: "url('/img6.png')" }}
            />
            <div
              className="hidden md:block absolute -top-10 -left-10 w-[400px] h-[400px]
                         bg-no-repeat bg-contain rotate-[-90deg]"
              style={{ backgroundImage: "url('/img6.png')" }}
            />
            <div className="absolute inset-0 bg-[#00687a]/70" />
            <div className="relative z-10 text-white text-center">
              <h2 className="text-3xl font-extrabold mb-4">Curious?</h2>
              <p className="text-lg opacity-95">
                Fill in the form below and our customer service team will contact
                you within <span className="font-semibold">24 hours</span>.
              </p>
            </div>
          </div>

          {/* FORM */}
          <div className="p-8 md:p-12">
            <form action={submitContactForm} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-[#00687a] mb-1">
                  Full Name
                </label>
                <input
                  name="name"
                  required
                  className="w-full border border-teal-100 rounded-lg px-4 py-2
                             focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#00687a] mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  className="w-full border border-teal-100 rounded-lg px-4 py-2
                             focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="john@company.com"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#00687a] mb-1">
                  Business Name
                </label>
                <input
                  name="business"
                  className="w-full border border-teal-100 rounded-lg px-4 py-2
                             focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="My Business Ltd"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#00687a] mb-1">
                  Phone Number
                </label>
                <input
                  name="phone"
                  className="w-full border border-teal-100 rounded-lg px-4 py-2
                             focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="+46 70 123 45 67"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#00687a] hover:bg-teal-800 text-white
                           font-semibold py-3 rounded-full transition shadow-md"
              >
                Request a Call Back
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
