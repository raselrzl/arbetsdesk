import Link from "next/link";
import ContactForm from "./ContactForm";

export default function Contact() {
  return (
    <main className="">
      <ContactForm />

      {/* CONTACT OPTIONS */}
      <section className=" py-20">
        <div className="max-w-7xl mx-auto px-4 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {/* Sales */}
          <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition text-center">
            <h3 className="text-xl font-bold text-[#00687a] mb-3">
              Sales & Demo
            </h3>
            <p className="text-gray-600 mb-6">
              Interested in Arbets-desk? Book a demo and see how it fits your
              business.
            </p>
            <Link
              href="/book-demo"
              className="text-teal-600 font-semibold hover:underline"
            >
              Book a Demo →
            </Link>
          </div>

          {/* Support */}
          <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition text-center">
            <h3 className="text-xl font-bold text-[#00687a] mb-3">Support</h3>
            <p className="text-gray-600 mb-6">
              Already a customer? Our support team is ready to assist you.
            </p>
            <Link
              href="/login"
              className="text-teal-600 font-semibold hover:underline"
            >
              Go to Dashboard →
            </Link>
          </div>

          {/* General */}
          <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition text-center">
            <h3 className="text-xl font-bold text-[#00687a] mb-3">
              General Inquiries
            </h3>
            <p className="text-gray-600 mb-6">
              Have a question, feedback, or partnership idea? Let’s talk.
            </p>
            <a
              href="mailto:info@arbets-desk.com"
              className="text-teal-600 font-semibold hover:underline"
            >
              Email Us →
            </a>
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
