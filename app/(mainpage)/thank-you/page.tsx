export default function ThankYouPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md">
        <h1 className="text-2xl font-bold text-teal-600 mb-4">
          Thank You!
        </h1>
        <p className="text-gray-700 mb-4">
          We have received your booking request. 
        </p>
        <p className="text-gray-700">
          Our team will contact you within 24 hours to confirm your demo.
        </p>
      </div>
    </div>
  );
}
