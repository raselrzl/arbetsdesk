"use client";

import React from "react";
import {
  ShieldCheck,
  CreditCard,
  Wrench,
  LifeBuoy,
  Clock,
} from "lucide-react";

export const TrustBenefitsSection: React.FC = () => {
  return (
    <section className="max-w-7xl mx-auto py-16">
      <div
        className="
          max-w-7xl mx-auto px-6 md:px-12
          flex flex-col md:flex-row
          items-center justify-center
          gap-6
        "
      >
        {/* Item */}
        <div className="flex gap-2 items-center whitespace-nowrap text-teal-900">
          <Clock size={20} />
          <h4 className="font-medium">No Binding Period</h4>
        </div>

        <div className="flex gap-2 items-center whitespace-nowrap text-teal-900">
          <ShieldCheck size={20} />
          <h4 className="font-medium">Secure System</h4>
        </div>

        <div className="flex gap-2 items-center whitespace-nowrap text-teal-900">
          <CreditCard size={20} />
          <h4 className="font-medium">No Credit Card Required</h4>
        </div>

        <div className="flex gap-2 items-center whitespace-nowrap text-teal-900">
          <Wrench size={20} />
          <h4 className="font-medium">Easy Installation</h4>
        </div>

        <div className="flex gap-2 items-center whitespace-nowrap text-teal-900">
          <LifeBuoy size={20} />
          <h4 className="font-medium">Free Support</h4>
        </div>
      </div>
    </section>
  );
};
