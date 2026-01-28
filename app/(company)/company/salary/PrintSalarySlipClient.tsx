"use client";

export default function PrintSalarySlipClient() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex justify-end max-w-4xl mx-auto my-4 print:hidden">
      <button
        onClick={handlePrint}
        className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700"
      >
        Download PDF
      </button>
    </div>
  );
}
