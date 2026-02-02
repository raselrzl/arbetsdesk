"use client";

import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { useState } from "react";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "What is Arbets-desk?",
    answer:
      "Arbets-desk is a business management tool designed to help you manage employees, schedules, payroll, and more all in one platform.",
  },
  {
    question: "How can I book a demo?",
    answer:
      "You can book a free 30-day demo by clicking the 'Book a Demo' link on our contact page. No cost, no binding period.",
  },
  {
    question: "Is there a support team?",
    answer:
      "Yes! Our support team is available weekdays 9-5 (closed for lunch). You can call or email us anytime during these hours.",
  },
  {
    question: "How do I contact support?",
    answer:
      "Email us at support@arbetdesk.com or call +46 70 123 45 67. Don’t hesitate to ask anything we’re happy to help!",
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-extrabold text-[#00687a] mb-10 text-center">
          Frequently Asked Questions
        </h1>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-md overflow-hidden"
            >
              <button
                className="w-full px-6 py-4 flex justify-between items-center text-left focus:outline-none"
                onClick={() => toggle(index)}
              >
                <span className="font-semibold text-[#00687a] text-lg">
                  {faq.question}
                </span>
                {openIndex === index ? (
                  <ChevronUpIcon className="w-5 h-5 text-teal-500" />
                ) : (
                  <ChevronDownIcon className="w-5 h-5 text-teal-500" />
                )}
              </button>
              {openIndex === index && (
                <div className="px-6 pb-4 text-gray-700">{faq.answer}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
