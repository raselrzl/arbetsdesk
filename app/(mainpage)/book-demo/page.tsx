"use client";

import { useEffect, useState } from "react";

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
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    notes: "",
    consent: false,
  });

  const steps = ["Demo", "Time", "Information", "Confirm"];

  // Today (YYYY-MM-DD)
  const today = new Date().toISOString().split("T")[0];

  // Auto-select demo
  useEffect(() => {
    setTrainingType("Book a demo training");
  }, []);

  const isPastTime = (timeRange: string) => {
    if (!selectedDate) return false;
    if (selectedDate !== today) return false;

    const now = new Date();
    const startTime = timeRange.split(" - ")[0];
    const [hours, minutes] = startTime.split(":").map(Number);

    const slotTime = new Date();
    slotTime.setHours(hours, minutes, 0, 0);

    return slotTime <= now;
  };

  const goToStep = (index: number) => {
    if (
      index === 1 ||
      (index === 2 && trainingType) ||
      (index === 3 && trainingType && selectedDate && selectedTime) ||
      (index === 4 &&
        trainingType &&
        selectedDate &&
        selectedTime &&
        formData.name &&
        formData.email)
    ) {
      setStep(index);
    }
  };

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 4));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : value,
    }));
  };

  const handleSubmit = () => {
    console.log({
      trainingType,
      selectedDate,
      selectedTime,
      ...formData,
    });
    alert("Booking submitted! Check console for data.");
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-xs shadow-lg p-6 w-full max-w-[400px]">
        <h2 className="text-xl font-bold mb-4 text-center">Book a Demo</h2>

        {/* Step Header */}
        <div className="flex justify-between mb-6">
          {steps.map((label, index) => {
            const stepNum = index + 1;
            const isCompleted =
              stepNum === 1 ||
              (stepNum === 2 && trainingType) ||
              (stepNum === 3 && trainingType && selectedDate && selectedTime) ||
              (stepNum === 4 &&
                trainingType &&
                selectedDate &&
                selectedTime &&
                formData.name &&
                formData.email);

            return (
              <button
                key={label}
                onClick={() => goToStep(stepNum)}
                disabled={!isCompleted && stepNum !== step}
                className={`flex-1 px-2 py-1 text-sm font-medium ${
                  stepNum === step
                    ? "bg-teal-600 text-white"
                    : isCompleted
                    ? "bg-teal-100 text-teal-700"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* STEP 1 */}
        {step === 1 && (
          <input
            type="text"
            value={trainingType}
            disabled
            className="border p-2 rounded w-full bg-gray-100 text-gray-700 cursor-not-allowed"
          />
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div className="space-y-4">
            <input
              type="date"
              min={today}
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value);
                setSelectedTime("");
              }}
              className="border p-2 rounded w-full"
            />

            <div className="grid grid-cols-2 gap-2">
              {mockShifts.map((time) => {
                const disabled = isPastTime(time);

                return (
                  <button
                    key={time}
                    disabled={disabled}
                    onClick={() => setSelectedTime(time)}
                    className={`px-2 py-1 text-sm border rounded-xs ${
                      selectedTime === time
                        ? "bg-teal-600 text-white border-teal-600"
                        : disabled
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white border-gray-300 hover:border-teal-400"
                    }`}
                  >
                    {time}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 3 */}
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

        {/* STEP 4 */}
        {step === 4 && (
          <div className="space-y-2">
            <h3 className="font-semibold">Confirm Your Booking</h3>
            <p><strong>Type:</strong> {trainingType}</p>
            <p><strong>Date:</strong> {selectedDate}</p>
            <p><strong>Time:</strong> {selectedTime}</p>
            <p><strong>Name:</strong> {formData.name}</p>
            <p><strong>Email:</strong> {formData.email}</p>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          {step > 1 && (
            <button
              onClick={prevStep}
              className="px-4 py-1 bg-teal-100 rounded-xs hover:bg-teal-300"
            >
              Back
            </button>
          )}

          {step < 4 ? (
            <button
              onClick={nextStep}
              disabled={step === 2 && (!selectedDate || !selectedTime)}
              className="px-4 py-1 bg-teal-600 text-white rounded-xs hover:bg-teal-700 disabled:opacity-50"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="px-4 py-1 bg-green-600 text-white rounded-xs hover:bg-green-700"
            >
              Confirm
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
