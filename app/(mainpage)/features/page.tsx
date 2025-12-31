"use client";

import { Clock, Users, Calendar, DollarSign, BarChart2, FileText, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function FeaturesPage() {
  const features = [
    {
      title: "Digital Time Clock",
      img: "/h21.png",
      icon: <Clock className="w-6 h-6 text-teal-600" />,
      description:
        "A modern solution for time tracking that streamlines reporting for employees and managers.",
      points: [
        "Clock in and out easily",
        "Overview of working hours and deviations",
        "Automated notifications for approvals",
        "Compliant with electronic staff registers",
      ],
    },
    {
      title: "Efficient & Flexible Scheduling",
      img: "/h22.png",
      icon: <Calendar className="w-6 h-6 text-teal-600" />,
      description:
        "Manage staff schedules easily and adapt to changing circumstances.",
      points: [
        "Create and assign shifts quickly",
        "Optimize staffing levels based on data",
        "Simplifies day-to-day planning",
      ],
    },
    {
      title: "Reliable Payroll Management",
      img: "/ht2.png",
      icon: <DollarSign className="w-6 h-6 text-teal-600" />,
      description:
        "Automates payroll calculation for accurate and reliable employee payments.",
      points: [
        "Automatic transfer of working hours",
        "Shift premiums, vacation pay, and overtime calculated",
        "Reduces errors and saves time",
        "Transparent payroll workflow",
      ],
    },
    {
      title: "Actionable Insights",
      img: "/h1.png",
      icon: <BarChart2 className="w-6 h-6 text-teal-600" />,
      description:
        "Get a clear view of business metrics and make data-driven decisions.",
      points: [
        "Track labor costs and productivity",
        "Compare metrics with historical data",
        "Identify opportunities for improvement",
      ],
    },
    {
      title: "Automated Tip Distribution",
      img: "/h2.png",
      icon: <Users className="w-6 h-6 text-teal-600" />,
      description:
        "Distribute tips automatically based on predefined rules.",
      points: [
        "Automatic distribution according to rules",
        "Transparent documentation for accounting",
        "Eliminates manual calculations",
      ],
    },
    {
      title: "Employment Contracts & Certificates",
      img: "/h21.png",
      icon: <FileText className="w-6 h-6 text-teal-600" />,
      description:
        "Simplifies contract creation and digital document management.",
      points: [
        "Automatic digital contracts",
        "Centralized document storage",
        "Generate employer certificates with one click",
        "Reduces manual administration",
      ],
    },
    {
      title: "Simplified Communication",
      img: "/h22.png",
      icon: <MessageCircle className="w-6 h-6 text-teal-600" />,
      description:
        "Employees stay informed and managers communicate efficiently.",
      points: [
        "View schedules, payroll, and tips in the app",
        "Request shift swaps and availability",
        "Centralized messaging for managers",
        "Improves internal communication",
      ],
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-24">
      <h1 className="text-4xl font-bold text-center text-teal-600 mb-16">
        Arbetsdesk Features
      </h1>

      {features.map((feature, index) => {
        const isEven = index % 2 === 0;
        return (
          <motion.div
            key={index}
            whileHover={{ scale: 1.02 }}
            className="flex flex-col md:flex-row items-center gap-8"
          >
            {/* Points */}
            <div className={`md:w-1/2 ${isEven ? "order-1" : "order-2"}`}>
              <div className="flex items-center gap-3 mb-3">
                {feature.icon}
                <h2 className="text-2xl font-semibold text-teal-600">{feature.title}</h2>
              </div>
              <p className="text-gray-700 mb-4">{feature.description}</p>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                {feature.points.map((point, idx) => (
                  <li key={idx}>{point}</li>
                ))}
              </ul>
            </div>

            {/* Image */}
           {/* Image */}
<div className={`md:w-1/2 ${isEven ? "order-2" : "order-1"}`}>
  <div className="overflow-hidden rounded-xl shadow-md w-full h-80 md:h-96 flex items-center justify-center ">
    <img
      src={feature.img}
      alt={feature.title}
      className="object-contain w-full h-full"
    />
  </div>
</div>

          </motion.div>
        );
      })}

      <p className="text-center text-gray-500 mt-16">
        Arbetsdesk – Simplifying workforce management with smart digital solutions.
      </p>
    </div>
  );
}
