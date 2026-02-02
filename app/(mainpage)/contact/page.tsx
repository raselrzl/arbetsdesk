import Link from "next/link";
import ContactForm from "./ContactForm";
import { Mail, Phone } from "lucide-react";

export default function Contact() {
  return (
    <main className="">
      <ContactForm />

      {/* CONTACT OPTIONS */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 items-center">
          {/* Demo */}
<div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition text-center">
  <h3 className="text-xl font-bold text-[#00687a] mb-3">
    30-Day Free Demo
  </h3>

  <p className="text-gray-600 mb-4">
    Try Arbets-desk free for 30 days and see how it fits your business.
  </p>

  <ul className="text-gray-600 mb-6 space-y-1">
    <li>✓ No binding period</li>
    <li>✓ No setup cost</li>
    <li>✓ Free support included</li>
  </ul>

  <Link
    href="/book-demo"
    className="inline-block text-teal-600 font-semibold hover:underline"
  >
    Book a Free Demo →
  </Link>
</div>


          {/* Support (BIGGER CARD WITH IMAGE) */}
          <div className="bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition text-center lg:scale-105">
            {/* IMAGE */}
            <div className="mb-6 flex justify-center">
              <img
                src="/img6.png"
                alt="Support"
                className="h-20 w-20 object-contain"
              />
            </div>

            <h3 className="text-2xl font-bold text-[#00687a] mb-4">Support</h3>

            <p className="text-gray-600 mb-4 text-base">
              If you are already a customer and anything comes to your mind
              questions, issues, or just curiosity don’t hesitate to contact
              us.
            </p>

            <p className="text-gray-600 mb-6 text-base">
              We’re always happy to help. You can call us or email us anytime.
            </p>

            {/* CONTACT DETAILS */}
            <div className="flex flex-col gap-3 items-center mb-4">
              <a
                href="mailto:support@arbetdesk.com"
                className="flex items-center gap-2 text-teal-500 font-semibold hover:underline"
              >
                <Mail className="w-4 h-4" />
                support@arbetdesk.com
              </a>

              <a
                href="tel:+46701234567"
                className="flex items-center gap-2 text-teal-500 font-semibold hover:underline"
              >
                <Phone className="w-4 h-4" />
                +46 70 123 45 67
              </a>
            </div>

            {/* AVAILABILITY */}
            <p className="text-sm text-gray-500 mb-6">
              Weekdays <span className="font-semibold">09:00 – 17:00</span>{" "}
              <br />
              <span className="italic">Closed during lunch</span>
            </p>

            {/* FAQ LINK */}
            <Link
              href="/faq"
              className="text-teal-600 font-semibold hover:underline"
            >
              Your answer might already be there →
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
          {/* CONTACT DETAILS */}
            <div className="flex flex-col items-center">
              <a
                href="mailto:support@arbetdesk.com"
                className="flex items-center gap-2 text-teal-500 font-semibold hover:underline"
              >
                <Mail className="w-4 h-4" />
                contact@arbetdesk.com
              </a>
            </div>
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
