"use client";

import { useState } from "react";

export default function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    business: "",
    phone: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Contact form data:", form);
  };

  return (
    <section className="py-20">
      <div className="max-w-5xl mx-auto px-4">
        {/* ONE BOX */}
        <div className="bg-white rounded-xl shadow-xl shadow-[#00687a] overflow-hidden grid md:grid-cols-2">
          
          {/* LEFT IMAGE + TEXT */}
          <div
            className="
              relative bg-cover bg-center p-8 md:p-12
              flex items-center
            "
            style={{ backgroundImage: "url('/img3.png')" }}
          >
            {/* Overlay */}
            <div className="absolute inset-0 bg-[#00687a]/70" />

            {/* Content */}
            <div className="relative z-10 text-center md:text-left text-white">
              <h2 className="text-3xl font-extrabold mb-4">
                Curious?
              </h2>
              <p className="text-lg max-w-md mx-auto md:mx-0 opacity-95">
                Fill in the form below and our customer service team will contact
                you within <span className="font-semibold">24 hours</span> to
                discuss how Arbets-desk can help your business.
              </p>
            </div>
          </div>

          {/* FORM */}
          <div className="p-8 md:p-12">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-[#00687a] mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={form.name}
                  onChange={handleChange}
                  className="w-full border border-teal-100 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
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
                  value={form.email}
                  onChange={handleChange}
                  className="w-full border border-teal-100 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="john@company.com"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#00687a] mb-1">
                  Business Name
                </label>
                <input
                  type="text"
                  name="business"
                  value={form.business}
                  onChange={handleChange}
                  className="w-full border border-teal-100 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="My Business Ltd"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#00687a] mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full border border-teal-100 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="+46 70 123 45 67"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#00687a] hover:bg-teal-800 text-white font-semibold py-3 rounded-full transition shadow-md"
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
