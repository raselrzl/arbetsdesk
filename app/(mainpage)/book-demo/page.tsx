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
  const today = new Date().toISOString().split("T")[0];

  // Auto-select ARBET DESK
  useEffect(() => {
    setTrainingType("ARBET DESK");
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
        formData.email &&
        formData.phone &&
        formData.company)
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
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = () => {
    console.log({
      trainingType,
      selectedDate,
      selectedTime,
      ...formData,
    });
    alert("Booking submitted!");
  };

  // Step validation: Step 2 requires date & time, Step 3 requires name, email, phone, company
  const isStepValid = () => {
    if (step === 2) return selectedDate && selectedTime;
    if (step === 3)
      return formData.name && formData.email && formData.phone && formData.company;
    return true;
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 sm:p-6">
      <div className="w-full max-w-md sm:max-w-lg md:max-w-xl bg-white shadow-lg">

        {/* HEADING */}
        <div className="w-full bg-teal-600 text-white text-center py-4 sm:py-6 uppercase text-xl sm:text-2xl font-bold">
          ARBET DESK
          <br />
          <span className="text-sm font-normal capitalize border-t border-teal-100 mt-2 block pt-1">
            Your first step to smarter workspace management
          </span>
        </div>

        <div className="p-4 sm:p-6">

          {/* Step Header - single row */}
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
                  formData.email &&
                  formData.phone &&
                  formData.company);

              return (
                <button
                  key={label}
                  onClick={() => goToStep(stepNum)}
                  disabled={!isCompleted && stepNum !== step}
                  className={`flex-1 px-2 py-1 text-sm sm:text-base font-medium border border-teal-100 ${
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
              className="border border-teal-100 p-2 w-full font-bold bg-teal-100 text-teal-700 cursor-not-allowed"
            />
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="space-y-4">
              {/* Timezone */}
              <div className="flex items-center justify-between bg-amber-200 border border-teal-100 p-2 rounded-sm">
                <span className="text-gray-700 font-semibold">Timezone:</span>
                <span className="text-gray-900 font-medium">
                  Stockholm, Sweden (CET)
                </span>
              </div>

              {/* Date Picker */}
              <input
                type="date"
                min={today}
                value={selectedDate}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  setSelectedTime("");
                }}
                className="border border-teal-100 p-2 w-full"
              />

              {/* Time Slots */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {mockShifts.map((time) => {
                  const disabled = isPastTime(time);

                  return (
                    <button
                      key={time}
                      disabled={disabled}
                      onClick={() => setSelectedTime(time)}
                      className={`px-2 py-1 text-sm sm:text-base border border-teal-100 ${
                        selectedTime === time
                          ? "bg-teal-600 text-white border-teal-600"
                          : disabled
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-white hover:border-teal-400"
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
                placeholder="Name *"
                value={formData.name}
                onChange={handleChange}
                className="border border-teal-100 p-2 w-full"
              />
              <input
                type="email"
                name="email"
                placeholder="Email *"
                value={formData.email}
                onChange={handleChange}
                className="border border-teal-100 p-2 w-full"
              />
              <input
                type="text"
                name="phone"
                placeholder="Phone *"
                value={formData.phone}
                onChange={handleChange}
                className="border border-teal-100 p-2 w-full"
              />
              <input
                type="text"
                name="company"
                placeholder="Company *"
                value={formData.company}
                onChange={handleChange}
                className="border border-teal-100 p-2 w-full"
              />
              <textarea
                name="notes"
                placeholder="Any specific requirements"
                value={formData.notes}
                onChange={handleChange}
                className="border border-teal-100 p-2 w-full"
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
            <div className="space-y-4">
              <h3 className="font-semibold text-lg sm:text-xl mb-2">
                Confirm Your Booking
              </h3>

              {/* Section 1: Type of Booking */}
              <div className="bg-white border border-teal-100 p-3">
                <h4 className="font-medium mb-1">Booking Type</h4>
                <p>{trainingType}</p>
              </div>

              {/* Section 2: Date, Time, Timezone */}
              <div className="bg-white border border-teal-100 p-3">
                <h4 className="font-medium mb-1">Date & Time</h4>
                <p>{selectedDate}</p>
                <p>{selectedTime} (Stockholm, Sweden)</p>
              </div>

              {/* Section 3: Your Information */}
              <div className="bg-white border border-teal-100 p-3">
                <h4 className="font-medium mb-2">Your Information</h4>
                <div className="grid grid-cols-3 gap-2 text-gray-700">
                  <div className="bg-teal-100 px-2 py-1 font-medium border border-teal-100 col-span-1">
                    Name
                  </div>
                  <div className="px-2 py-1 border border-teal-100 col-span-2">
                    {formData.name}
                  </div>

                  <div className="bg-teal-100 px-2 py-1 font-medium border border-teal-100 col-span-1">
                    Email
                  </div>
                  <div className="px-2 py-1 border border-teal-100 col-span-2">
                    {formData.email}
                  </div>

                  <div className="bg-teal-100 px-2 py-1 font-medium border border-teal-100 col-span-1">
                    Phone
                  </div>
                  <div className="px-2 py-1 border border-teal-100 col-span-2">
                    {formData.phone}
                  </div>

                  <div className="bg-teal-100 px-2 py-1 font-medium border border-teal-100 col-span-1">
                    Company
                  </div>
                  <div className="px-2 py-1 border border-teal-100 col-span-2">
                    {formData.company}
                  </div>

                  <div className="bg-teal-100 px-2 py-1 font-medium border border-teal-100 col-span-1">
                    Notes
                  </div>
                  <div className="px-2 py-1 border border-teal-100 col-span-2">
                    {formData.notes || "-"}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-6 gap-2 sm:gap-0">
            {step > 1 && (
              <button
                onClick={prevStep}
                className="px-4 py-2 bg-teal-100 hover:bg-teal-300 w-full sm:w-auto"
              >
                Back
              </button>
            )}

            {step < 4 ? (
              <button
                onClick={nextStep}
                disabled={!isStepValid()}
                className="px-4 py-2 bg-teal-600 text-white hover:bg-teal-700 w-full sm:w-auto disabled:opacity-50"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-green-600 text-white hover:bg-green-700 w-full sm:w-auto"
              >
                Confirm
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
