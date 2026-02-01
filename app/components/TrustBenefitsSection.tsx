"use client";

import React from "react";
import Image from "next/image";

export const TrustBenefitsSection: React.FC = () => {
  return (
    <section className="max-w-7xl mx-auto py-8 sm:py-16">
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
          <Image src="/icons/1.png" alt="No Binding Period" width={20} height={20} />
          <h4 className="font-medium">No Binding Period</h4>
        </div>

        <div className="flex gap-2 items-center whitespace-nowrap text-teal-900">
          <Image src="/icons/2.png" alt="Secure System" width={20} height={20} />
          <h4 className="font-medium">Secure System</h4>
        </div>

        <div className="flex gap-2 items-center whitespace-nowrap text-teal-900">
          <Image src="/icons/3.png" alt="No Credit Card Required" width={20} height={20} />
          <h4 className="font-medium">No Credit Card Required</h4>
        </div>

        <div className="flex gap-2 items-center whitespace-nowrap text-teal-900">
          <Image src="/icons/4.png" alt="Easy Installation" width={20} height={20} />
          <h4 className="font-medium">Easy Installation</h4>
        </div>

        <div className="flex gap-2 items-center whitespace-nowrap text-teal-900">
          <Image src="/icons/5.png" alt="Free Support" width={20} height={20} />
          <h4 className="font-medium">Free Support</h4>
        </div>
      </div>
    </section>
  );
};
