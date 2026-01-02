"use client";

import { useState } from "react";

// Mock shifts for step 2
const mockShifts = [
  "09:00 - 10:00",
  "10:00 - 11:00",
  "11:00 - 12:00",
  "12:00 - 13:00",
  "13:00 - 14:00",
  "14:00 - 15:00",
  "15:00 - 16:00",
  "16:00 - 17:00",
];

export default function BookDemoPopup() {
  const [step, setStep] = useState(1);
  const [trainingType, setTrainingType] = useState("");
  const [selectedShift, setSelectedShift] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    notes: "",
    consent: false,
  });

  const steps = ["Session Type", "Select Shift", "Fill Form", "Confirm"];

  // Navigate only if previous steps are filled
  const goToStep = (index: number) => {
    if (
      index === 1 ||
      (index === 2 && trainingType) ||
      (index === 3 && trainingType && selectedShift) ||
      (index === 4 && trainingType && selectedShift && formData.name && formData.email)
    ) {
      setStep(index);
    }
  };

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 4));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  // Type-safe handleChange for inputs and checkbox
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = () => {
    console.log({
      trainingType,
      selectedShift,
      ...formData,
    });
    alert("Booking submitted! Check console for data.");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Book a Demo</h2>

        {/* Step Header */}
        <div className="flex justify-between mb-6">
          {steps.map((label, index) => {
            const stepNum = index + 1;
            const isCompleted =
              (stepNum === 1) ||
              (stepNum === 2 && trainingType) ||
              (stepNum === 3 && trainingType && selectedShift) ||
              (stepNum === 4 && trainingType && selectedShift && formData.name && formData.email);

            return (
              <button
                key={label}
                onClick={() => goToStep(stepNum)}
                className={`flex-1 text-center px-2 py-1 rounded-md text-sm font-medium ${
                  stepNum === step
                    ? "bg-teal-600 text-white"
                    : isCompleted
                    ? "bg-teal-100 text-teal-700"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
                disabled={!isCompleted && stepNum !== step}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Step 1: Training / Demo */}
        {step === 1 && (
          <div className="space-y-4">
            <p>Select type of session:</p>
            <div className="flex flex-col gap-2">
              <label>
                <input
                  type="radio"
                  name="trainingType"
                  value="Training"
                  checked={trainingType === "Training"}
                  onChange={(e) => setTrainingType(e.target.value)}
                  className="mr-2"
                />
                Training
              </label>
              <label>
                <input
                  type="radio"
                  name="trainingType"
                  value="Demo"
                  checked={trainingType === "Demo"}
                  onChange={(e) => setTrainingType(e.target.value)}
                  className="mr-2"
                />
                Demo
              </label>
            </div>
          </div>
        )}

        {/* Step 2: Select Shift */}
        {step === 2 && (
          <div className="space-y-4">
            <p>Select a shift:</p>
            <select
              value={selectedShift}
              onChange={(e) => setSelectedShift(e.target.value)}
              className="border p-2 rounded w-full"
            >
              <option value="">-- Select Shift --</option>
              {mockShifts.map((shift) => (
                <option key={shift} value={shift}>
                  {shift}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Step 3: Fill Form */}
        {step === 3 && (
          <div className="space-y-3">
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              className="border p-2 rounded w-full"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="border p-2 rounded w-full"
            />
            <input
              type="text"
              name="phone"
              placeholder="Phone"
              value={formData.phone}
              onChange={handleChange}
              className="border p-2 rounded w-full"
            />
            <input
              type="text"
              name="company"
              placeholder="Company"
              value={formData.company}
              onChange={handleChange}
              className="border p-2 rounded w-full"
            />
            <textarea
              name="notes"
              placeholder="Any specific requirements"
              value={formData.notes}
              onChange={handleChange}
              className="border p-2 rounded w-full"
            />
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="consent"
                checked={formData.consent}
                onChange={handleChange}
              />
              Save my data for future bookings
            </label>
          </div>
        )}

        {/* Step 4: Confirm */}
        {step === 4 && (
          <div className="space-y-4">
            <h3 className="font-semibold">Confirm Your Booking</h3>
            <p>
              <strong>Type:</strong> {trainingType}
            </p>
            <p>
              <strong>Shift:</strong> {selectedShift}
            </p>
            <p>
              <strong>Name:</strong> {formData.name}
            </p>
            <p>
              <strong>Email:</strong> {formData.email}
            </p>
            <p>
              <strong>Phone:</strong> {formData.phone}
            </p>
            <p>
              <strong>Company:</strong> {formData.company}
            </p>
            <p>
              <strong>Notes:</strong> {formData.notes}
            </p>
            <p>
              <strong>Consent:</strong> {formData.consent ? "Yes" : "No"}
            </p>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          {step > 1 && (
            <button
              onClick={prevStep}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Back
            </button>
          )}
          {step < 4 ? (
            <button
              onClick={nextStep}
              disabled={(step === 1 && !trainingType) || (step === 2 && !selectedShift)}
              className={`px-4 py-2 rounded bg-teal-600 text-white hover:bg-teal-700 disabled:opacity-50`}
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
            >
              Confirm
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
